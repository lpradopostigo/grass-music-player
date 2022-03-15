/** @typedef {import('../../shared/types').PlayerTrack} */

import { useState, useEffect } from "react";
import { grass } from "../services/api";

/** @return {[PlayerTrack, (tracks: any[])=> void]} */
export default function usePlayerTrack() {
  const [track, setTrack] = useState({
    id: -1,
    releaseId: -1,
    title: null,
    artist: null,
    releaseTitle: null,
    releaseArtist: null,
    picture: null,
    position: null,
    duration: null,
    trackNumber: null,
    discNumber: null,
    year: null,
  });

  useEffect(() => {
    const handle = setInterval(async () => {
      setTrack({ ...(await grass.getTrack()) });
    }, 250);

    return () => clearInterval(handle);
  }, []);

  return [
    track,
    async (track) => {
      // something to set the track
    },
  ];
}
