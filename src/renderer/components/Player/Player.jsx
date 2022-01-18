import React from "react";
import PropTypes from "prop-types";
import MediaButton from "../MediaButton";
import ReleasePicture from "../ReleasePicture";
import styles from "./styles.module.css";
import PlaybackProgressSlider from "../PlaybackProgressSlider";
import { secondsToAudioDuration } from "../../utils/format/format";
import { grass } from "../../services/api";
import usePlaybackState, { PlaybackState } from "../../hooks/usePlaybackState";
import useTrackPosition from "../../hooks/useTrackPosition";

export default function Player({ data }) {
  const playbackState = usePlaybackState();

  return (
    <div className={styles["container"]}>
      <div className={styles["media-button__wrapper"]}>
        <MediaButton onClick={grass.previous} variant="previous" size="small" />
        <MediaButton
          onClick={
            playbackState === PlaybackState.PLAYING ? grass.pause : grass.play
          }
          variant={playbackState === PlaybackState.PLAYING ? "pause" : "play"}
        />
        <MediaButton onClick={grass.next} variant="next" size="small" />
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

        <PlaybackProgressSlider />
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
