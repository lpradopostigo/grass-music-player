import { useEffect, useState } from "react";
import { grass } from "../services/api";

export const PlaybackState = {
  PLAYING: "PLAYING",
  STOPPED: "STOPPED",
  PAUSED: "PAUSED",
};

export default function usePlayerPlaybackState() {
  const [playbackState, setPlaybackState] = useState("");
  useEffect(() => {
    (async () => {
      const handle = setInterval(async () => {
        setPlaybackState(await grass.getPlaybackStatus());
      }, 200);

      return () => clearInterval(handle);
    })();
  }, []);

  return playbackState;
}
