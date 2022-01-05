import React from "react";

import styles from "./styles.modules.css";
import PropTypes from "prop-types";
import { secondsToAudioDuration } from "../../utils/format/format";

export default function Track({ data }) {
  return (
    <div className={styles.container}>
      <div className={styles.trackNumberAndTitleWrapper}>
        <span className={styles.trackNumber}>{data.trackNumber}</span>
        <span className={styles.title}>{data.title}</span>
      </div>
      <div className={styles.artistAndDurationWrapper}>
        <span className={styles.artist}>{data.artist}</span>
        <span className={styles.duration}>
          {secondsToAudioDuration(data.duration)}
        </span>
      </div>
    </div>
  );
}

Track.defaultProps = {};

Track.propTypes = {
  data: PropTypes.shape({
    trackNumber: PropTypes.number.isRequired,
    discNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
};
