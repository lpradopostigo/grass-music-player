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

    scanState: null,
  });

  const [preferences, { refetch: refetchPreferences }] = createResource(
    PreferencesCommands.get
  );

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

  const unlistenPlayerState = listen<PlayerState>(
    "player:state",
    ({ payload }) => {
      setState("playerState", payload);
    }
  );

  const unlistenScanState = listen<[number, number] | null>(
    "library:scan-state",
    ({ payload }) => {
      setState("scanState", payload);
    }
  );

  onCleanup(async () => {
    (await unlistenPlayerState)();
    (await unlistenScanState)();
  });

  return (
    <GlobalStoreContext.Provider
      value={[
        state,
        {
          async updatePreferences(preferences) {
            await PreferencesCommands.set(preferences);
            refetchPreferences();
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
  scanState: null | [number, number];
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
