import { useState, useEffect } from "react";
import { settings as apiSettings } from "../services/api/api";

export default function useSettings() {
  const [settings, setSettings] = useState({
    libraryPath: "",
  });

  useEffect(() => {
    (async () => {
      const libraryPath = await apiSettings.getValue("libraryPath");
      setSettings({ libraryPath });
    })();
  }, []);

  return [
    settings,
    async (obj) => {
      await Promise.all(
        Object.entries(obj).map(async ([key, value]) =>
          apiSettings.setValue(key, value)
        )
      );

      setSettings(obj);
    },
  ];
}
