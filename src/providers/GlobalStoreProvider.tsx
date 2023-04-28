import {
  createContext,
  createEffect,
  createResource,
  JSX,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Preferences } from "../../src-tauri/bindings/Preferences";
import { PlayerState } from "../../src-tauri/bindings/PlayerState";
import { PlayerTrack } from "../../src-tauri/bindings/PlayerTrack";
import { listen } from "@tauri-apps/api/event";
import LibraryCommands from "../commands/LibraryCommands";
import PreferencesCommands from "../commands/PreferencesCommands";

const GlobalStoreContext = createContext<GlobalStoreValue>();

function GlobalStoreProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore<GlobalStoreData>({
    playerState: {
      path: null,
      position: 0,
      totalTime: 0,
      playbackState: "stopped",
      track: null,
    },

    preferences: {
      libraryPath: null,
    },
  });

  const [preferences, { refetch }] = createResource(PreferencesCommands.get);

  createEffect(() => {
    const preferencesValue = preferences();
    if (preferencesValue) {
      setState("preferences", preferencesValue);
    }
  });

  const [track] = createResource(
    () => state.playerState.path,
    (trackPath) => LibraryCommands.getPlayerTrack(trackPath)
  );

  createEffect(() => {
    const trackValue = track();
    if (trackValue) {
      setState("playerState", {
        track: trackValue,
      });
    }
  });

  const promise = listen<PlayerState>("player:state", ({ payload }) => {
    setState("playerState", payload);
  });

  onCleanup(async () => {
    const unlisten = await promise;
    unlisten();
  });

  return (
    <GlobalStoreContext.Provider
      value={[
        state,
        {
          async updatePreferences(preferences) {
            await PreferencesCommands.set(preferences);
            refetch();
          },
        },
      ]}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

type GlobalStoreData = {
  playerState: PlayerState & {
    track: PlayerTrack | null;
  };
  preferences: Preferences;
};

type GlobalStoreValue = [
  GlobalStoreData,
  {
    updatePreferences: (preferences: Preferences) => void;
  }
];

function useGlobalStore() {
  return useContext(GlobalStoreContext)!;
}

export { useGlobalStore };

export default GlobalStoreProvider;
