import classes from "./TitleBar.module.css";
import { appWindow } from "@tauri-apps/api/window";
import {
  VsChromeClose,
  VsChromeMaximize,
  VsChromeMinimize,
} from "solid-icons/vs";
import { useTitleBarTheme } from "./TitleBarThemeProvider";
import clsx from "clsx";

export default function TitleBar() {
  const { backgroundIsDark } = useTitleBarTheme();

  return (
    <div
      data-tauri-drag-region={true}
      class={clsx(classes.titleBar, backgroundIsDark() && classes.titleBarAlt)}
    >
      <div onClick={appWindow.minimize} class={classes.titleBarButton}>
        <VsChromeMinimize />
      </div>

      <div onClick={appWindow.maximize} class={classes.titleBarButton}>
        <VsChromeMaximize />
      </div>

      <div
        onClick={appWindow.close}
        class={clsx(classes.titleBarButton, classes.closeButton)}
      >
        <VsChromeClose />
      </div>
    </div>
  );
}
