import React from "react";

import styles from "./styles.modules.css";
import Track from "../Track";
import { map } from "ramda";
import PropTypes from "prop-types";

export default function TrackList({ data }) {
  return (
    <div className={styles.container}>
      {map(
        (track) => (
          <Track data={track} />
        ),
        data
      )}
    </div>
  );
}

TrackList.defaultProps = {};

TrackList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      trackNumber: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};
