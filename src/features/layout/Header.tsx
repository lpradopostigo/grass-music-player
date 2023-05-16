import { appWindow } from "@tauri-apps/api/window";
import Icon from "../../components/Icon";
import clsx from "clsx";
import { useNavigate } from "@solidjs/router";
import MenuBar from "../../components/MenuBar";
import { makeEventListener } from "@solid-primitives/event-listener";
import { onMount } from "solid-js";

function Header() {
  const navigate = useNavigate();

  let inputEl: HTMLInputElement | undefined;

  function handleSearchInputKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value;

      if (value.trim() === "") return;

      navigate(`/search?query=${value}`);
    }
  }

  onMount(() => {
    makeEventListener(document, "keydown", (event) => {
      if (event.target === inputEl) return;

      const regex = /^[a-z0-9]$/i;

      if (regex.test(event.key)) {
        inputEl!.focus();
      }
    });
  });

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
          onKeyDown={handleSearchInputKeyDown}
        />
      </div>

      <WindowButtons />
    </div>
  );
}

function WindowButtons() {
  return (
    <div class="flex self-start">
      <WindowButton onClick={appWindow.minimize} type="minimize" />
      <WindowButton onClick={appWindow.maximize} type="maximize" />
      <WindowButton onClick={appWindow.close} type="close" />
    </div>
  );
}

function WindowButton(props: {
  onClick: () => void;
  type: "minimize" | "maximize" | "close";
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
