import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import ReleaseViewHeader from "./ReleaseViewHeader";
import TrackList from "../../components/TrackList";
import { library } from "../../services/api";

export default function ReleaseView() {
  const { state: releaseData } = useLocation();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    (async () => {
      setTracks(await library.getTracks(releaseData.id));
    })();
  }, []);
  console.log(tracks)

  return (
    <div>
      <ReleaseViewHeader data={releaseData} />
    </div>
  );
}
