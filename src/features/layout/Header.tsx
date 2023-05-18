import { appWindow } from "@tauri-apps/api/window";
import Icon from "../../components/Icon";
import clsx from "clsx";
import { useLocation, useNavigate, useSearchParams } from "@solidjs/router";
import MenuBar from "../../components/MenuBar";
import { makeEventListener } from "@solid-primitives/event-listener";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  let inputEl: HTMLInputElement | undefined;
  const debouncedNavigate = debounce((query: string) => {
    navigate(`/search?query=${query}`);
  }, 250);

  createEffect(() => {
    if (location.pathname === "/search") {
      inputEl!.value = params.query;
      return;
    }

    inputEl!.value = "";
  });

  onMount(() => {
    makeEventListener(document, "keydown", (event) => {
      if (event.target === inputEl) return;

      const regex = /^[a-z0-9]$/i;

      if (regex.test(event.key)) {
        inputEl!.focus();
      }
    });
  });

  function handleSearchInput(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    debouncedNavigate(value);
  }

  return (
    <div
      class="flex w-full items-center justify-between shadow"
      data-tauri-drag-region="true"
    >
      <MenuBar
        class="py-2.5 pl-4"
        data={[
          { href: "/releases", label: "releases" },
          { href: "/artists", label: "artists" },
          { href: "/playlists", label: "playlists" },
          { href: "/preferences", label: "preferences" },
        ]}
      />

      <div class="relative flex-shrink">
        <div class="absolute grid h-full w-7 place-content-center">
          <Icon width="16" height="16" name="magnifying-glass" />
        </div>
        <input
          ref={inputEl}
          class="w-full py-0.5 pl-7 pr-0.5"
          type="text"
          onInput={handleSearchInput}
        />
      </div>

      <WindowButtons />
    </div>
  );
}

function WindowButtons() {
  const [windowIsMaximized, setWindowIsMaximized] = createSignal(false);

  const unlisten = appWindow.onResized(async () => {
    const isMaximized = await appWindow.isMaximized();
    setWindowIsMaximized(isMaximized);
  });

  onCleanup(async () => {
    (await unlisten)();
  });

  return (
    <div class="flex self-start">
      <WindowButton onClick={appWindow.minimize} type="minimize" />
      <WindowButton
        onClick={
          windowIsMaximized() ? appWindow.unmaximize : appWindow.maximize
        }
        type={windowIsMaximized() ? "restore" : "maximize"}
      />
      <WindowButton onClick={appWindow.close} type="close" />
    </div>
  );
}

function WindowButton(props: {
  onClick: () => void;
  type: "minimize" | "maximize" | "close" | "restore";
}) {
  return (
    <div
      class={clsx(
        "grid h-[32px] w-[48px] place-content-center",
        props.type === "close"
          ? "hover:bg-[#d70015] hover:text-white"
          : "hover:bg-[#ebebf0]"
      )}
      onClick={() => props.onClick()}
    >
      <Icon name={props.type} class="text-[16px]" />
    </div>
  );
}

export default Header;
