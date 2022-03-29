import React, { useState } from "react";
import { Button } from "@mantine/core";
import cls from "./styles.module.css";
import useSettings from "../../hooks/useSettings";
import { settings as apiSettings } from "../../services/api/api";

export default function Settings() {
  const [settings, setSettings] = useSettings();

  return (
    <div className={cls["container"]}>
      <span className={cls["heading"]}>Settings</span>
      <span>Library Path</span>

      <div>
        <span>{settings.libraryPath}</span>

        <Button
          onPress={async () => {
            const path = await apiSettings.openPathSelector();
            if (path) {
              await setSettings({ libraryPath: path });
            }
          }}
        >
          select folder
        </Button>
      </div>
    </div>
  );
}

Settings.propTypes = {};
Settings.defaultProps = {};
