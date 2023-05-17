import { createMemo, Index } from "solid-js";
import { A } from "@solidjs/router";
import clsx from "clsx";
import { preventAutoFocus } from "./Grid";
import useRouteIsActive from "../hooks/useRouteIsActive";

function MenuBar(props: MenuBarProps) {
  let containerEl!: HTMLDivElement;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.altKey) return;

    const children = Array.from(containerEl.children) as HTMLAnchorElement[];
    const currentIndex = children.findIndex(
      (child) => child === document.activeElement
    );

    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        preventAutoFocus();
        const nextIndex =
          currentIndex === 0 ? children.length - 1 : currentIndex - 1;
        children[nextIndex].focus();
        children[nextIndex].click();
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        preventAutoFocus();
        const nextIndex = (currentIndex + 1) % children.length;
        children[nextIndex].focus();
        children[nextIndex].click();

        break;
      }
    }
  }

  const activeRouteIndex = () => {
    for (const [index, { href }] of props.data.entries()) {
      const routeIsActive = useRouteIsActive(href);
      if (routeIsActive()) return index;
    }

    return -1;
  };

  return (
    <div
      ref={containerEl}
      onKeyDown={handleKeyDown}
      class={clsx("flex gap-2 uppercase", props.class)}
    >
      <Index each={props.data}>
        {(item, index) => {
          const tabIndex = () => {
            const activeRouteIndexValue = activeRouteIndex();

            if (
              (activeRouteIndexValue === -1 && index === 0) ||
              activeRouteIndexValue === index
            ) {
              return 0;
            }

            return -1;
          };

          return (
            <A
              class={clsx("outline-[currentColor]", props.itemClass)}
              tabindex={tabIndex()}
              activeClass={clsx("font-bold", props.itemActiveClass)}
              href={item().href}
            >
              {item().label}
            </A>
          );
        }}
      </Index>
    </div>
  );
}

type MenuBarProps = {
  data: {
    href: string;
    label: string;
  }[];
  itemActiveClass?: string;
  itemClass?: string;
} & Pick<ComponentCommonProps, "class">;

export default MenuBar;
