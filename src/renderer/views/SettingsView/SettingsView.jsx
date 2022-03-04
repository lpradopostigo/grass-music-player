import React, { useState } from "react";
import cls from "./styles.module.css";
import useSettings from "../../hooks/useSettings";
import { settings as apiSettings } from "../../services/api";

export default function SettingsView() {
  const [settings, setSettings] = useSettings();

  return (
    <div className={cls["container"]}>
      <span className={cls["heading"]}>Settings</span>
      <span>Library Path</span>

      <div>
        <span>{settings.libraryPath}</span>

        <div
          onClick={async () => {
            const path = await apiSettings.openPathSelector();
            if (path) {
              await setSettings({ libraryPath: path });
            }
          }}
        >
          select folder
        </div>
      </div>
    </div>
  );
}

SettingsView.propTypes = {};
SettingsView.defaultProps = {};
