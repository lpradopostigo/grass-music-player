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
      <div className={styles["media-button__wrapper"]}>
        <MediaButton variant="previous" size="small" />
        <MediaButton variant="play" />
        <MediaButton variant="next" size="small" />
      </div>

      <div className={styles["rest__wrapper"]}>
        <div className={styles["track-info"]}>
          <ReleasePicture data={{ title: "", artist: "" }} variant="small" />

          <div className={styles["track-info__text"]}>
            <span className={styles["track-info__title"]}>{data.title}</span>
            <span className={styles["track-info__artist"]}>{data.artist}</span>
            <span className={styles["track-info__release"]}>
              {data.releaseTitle}
            </span>
          </div>
        </div>

        <Slider formatter={secondsToAudioDuration} />
      </div>
    </div>
  );
}

Player.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    releaseTitle: PropTypes.string,
  }),
};

Player.defaultProps = {
  data: {
    title: "",
    artist: "",
    releaseTitle: "",
  },
};
