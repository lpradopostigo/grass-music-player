import { Match, Switch } from "solid-js";
import { appWindow } from "@tauri-apps/api/window";
import {
  VsChromeMaximize,
  VsChromeMinimize,
  VsChromeClose,
} from "solid-icons/vs";
import { getCssVar } from "../utils/css";

const TitleBar = () => (
  <div class="absolute top-0 left-0 w-full flex justify-end webkit-app-region-drag">
    <Button variant="minimize" onClick={appWindow.minimize} />
    <Button variant="maximize" onClick={appWindow.maximize} />
    <Button variant="close" onClick={appWindow.close} />
  </div>
);

const Button = (props) => (
  <div
    class="hover:bg-gray-100 grid place-content-center webkit-app-region-no-drag"
    style={{
      width: getCssVar("--title-bar-button-width"),
      height: getCssVar("--title-bar-button-height"),
    }}
    onClick={() => props.onClick()}
  >
    <Switch>
      <Match when={props.variant === "close"} keyed>
        <VsChromeClose />
      </Match>

      <Match when={props.variant === "minimize"} keyed>
        <VsChromeMinimize />
      </Match>

      <Match when={props.variant === "maximize"} keyed>
        <VsChromeMaximize />
      </Match>
    </Switch>
  </div>
);

export default TitleBar;
