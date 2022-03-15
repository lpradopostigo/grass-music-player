import usePlayerPlaylist from "./usePlayerPlaylist";
import usePlayerTrack from "./usePlayerTrack";
import usePlayerPlaybackState from "./usePlayerPlaybackState";

export default function usePlayerState() {
  const playbackState = usePlayerPlaybackState();
  const [playlist] = usePlayerPlaylist();
  const [track] = usePlayerTrack();

  return { playbackState, playlist, track };
}
