import { createEffect, createSignal, For, JSX, mergeProps } from "solid-js";
import { mergeRefs, Ref } from "@solid-primitives/refs";
import clsx from "clsx";
import { Dynamic } from "solid-js/web";
import { useIsRouting } from "@solidjs/router";

const savedIndices: Record<string, number> = {};
let autoFocusIsPrevented = false;

function Grid<T>(props: GridProps<T>) {
  const localProps = mergeProps(
    {
      data: [] as T[],
      columnSize: "1fr",
    },
    props
  );

  const [containerEl, setContainerEl] = createSignal<HTMLDivElement>();

  const isRouting = useIsRouting();

  createEffect(() => {
    const containerElValue = containerEl();

    if (!containerElValue || isRouting() || localProps.data.length === 0)
      return;

    const indexToFocus =
      localProps.saveIndexKey && savedIndices[localProps.saveIndexKey]
        ? savedIndices[localProps.saveIndexKey]
        : 0;

    for (let index = 0; index < containerElValue.children.length; index++) {
      const child = containerElValue.children[index] as HTMLElement;

      if (index === indexToFocus) {
        child.tabIndex = indexToFocus;

        if (autoFocusIsPrevented) {
          allowAutoFocus();
        } else if (localProps.autofocus) {
          child.focus();
        }
      } else {
        child.tabIndex = -1;
      }

      child.setAttribute("data-grid-item", "true");
    }
  });

  const gridSize = () => {
    const containerElValue = containerEl();
    if (!containerElValue || localProps.data.length === 0)
      return { columns: 0, rows: 0 };

    const computedStyle = getComputedStyle(containerElValue);
    const columns = computedStyle
      .getPropertyValue("grid-template-columns")
      .replace(" 0px", "")
      .split(" ").length;
    const rows = Math.ceil(localProps.data.length / columns);
    return { columns, rows };
  };

  function handleKeyDown(event: KeyboardEvent) {
    const containerElValue = containerEl();

    if (!containerElValue || event.altKey) return;

    const children = Array.from(containerElValue.children) as HTMLElement[];
    const currentIndex = children.findIndex(
      (child) => child === document.activeElement
    );

    const updateTabIndex = (nextIndex: number) => {
      children[currentIndex].tabIndex = -1;
      children[nextIndex].tabIndex = 0;
      if (localProps.saveIndexKey) {
        savedIndices[localProps.saveIndexKey] = nextIndex;
      }
    };

    switch (event.key) {
      case "ArrowLeft": {
        const nextIndex =
          currentIndex === 0 ? children.length - 1 : currentIndex - 1;
        updateTabIndex(nextIndex);
        children[nextIndex].focus();
        break;
      }

      case "ArrowRight": {
        const nextIndex = (currentIndex + 1) % children.length;
        updateTabIndex(nextIndex);
        children[nextIndex].focus();
        break;
      }

      case "ArrowDown": {
        event.preventDefault();

        const { columns, rows } = gridSize();

        const isLastRow = currentIndex >= (rows - 1) * columns;
        const noChildBelow = currentIndex + columns >= children.length;

        let nextIndex;
        if (isLastRow) {
          nextIndex = 0;
        } else if (noChildBelow) {
          nextIndex = children.length - 1;
        } else {
          nextIndex = currentIndex + columns;
        }

        children[nextIndex].focus();
        children[nextIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        updateTabIndex(nextIndex);
        break;
      }

      case "ArrowUp": {
        event.preventDefault();

        const { columns } = gridSize();

        const isFirstRow = currentIndex < columns;

        const nextIndex = isFirstRow
          ? children.length - 1
          : currentIndex - columns;

        children[nextIndex].focus();
        children[nextIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        updateTabIndex(nextIndex);
      }
    }
  }

  function handleClick(event: MouseEvent) {
    const containerElValue = containerEl()!;

    const clickedChild = (event.target as HTMLElement).closest(
      "[data-grid-item]"
    ) as HTMLElement;

    if (localProps.saveIndexKey) {
      savedIndices[localProps.saveIndexKey] =
        Array.from(containerElValue.children).indexOf(clickedChild) ?? 0;
    }

    const lastActiveChild = containerElValue.querySelector(
      "[data-grid-item][tabindex='0']"
    ) as HTMLElement;

    if (lastActiveChild && clickedChild) {
      lastActiveChild.tabIndex = -1;
      clickedChild.tabIndex = 0;
    }
  }

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleClick}
      onKeyDown={handleKeyDown}
      class={clsx("grid content-start gap-3", localProps.class)}
      ref={mergeRefs(props.ref, setContainerEl)}
      style={{
        "grid-template-columns": `repeat(auto-fill, ${localProps.columnSize})`,
      }}
    >
      <For each={localProps.data}>
        {(item) => <Dynamic component={localProps.children} dataItem={item} />}
      </For>
    </div>
  );
}

function preventAutoFocus() {
  autoFocusIsPrevented = true;
}

function allowAutoFocus() {
  autoFocusIsPrevented = false;
}

type GridProps<T> = {
  data?: T[];
  columnSize?: string;
  saveIndexKey?: string;
  autofocus?: boolean;
  ref?: Ref<HTMLDivElement>;
  children: (props: { dataItem: T }) => JSX.Element;
} & Pick<ComponentCommonProps, "class">;

export type { GridProps };
export { preventAutoFocus, allowAutoFocus };
export default Grid;
