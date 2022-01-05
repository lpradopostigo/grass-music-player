import React from "react";

import styles from "./styles.modules.css";
import Track from "../Track";
import { compose, map, prop, sortBy, head } from "ramda";
import PropTypes from "prop-types";
import { When } from "react-if";

export default function TrackList({ data, showDiscNumber }) {
  const sortById = sortBy(prop("id"));
  const process = compose(
    sortById,
    map((track) => <Track data={track} key={track.id} />)
  );

  return (
    <div className={styles.container}>
      <When condition={showDiscNumber}>
        <span className={styles.disc}>Disc {head(data)?.discNumber}</span>
      </When>

      {process(data)}
    </div>
  );
}

TrackList.defaultProps = {
  showDiscNumber: false,
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
};
