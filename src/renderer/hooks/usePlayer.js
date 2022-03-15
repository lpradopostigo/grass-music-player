import usePlayerState from "./usePlayerState";
import usePlayerControls from "./usePlayerControls";

export default function usePlayer() {
  const state = usePlayerState();
  const controls = usePlayerControls();

  return {
    state,
    controls,
  };
}
