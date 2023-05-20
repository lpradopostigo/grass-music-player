import { invoke } from "@tauri-apps/api";
import { Preferences } from "../../src-tauri/bindings/Preferences.ts";

const PreferencesCommands = {
  get(): Promise<Preferences> {
    return invoke("preferences_get");
  },

  set(preferences: Preferences): Promise<void> {
    return invoke("preferences_set", { preferences });
  },
};

export default PreferencesCommands;
