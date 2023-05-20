import PlaybackControls from "./PlaybackControls.tsx";
import PlaybackInfo from "./PlaybackInfo.tsx";

function MiniPlayer() {
  return (
    <div class="grid grid-cols-[minmax(0,3fr)_auto_minmax(0,7fr)] grid-rows-1 items-center gap-4 border-t border-gray-0 p-2 shadow-inner ">
      <PlaybackInfo />
      <PlaybackControls />
    </div>
  );
}

export default MiniPlayer;
