import { createSignal, onCleanup } from "solid-js";
import { appWindow } from "@tauri-apps/api/window";
import clsx from "clsx";
import Icon from "../../../components/Icon.tsx";

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

export default WindowButtons;
