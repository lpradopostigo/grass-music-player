import React from "react";
import PropTypes from "prop-types";
import MediaButton from "../MediaButton";
import ReleasePicture from "../ReleasePicture";
import styles from "./styles.module.css";
import Slider from "../Slider";
import { secondsToAudioDuration } from "../../utils/format/format";

export default function Player({ data }) {
  return (
    <div className={styles["container"]}>
      <div className={styles["media-button-wrapper"]}>
        <MediaButton variant="previous" size="small" />
        <MediaButton variant="play" />
        <MediaButton variant="next" size="small" />
      </div>

      <div className={styles.restWrapper}>
        <div className={styles.trackInfo}>
          <ReleasePicture variant="small" />

          <div className={styles.trackInfoText}>
            <span className={styles.trackInfoTitle}>{data.title}</span>
            <span className={styles.trackInfoArtist}>{data.artist}</span>
            <span className={styles.trackInfoRelease}>{data.releaseTitle}</span>
          </div>
        </div>

        <Slider formatter={secondsToAudioDuration} />
      </div>
    </div>
  );
}

Player.propTypes = {
  data: {
    title: PropTypes.string,
    artist: PropTypes.string,
    releaseTitle: PropTypes.string,
  },
};

Player.defaultProps = {
  data: {
    title: "",
    artist: "",
    releaseTitle: "",
  },
};
