import { Index } from "solid-js";
import { A } from "@solidjs/router";
import { preventAutoFocus } from "../../../components/Grid.tsx";
import useRouteIsActive from "../../../hooks/useRouteIsActive.ts";

const data = [
  { href: "/releases", label: "releases" },
  { href: "/artists", label: "artists" },
  { href: "/playlists", label: "playlists" },
  { href: "/preferences", label: "preferences" },
];

function MenuBar() {
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
    for (const [index, { href }] of data.entries()) {
      const routeIsActive = useRouteIsActive(href);
      if (routeIsActive()) return index;
    }

    return -1;
  };

  return (
    <div
      ref={containerEl}
      onKeyDown={handleKeyDown}
      class="flex gap-2 py-2.5 uppercase"
    >
      <Index each={data}>
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
            <A tabindex={tabIndex()} activeClass="font-bold" href={item().href}>
              {item().label}
            </A>
          );
        }}
      </Index>
    </div>
  );
}

export default MenuBar;
