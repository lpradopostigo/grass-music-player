import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import ReleaseViewHeader from "./ReleaseViewHeader";
import TrackList from "../../components/TrackList";
import { library } from "../../services/api";
import styles from "./styles.module.css";
import { map, groupBy, prop, values, compose, head } from "ramda";

export default function ReleaseView() {
  const { state: releaseData } = useLocation();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    (async () => {
      setTracks(await library.getTracks(releaseData.id));
    })();
  }, []);

  const showDiscNumber = releaseData.numberOfDiscs > 1;
  const groupByDiscNumber = groupBy(prop("discNumber"));
  const renderTrackList = (tracks) => (
    <TrackList
      key={head(tracks)?.discNumber}
      data={tracks}
      showDiscNumber={showDiscNumber}
    />
  );
  const process = compose(map(renderTrackList), values, groupByDiscNumber);

  return (
    <div className={styles.container}>
      <ReleaseViewHeader data={releaseData} />
      <div className={styles.trackListWrapper}>{process(tracks)}</div>
    </div>
  );
}
