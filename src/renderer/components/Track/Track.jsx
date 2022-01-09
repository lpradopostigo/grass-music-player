import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import cls from "./styles.modules.css";
import { secondsToAudioDuration } from "../../utils/format/format";

export default function Track({ data, playing }) {
  return (
    <div
      className={clsx(cls["container"], {
        [cls["container--playing"]]: playing,
      })}
    >
      <div className={cls["track-number-and-title-wrapper"]}>
        <span className={cls["track-number"]}>{data.trackNumber}</span>
        <span className={cls["title"]}>{data.title}</span>
      </div>

      <div className={cls["artist-and-duration-wrapper"]}>
        <span className={cls["artist"]}>{data.artist}</span>

        <span className={cls["duration"]}>
          {secondsToAudioDuration(data.duration)}
        </span>
      </div>
    </div>
  );
}

Track.defaultProps = {
  playing: false,
};

Track.propTypes = {
  data: PropTypes.shape({
    trackNumber: PropTypes.number.isRequired,
    discNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  playing: PropTypes.bool,
};
