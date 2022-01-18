import { useState, useEffect } from "react";
import { grass, library } from "../services/api";

export default function useCurrentTrack() {
  const [currentTrack, updateCurrentTrack] = useState({
    title: "",
    artist: "",
    releaseTitle: "",
    picture: null,
  });

  useEffect(() => {
    setInterval(async () => {
      const track = await grass.getCurrentTrack();
      if (track != null) {
        const release = await library.getRelease(track.releaseId);
        if (release != null) {
          updateCurrentTrack({
            title: track.title,
            artist: track.artist,
            releaseTitle: release.title,
            picture: release.picture,
          });
        }
      }
    }, 100);
  }, []);

  return currentTrack;
}
