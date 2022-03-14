import { useState, useEffect } from "react";
import { grass, library } from "../services/api";

export default function useCurrentTrack() {
  const [currentTrack, setCurrentTrack] = useState({
    id: 0,
    title: "",
    artist: "",
    releaseTitle: "",
    picture: null,
  });

  useEffect(() => {
    const handle = setInterval(async () => {
      const track = await grass.getCurrentTrack();
      if (track != null) {
        const release = await library.getRelease(track.releaseId);
        if (release != null) {
          setCurrentTrack({
            id: track.id,
            title: track.title,
            artist: track.artist,
            releaseTitle: release.title,
            picture: release.picture,
          });
        }
      }
    }, 500);

    return () => clearInterval(handle);
  }, []);

  return [
    currentTrack,
    async (track) => {
      // something
    },
  ];
}
