import { invoke } from "@tauri-apps/api";
import { Settings as TSettings } from "../../src-tauri/bindings/Settings";

const Settings = {
  get(): Promise<TSettings> {
    return invoke("settings_get");
  },

  set(settings: TSettings): Promise<void> {
    return invoke("settings_set", { settings });
  },
};

export default Settings;
