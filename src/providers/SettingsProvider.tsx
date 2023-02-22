import {
  createContext,
  createResource,
  JSX,
  Resource,
  useContext,
} from "solid-js";
import Settings from "../commands/Settings";

type ContextProps = {
  settings: Resource<Settings>;
  updateSettings: (settings: Settings) => Promise<void>;
};

const SettingsContext = createContext<ContextProps>();

export default function SettingsProvider(props: { children: JSX.Element }) {
  const [settings, { refetch }] = createResource(Settings.get);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        async updateSettings(settings) {
          await Settings.set(settings);
          await refetch();
        },
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext)!;
}
