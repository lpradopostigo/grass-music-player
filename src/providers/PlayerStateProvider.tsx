import {
  createContext,
  useContext,
  onCleanup,
  ParentComponent,
} from "solid-js";
import { createStore } from "solid-js/store";
import { listen } from "@tauri-apps/api/event";
import { PlayerState } from "../../src-tauri/bindings/PlayerState";

const defaultState: PlayerState = {
  currentTrackPosition: 0,
  currentTrackDuration: 0,
  currentTrackPath: null,
  playbackState: "stopped",
};

const PlayerStateContext = createContext(defaultState);

const PlayerStateProvider: ParentComponent = (props) => {
  const [state, setState] = createStore(defaultState);

  const promise = listen<PlayerState>("player-state", ({ payload }) => {
    setState(payload);
  });

  onCleanup(async () => {
    const unlisten = await promise;
    unlisten();
  });

  return (
    <PlayerStateContext.Provider value={state}>
      {props.children}
    </PlayerStateContext.Provider>
  );
};

export default PlayerStateProvider;

export function usePlayerState() {
  return useContext(PlayerStateContext);
}
