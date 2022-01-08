import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { map, groupBy, prop, values, compose, head, sortBy } from "ramda";
import ReleaseViewHeader from "./ReleaseViewHeader";
import TrackList from "../../components/TrackList";
import { library } from "../../services/api";
import styles from "./styles.module.css";

export default function ReleaseView() {
  const { state: releaseData } = useLocation();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    (async () => {
      setTracks(await library.getTracks(releaseData.id));
    })();
  }, []);

  const sortByTrackNumber = sortBy(prop("trackNumber"));
  const showDiscNumber = releaseData.numberOfDiscs > 1;
  const groupByDiscNumber = groupBy(prop("discNumber"));
  const renderTrackList = (arr) => (
    <TrackList
      key={head(arr)?.discNumber}
      data={arr}
      showDiscNumber={showDiscNumber}
    />
  );
  const process = compose(
    map(renderTrackList),
    map(sortByTrackNumber),
    values,
    groupByDiscNumber
  );

  return (
    <div className={styles.container}>
      <ReleaseViewHeader data={releaseData} />
      <div className={styles.trackListWrapper}>{process(tracks)}</div>
    </div>
  );
}
