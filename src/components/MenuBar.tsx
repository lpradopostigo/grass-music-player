import { For, createMemo } from "solid-js";
import { A, useLocation, useResolvedPath } from "@solidjs/router";
import clsx from "clsx";
import { preventAutoFocus } from "./Grid";

function MenuBar(props: MenuBarProps) {
  const location = useLocation();

  let containerEl!: HTMLDivElement;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.altKey) return;

    const children = Array.from(containerEl.children) as HTMLAnchorElement[];
    const currentIndex = children.findIndex(
      (child) => child === document.activeElement
    );

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        preventAutoFocus();
        const nextIndex =
          currentIndex === 0 ? children.length - 1 : currentIndex - 1;
        children[nextIndex].focus();
        children[nextIndex].click();
        break;
      }
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        preventAutoFocus();
        const nextIndex = (currentIndex + 1) % children.length;
        children[nextIndex].focus();
        children[nextIndex].click();

        break;
      }
    }
  }

  return (
    <div
      ref={containerEl}
      onKeyDown={handleKeyDown}
      class={clsx("flex gap-2 uppercase", props.class)}
    >
      <For each={props.data}>
        {(item) => {
          const to = useResolvedPath(() => item.href);
          const isActive = createMemo(() => {
            const toValue = to();
            if (toValue === undefined) return false;
            const path = normalizePath(
              toValue.split(/[?#]/, 1)[0]
            ).toLowerCase();
            return normalizePath(location.pathname)
              .toLowerCase()
              .startsWith(path);
          });

          return (
            <A
              tabindex={isActive() ? 0 : -1}
              activeClass="font-bold"
              href={item.href}
            >
              {item.label}
            </A>
          );
        }}
      </For>
    </div>
  );
}

const trimPathRegex = /^\/+|(\/)\/+$/g;

function normalizePath(path: string, omitSlash = false) {
  const s = path.replace(trimPathRegex, "$1");
  return s ? (omitSlash || /^[?#]/.test(s) ? s : "/" + s) : "";
}

type MenuBarProps = {
  data: {
    href: string;
    label: string;
  }[];
} & Pick<ComponentCommonProps, "class">;

export default MenuBar;
