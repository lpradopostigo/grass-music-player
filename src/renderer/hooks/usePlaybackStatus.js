import {useEffect, useState} from "react";
import {grass} from "../services/api";

export const PlaybackStatus = {
  PLAYING: "PLAYING",
  STOPPED: "STOPPED",
  PAUSED: "PAUSED",
};

export default function usePlaybackStatus() {
  const [playbackStatus, setPlaybackStatus] = useState("");

  useEffect(() => {
    (async () => {
      const handle =
        setInterval(async () => {
          setPlaybackStatus(await grass.getPlaybackStatus());
        }, 100);

      return () => clearInterval(handle)
    })();
  }, []);

  return playbackStatus;
}
