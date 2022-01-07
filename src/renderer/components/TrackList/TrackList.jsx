import React from "react";

import styles from "./styles.modules.css";
import Track from "../Track";
import { map, head, addIndex } from "ramda";
import PropTypes from "prop-types";
import { When } from "react-if";

export default function TrackList({ data, showDiscNumber, playingTrackIndex }) {
  const mapIndexed = addIndex(map);
  return (
    <div className={styles.container}>
      <When condition={showDiscNumber}>
        <span className={styles.disc}>Disc {head(data)?.discNumber}</span>
      </When>

      {mapIndexed((track, index) => (
        <Track
          playing={playingTrackIndex === index}
          data={track}
          key={track.id}
        />
      ))(data)}
    </div>
  );
}

TrackList.defaultProps = {
  showDiscNumber: false,
  playingTrackIndex: undefined,
};

TrackList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      trackNumber: PropTypes.number.isRequired,
      discNumber: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
  showDiscNumber: PropTypes.bool,
  playingTrackIndex: PropTypes.number,
};
