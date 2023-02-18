import { createContext, createResource, useContext } from "solid-js";
import Settings from "../commands/Settings.js";

const SettingsContext = createContext();

export default function SettingsProvider(props) {
  const [settings, { refetch }] = createResource(Settings.find);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        async updateSettings(settings) {
          await Settings.update(settings);
          await refetch();
        },
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
