import {
  useGetStateQuery,
  usePlayMutation,
  usePauseMutation,
  useNextMutation,
  usePreviousMutation,
  useSeekMutation,
  useSkipToIndexMutation,
  useSetPlaylistMutation,
} from "../services/api/playerApi";

export default function usePlayer() {
  const { data, isLoading } = useGetStateQuery();

  const [play] = usePlayMutation();
  const [pause] = usePauseMutation();
  const [next] = useNextMutation();
  const [previous] = usePreviousMutation();
  const [seek] = useSeekMutation();
  const [skipToIndex] = useSkipToIndexMutation();
  const [setPlaylist] = useSetPlaylistMutation();

  return {
    state: data,
    controls: {
      play,
      pause,
      next,
      previous,
      seek,
      skipToIndex,
      setPlaylist,
    },
    isLoading,
  };
}
