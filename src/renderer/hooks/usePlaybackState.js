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
      setPlaybackState(await grass.getPlaybackStatus());
      setInterval(async () => {
        setPlaybackState(await grass.getPlaybackStatus());
      }, 100);
    })();
  }, []);

  return playbackState;
}
