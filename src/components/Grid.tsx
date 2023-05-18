import { createEffect, createSignal, For, Index, JSX, Show } from "solid-js";
import clsx from "clsx";
import { mergeRefs, Ref } from "@solid-primitives/refs";
import { Dynamic } from "solid-js/web";
import { useIsRouting } from "@solidjs/router";

const savedPositions: Record<string, number> = {};
let autoFocusIsPrevented = false;

function Grid(props: GridGroupProps) {
  const [containerEl, setContainerEl] = createSignal<HTMLDivElement>();
  const isRouting = useIsRouting();

  createEffect(() => {
    const containerElValue = containerEl();

    if (!containerElValue || isRouting() || props.data?.length === 0) return;

    const allGridItems = containerElValue.querySelectorAll(
      "[data-grid-group-items] > *"
    ) as NodeListOf<HTMLElement>;

    const savedPosition = props.focusedItemPositionKey
      ? savedPositions[props.focusedItemPositionKey]
      : null;

    const indexToFocus = savedPosition ?? 0;

    for (let index = 0; index < allGridItems.length; index++) {
      const child = allGridItems[index] as HTMLElement;

      if (index === indexToFocus) {
        child.tabIndex = indexToFocus;

        if (autoFocusIsPrevented) {
          allowAutoFocus();
        } else if (props.autofocus) {
          child.focus();
        }
      } else {
        child.tabIndex = -1;
      }
    }
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.altKey) return;

    const gridGroups = Array.from(
      containerEl()!.querySelectorAll("[data-grid-group-items]")
    ) as HTMLDivElement[];

    const gridGroupIndex = gridGroups.findIndex((group) =>
      group.contains(event.target as HTMLElement)
    );

    const gridGroupChildren = Array.from(
      gridGroups[gridGroupIndex].children
    ) as HTMLElement[];

    const gridGroupItemIndex = gridGroupChildren.findIndex(
      (child) => child === document.activeElement
    );

    function handleNextItemFocus(
      nextGroupIndex: number,
      nextItemIndex: number
    ) {
      (
        gridGroups[nextGroupIndex].children[nextItemIndex] as HTMLElement
      ).focus();

      (
        gridGroups[nextGroupIndex].children[nextItemIndex] as HTMLElement
      ).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      (
        gridGroups[gridGroupIndex].children[gridGroupItemIndex] as HTMLElement
      ).tabIndex = -1;
      (
        gridGroups[nextGroupIndex].children[nextItemIndex] as HTMLElement
      ).tabIndex = 0;

      if (props.focusedItemPositionKey) {
        savedPositions[props.focusedItemPositionKey] =
          (nextGroupIndex + 1) * nextItemIndex;
      }
    }

    switch (event.key) {
      case "ArrowLeft": {
        let nextGroupIndex;
        let nextItemIndex;

        if (gridGroupItemIndex === 0) {
          if (gridGroupIndex === 0) {
            nextGroupIndex = gridGroups.length - 1;
          } else {
            nextGroupIndex = gridGroupIndex - 1;
          }
          nextItemIndex = gridGroups[nextGroupIndex].children.length - 1;
        } else {
          nextGroupIndex = gridGroupIndex;
          nextItemIndex = gridGroupItemIndex - 1;
        }

        handleNextItemFocus(nextGroupIndex, nextItemIndex);

        break;
      }

      case "ArrowRight": {
        let nextGroupIndex;
        let nextItemIndex;

        if (gridGroupItemIndex === gridGroupChildren.length - 1) {
          if (gridGroupIndex === gridGroups.length - 1) {
            nextGroupIndex = 0;
          } else {
            nextGroupIndex = gridGroupIndex + 1;
          }
          nextItemIndex = 0;
        } else {
          nextGroupIndex = gridGroupIndex;
          nextItemIndex = gridGroupItemIndex + 1;
        }

        handleNextItemFocus(nextGroupIndex, nextItemIndex);

        break;
      }

      case "ArrowDown": {
        event.preventDefault();
        const { columns, rows } = getGridSize(gridGroups[gridGroupIndex]);

        const noChildBelowGroupRow =
          gridGroupItemIndex + columns >= gridGroupChildren.length;

        const isLastGroup = gridGroupIndex === gridGroups.length - 1;
        const isGroupLastRow = gridGroupItemIndex >= (rows - 1) * columns;

        let nextGroupIndex;
        let nextItemIndex;

        if (isGroupLastRow) {
          if (isLastGroup) {
            nextGroupIndex = 0;
            nextItemIndex = 0;
          } else {
            nextGroupIndex = gridGroupIndex + 1;
            nextItemIndex = 0;
          }
        } else if (noChildBelowGroupRow) {
          nextGroupIndex = gridGroupIndex;
          nextItemIndex =
            gridGroupItemIndex - (gridGroupItemIndex % columns) + columns;
        } else {
          nextGroupIndex = gridGroupIndex;
          nextItemIndex = gridGroupItemIndex + columns;
        }

        handleNextItemFocus(nextGroupIndex, nextItemIndex);

        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        const { columns } = getGridSize(gridGroups[gridGroupIndex]);

        const noChildAboveGroupRow = gridGroupItemIndex - columns < 0;

        const isFirstGroup = gridGroupIndex === 0;

        let nextGroupIndex;
        let nextItemIndex;

        if (noChildAboveGroupRow) {
          if (isFirstGroup) {
            nextGroupIndex = gridGroups.length - 1;
            nextItemIndex = gridGroups[nextGroupIndex].children.length - 1;
          } else {
            nextGroupIndex = gridGroupIndex - 1;
            nextItemIndex = gridGroups[nextGroupIndex].children.length - 1;
          }
        } else {
          nextGroupIndex = gridGroupIndex;
          nextItemIndex = gridGroupItemIndex - columns;
        }

        handleNextItemFocus(nextGroupIndex, nextItemIndex);

        break;
      }
    }
  }

  return (
    <div
      ref={mergeRefs(setContainerEl, props.ref)}
      class={clsx("flex flex-col gap-4", props.class)}
      onKeyDown={handleKeyDown}
    >
      <For each={props.data}>
        {(group) => (
          <Show when={group.groupData?.length !== 0}>
            <div>
              <Show when={group.groupLabel}>
                <div class="w-min bg-black pl-4 pr-2 text-xl font-bold text-white">
                  {group.groupLabel}
                </div>
              </Show>
              <div
                data-grid-group-items="true"
                class={clsx("grid content-start gap-3", props.gridClass)}
                style={{
                  "grid-template-columns": `repeat(auto-fill, 128px)`,
                }}
              >
                <For each={group.groupData}>
                  {(dataItem) => (
                    <Dynamic component={group.item} dataItem={dataItem} />
                  )}
                </For>
              </div>
            </div>
          </Show>
        )}
      </For>
    </div>
  );
}

function getGridSize(element: HTMLDivElement) {
  const computedStyle = getComputedStyle(element);
  const columns = computedStyle
    .getPropertyValue("grid-template-columns")
    .replace(" 0px", "")
    .split(" ").length;
  const rows = Math.ceil(element.children.length / columns);
  return { columns, rows };
}

function preventAutoFocus() {
  autoFocusIsPrevented = true;
}

function allowAutoFocus() {
  autoFocusIsPrevented = false;
}

type GridGroupProps = {
  data?: {
    groupData?: any[];
    item: (props: { dataItem: any }) => JSX.Element;
    groupLabel?: string;
  }[];
  /** The key used to save the focused item position across app navigation. */
  focusedItemPositionKey?: string;
  /**
   * If true and autofocus is not prevented, will focus the saved item position
   * on mount if none is saved, will focus the first item.
   */
  autofocus?: boolean;
  gridClass?: ComponentCommonProps["class"];
  ref?: Ref<HTMLDivElement>;
} & Pick<ComponentCommonProps, "class">;

export { preventAutoFocus, allowAutoFocus };

export type { GridGroupProps };

export default Grid;
