import {
  useNextMutation,
  usePauseMutation,
  usePlayMutation,
  usePreviousMutation,
  useSeekMutation,
  useSetPlaylistMutation,
  useSkipToIndexMutation,
} from "../services/api/playerApi";

export default function usePlayerControls() {
  const [play] = usePlayMutation();
  const [pause] = usePauseMutation();
  const [next] = useNextMutation();
  const [previous] = usePreviousMutation();
  const [seek] = useSeekMutation();
  const [skipToIndex] = useSkipToIndexMutation();
  const [setPlaylist] = useSetPlaylistMutation();

  return {
    play,
    pause,
    next,
    previous,
    seek,
    skipToIndex,
    setPlaylist,
  };
}
