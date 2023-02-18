import { invoke } from "@tauri-apps/api";

/** @typedef {import("../../src-tauri/bindings/Settings").Settings} Settings */

const Settings = {
  /** @returns {Promise<Settings>} */
  find() {
    return invoke("settings_find");
  },

  /**
   * @param settings {Settings}
   * @returns {Promise<void>}
   */
  update(settings) {
    return invoke("settings_update", { settings });
  },
};

export default Settings;
