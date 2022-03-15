import { grass } from "../services/api";

export default function usePlayerControls() {
  const play = () => grass.play();
  const pause = () => grass.pause();
  const next = () => grass.next();
  const previous = () => grass.previous();
  const skipToIndex = (index) => grass.skipToIndex(index);
  const seek = (position) => grass.seek(position);
  const setPlaylist = (playlist) => grass.setPlaylist(playlist);

  return { play, pause, next, previous, skipToIndex, seek, setPlaylist };
}
