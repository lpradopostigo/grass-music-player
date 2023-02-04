import { createContext, useContext, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { listen } from "@tauri-apps/api/event";

/**
 * @typedef {import("../../../src-tauri/bindings/PlayerState").PlayerState} PlayerState
 *
 * @typedef {import("solid-js/store").Store} Store
 */

const PlayerStateContext = createContext();

export function PlayerStateProvider(props) {
  const [state, setState] = createStore({});

  const promise = listen("player-state", ({ payload }) => {
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
}

/** @returns {Store<PlayerState>} */
export function usePlayerState() {
  return useContext(PlayerStateContext);
}
