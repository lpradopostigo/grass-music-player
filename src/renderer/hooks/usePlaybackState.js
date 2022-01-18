import { useEffect, useState } from "react";
import { grass } from "../services/api";

export const PlaybackState = {
  PLAYING: "PLAYING",
  STOPPED: "STOPPED",
  PAUSED: "PAUSED",
};

export default function usePlaybackState() {
  const [playbackState, setPlaybackState] = useState("");

  useEffect(() => {
    (async () => {
      setPlaybackState(await grass.getPlaybackState());
      setInterval(async () => {
        setPlaybackState(await grass.getPlaybackState());
      }, 100);
    })();
  }, []);

  return playbackState;
}
