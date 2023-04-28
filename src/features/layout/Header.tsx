import { appWindow } from "@tauri-apps/api/window";
import Icon from "../../components/Icon";
import clsx from "clsx";
import { A } from "@solidjs/router";
import MenuBar from "../../components/MenuBar";

function Header() {
  return (
    <div
      class="flex w-full items-center justify-between pl-4"
      data-tauri-drag-region="true"
    >
      <MenuBar
        class="py-2.5"
        data={[
          { href: "/home", label: "home" },
          { href: "/library", label: "library" },
          { href: "/playlists", label: "playlists" },
          { href: "/preferences", label: "preferences" },
        ]}
      />

      <div class="relative">
        <div class="absolute grid h-full w-7 place-content-center">
          <Icon width="16" height="16" name="magnifying-glass" />
        </div>
        <input class="py-0.5 pl-7 pr-0.5" type="text" />
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
