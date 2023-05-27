import {
  Accessor,
  createContext,
  createEffect,
  createResource,
  createSignal,
  JSX,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Preferences } from "../../src-tauri/bindings/Preferences.ts";
import { PlayerState } from "../../src-tauri/bindings/PlayerState.ts";
import { PlayerTrack } from "../../src-tauri/bindings/PlayerTrack.ts";
import { listen } from "@tauri-apps/api/event";
import LibraryCommands from "../commands/LibraryCommands.ts";
import PreferencesCommands from "../commands/PreferencesCommands.ts";

const GlobalDataContext = createContext<GlobalDataValue>();

function GlobalDataProvider(props: { children: JSX.Element }) {
  const [playerState, setPlayerState] = createStore<
    PlayerState & {
      track: PlayerTrack | null;
    }
  >({
    path: null,
    position: 0,
    totalTime: 0,
    playbackState: "stopped",
    track: null,
  });

  const [preferences, setPreferences] = createStore<Preferences>({
    libraryPath: null,
  });

  const [scanState, setScanState] = createSignal<ScanState>(null);

  const [preferencesResource, { refetch: refetchPreferences }] = createResource(
    PreferencesCommands.get
  );

  createEffect(() => {
    const preferencesValue = preferencesResource();
    if (preferencesValue) {
      setPreferences(preferencesValue);
    }
  });

  const [track] = createResource(
    () => playerState.path,
    (trackPath) => LibraryCommands.getPlayerTrack(trackPath)
  );

  createEffect(() => {
    const trackValue = track();
    if (trackValue) {
      setPlayerState({
        track: trackValue,
      });
    }
  });

  const unlistenPlayerState = listen<PlayerState>(
    "player:state",
    ({ payload }) => {
      setPlayerState(payload);
    }
  );

  const unlistenScanState = listen<ScanState>(
    "library:scan-state",
    ({ payload }) => {
      setScanState(payload);
    }
  );

  onCleanup(async () => {
    (await unlistenPlayerState)();
    (await unlistenScanState)();
  });

  return (
    <GlobalDataContext.Provider
      value={{
        playerState,
        scanState,
        preferences,
        async updatePreferences(preferences) {
          await PreferencesCommands.set(preferences);
          refetchPreferences();
        },
      }}
    >
      {props.children}
    </GlobalDataContext.Provider>
  );
}

type ScanState = [number, number] | null;

type GlobalDataValue = {
  playerState: PlayerState & {
    track: PlayerTrack | null;
  };
  preferences: Preferences;
  scanState: Accessor<ScanState>;
  updatePreferences: (preferences: Preferences) => Promise<void>;
};

function useGlobalData() {
  return useContext(GlobalDataContext)!;
}

export { useGlobalData, GlobalDataProvider };
