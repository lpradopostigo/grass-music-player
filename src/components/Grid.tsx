import { createEffect, createSignal, For, JSX, Show } from "solid-js";
import clsx from "clsx";
import { mergeRefs, Ref } from "@solid-primitives/refs";
import { Dynamic } from "solid-js/web";
import { useIsRouting } from "@solidjs/router";

function Grid(props: GridProps) {
  const [containerEl, setContainerEl] = createSignal<HTMLDivElement>();
  const isRouting = useIsRouting();

  createEffect(() => {
    const containerElValue = containerEl();

    if (!containerElValue || isRouting() || props.data?.length === 0) return;

    const allGridItems = containerElValue.querySelectorAll(
      "[data-grid-group-items] > *"
    ) as NodeListOf<HTMLElement>;

    const savedPosition = props.storageKey
      ? savedPositions[props.storageKey]
      : null;

    const indexToFocus = savedPosition ?? 0;

    for (let index = 0; index < allGridItems.length; index++) {
      const child = allGridItems[index] as HTMLElement;

      if (index === indexToFocus) {
        child.tabIndex = 0;

        if (autoFocusIsPrevented) {
          allowAutoFocus();
        } else if (props.autofocus) {
          child.focus();
        }
      } else {
        child.tabIndex = -1;
      }

      child.setAttribute("data-grid-item", "true");
    }
  });

  function handleClick(event: MouseEvent) {
    const clickedGridItem = (event.target as HTMLElement).closest(
      "[data-grid-item]"
    ) as HTMLElement | null;

    if (!clickedGridItem) return;

    const allGridItems = containerEl()!.querySelectorAll(
      "[data-grid-group-items] > *"
    ) as NodeListOf<HTMLElement>;

    if (props.storageKey) {
      savedPositions[props.storageKey] =
        Array.from(allGridItems).indexOf(clickedGridItem);
    }
  }

  // eslint-disable-next-line complexity
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

      if (props.storageKey) {
        savedPositions[props.storageKey] = (nextGroupIndex + 1) * nextItemIndex;
      }
    }

    switch (event.key) {
      case "Home": {
        event.preventDefault();
        handleNextItemFocus(0, 0);
        break;
      }

      case "End": {
        event.preventDefault();
        handleNextItemFocus(
          gridGroups.length - 1,
          gridGroups[gridGroups.length - 1].children.length - 1
        );
        break;
      }

      case "ArrowLeft": {
        // try to focus the previous item in the same group
        let nextGroupIndex = gridGroupIndex;
        let nextItemIndex = gridGroupItemIndex - 1;

        // if there is no previous item in the same group, focus the last item in the previous group
        if (gridGroupItemIndex === 0) {
          nextGroupIndex =
            gridGroupIndex === 0 ? gridGroups.length - 1 : gridGroupIndex - 1;
          nextItemIndex = gridGroups[nextGroupIndex].children.length - 1;
        }

        handleNextItemFocus(nextGroupIndex, nextItemIndex);
        break;
      }

      case "ArrowRight": {
        // try to focus the next item in the same group
        let nextGroupIndex = gridGroupIndex;
        let nextItemIndex = gridGroupItemIndex + 1;

        // if there is no next item in the same group, focus the first item in the next group
        if (gridGroupItemIndex === gridGroupChildren.length - 1) {
          nextGroupIndex =
            gridGroupIndex === gridGroups.length - 1 ? 0 : gridGroupIndex + 1;
          nextItemIndex = 0;
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

        // try to focus the next item in the same column of the same group
        let nextGroupIndex = gridGroupIndex;
        let nextItemIndex = gridGroupItemIndex + columns;

        if (noChildBelowGroupRow && !isGroupLastRow) {
          nextItemIndex = gridGroups[nextGroupIndex].children.length - 1;
        } else if (isGroupLastRow) {
          nextGroupIndex = isLastGroup ? 0 : gridGroupIndex + 1;

          nextItemIndex = gridGroups[nextGroupIndex].children[
            gridGroupItemIndex % columns
          ]
            ? gridGroupItemIndex % columns
            : gridGroups[nextGroupIndex].children.length - 1;
        }

        handleNextItemFocus(nextGroupIndex, nextItemIndex);
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        const { columns } = getGridSize(gridGroups[gridGroupIndex]);

        const isGroupFirstRow = gridGroupItemIndex < columns;

        // try to focus the previous item in the same column of the same group
        let nextGroupIndex = gridGroupIndex;
        let nextItemIndex = gridGroupItemIndex - columns;

        if (isGroupFirstRow) {
          nextGroupIndex =
            gridGroupIndex === 0 ? gridGroups.length - 1 : gridGroupIndex - 1;

          const nextGroupLength = gridGroups[nextGroupIndex].children.length;

          const nextGroupLastRowColumns =
            nextGroupLength % columns === 0
              ? columns
              : nextGroupLength % columns;

          nextItemIndex =
            nextGroupLastRowColumns - 1 < gridGroupItemIndex
              ? nextGroupLength - 1
              : nextGroupLength -
                (nextGroupLastRowColumns - gridGroupItemIndex);
        }

        handleNextItemFocus(nextGroupIndex, nextItemIndex);
        break;
      }
    }
  }

  return (
    <div
      onClick={handleClick}
      ref={mergeRefs(setContainerEl, props.ref)}
      class={clsx("flex flex-col gap-4", props.class)}
      onKeyDown={handleKeyDown}
    >
      <For each={props.data}>
        {(subGrid) => (
          <Show when={subGrid.subGridData && subGrid.subGridData.length !== 0}>
            <div>
              <Show when={subGrid.subGridLabel}>
                <div class="w-min bg-black pl-4 pr-2 text-lg font-bold uppercase text-white">
                  {subGrid.subGridLabel}
                </div>
              </Show>
              <div
                data-grid-group-items="true"
                class={clsx("grid content-start gap-3", props.subGridClass)}
                style={{
                  "grid-template-columns": `repeat(auto-fill, 128px)`,
                }}
              >
                <For each={subGrid.subGridData}>
                  {(dataItem) => (
                    <Dynamic component={subGrid.item} dataItem={dataItem} />
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

const savedPositions: Record<string, number> = {};
let autoFocusIsPrevented = false;

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

type GridProps = {
  data?: {
    subGridData?: any[];
    item: (props: { dataItem: any }) => JSX.Element;
    subGridLabel?: string;
  }[];
  /** The key used to save the focused item position across app navigation. */
  storageKey?: string;
  /**
   * If true and autofocus is not prevented, will focus the saved item position
   * on mount if none is saved, will focus the first item.
   */
  autofocus?: boolean;
  subGridClass?: ComponentCommonProps["class"];
  ref?: Ref<HTMLDivElement>;
} & Pick<ComponentCommonProps, "class">;

export { preventAutoFocus, allowAutoFocus };
export type { GridProps };
export default Grid;
