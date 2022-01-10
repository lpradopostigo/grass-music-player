import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { map, groupBy, prop, values, compose, head, sortBy } from "ramda";
import TrackList from "../../components/TrackList";
import { library } from "../../services/api";
import cls from "./styles.module.css";
import ReleasePicture from "../../components/ReleasePicture";

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
    <div className={cls["container"]}>
      <div className={cls["header__container"]}>
        <ReleasePicture data={releaseData} />

        <div className={cls["header__info__wrapper"]}>
          <span className={cls["header__info__title"]}>
            {releaseData.title}
          </span>

          <span className={cls["header__info__artist"]}>
            {releaseData.artist}
          </span>

          <span className={cls["header__info__year"]}>{releaseData.year}</span>
        </div>
      </div>

      <div className={cls["track-list__wrapper"]}>{process(tracks)}</div>
    </div>
  );
}
