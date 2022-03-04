import React from "react";
import MediaButton from "../MediaButton";
import ReleasePicture from "../ReleasePicture";
import styles from "./styles.module.css";
import PlaybackProgressSlider from "../PlaybackProgressSlider";
import { grass } from "../../services/api";
import usePlaybackStatus, { PlaybackStatus } from "../../hooks/usePlaybackStatus";
import useTrackPosition from "../../hooks/useTrackPosition";
import useCurrentTrack from "../../hooks/useCurrentTrack";

export default function Player() {
  const playbackState = usePlaybackStatus();
  const currentTrack = useCurrentTrack();
  const trackPosition = useTrackPosition();
  return (
    <div className={styles["container"]}>
      <div className={styles["media-button__wrapper"]}>
        <MediaButton onClick={grass.previous} variant="previous" size="small" />

        <MediaButton
          onClick={
            playbackState === PlaybackStatus.PLAYING ? grass.pause : grass.play
          }
          variant={playbackState === PlaybackStatus.PLAYING ? "pause" : "play"}
        />

        <MediaButton onClick={grass.next} variant="next" size="small" />
      </div>

      <div className={styles["rest__wrapper"]}>
        <div className={styles["track-info"]}>
          <ReleasePicture
            data={{ title: "", artist: "", picture: currentTrack?.picture }}
            variant="small"
          />

          <div className={styles["track-info__text"]}>
            <span className={styles["track-info__title"]}>
              {currentTrack?.title}
            </span>

            <span className={styles["track-info__artist"]}>
              {currentTrack?.artist}
            </span>

            <span className={styles["track-info__release"]}>
              {currentTrack?.releaseTitle}
            </span>
          </div>
        </div>

        <PlaybackProgressSlider
          current={trackPosition.current}
          total={trackPosition.total}
        />
      </div>
    </div>
  );
}
