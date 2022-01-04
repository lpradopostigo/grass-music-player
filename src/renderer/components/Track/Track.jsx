import React from "react";

import styles from "./styles.modules.css";
import PropTypes from "prop-types";

export default function Track({ data }) {
  return (
    <div className={styles.container}>
      <div>
        <span className={styles.trackNumber}>{data.trackNumber}</span>
        <span className={styles.title}>{data.title}</span>
      </div>
      <span className={styles.artist}>{data.artist}</span>
      <span className={styles.duration}>8{data.duration}</span>
    </div>
  );
}

Track.defaultProps = {};

Track.propTypes = {
  data: PropTypes.shape({
    trackNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
  }).isRequired,
};
