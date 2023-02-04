import {
  IoPlaySharp,
  IoPauseSharp,
  IoPlayBackSharp,
  IoPlayForwardSharp,
} from "solid-icons/io";
import ProgressSeekControl from "./ProgressSeekControl.jsx";
import classes from "./index.module.css";
import ReleasePicture from "../ReleasePicture/index.jsx";
import { secondsToAudioDuration } from "../../utils/index.js";
import Player from "../../services/Player/index.js";
import { createResource, Show } from "solid-js";
import Library from "../../services/Library.js";
import { usePlayerState } from "../../services/Player/context.jsx";

function MiniPlayer() {
  const playerState = usePlayerState();

  const [track] = createResource(
    () => playerState.currentTrackPath,
    async (path) => {
      if (!path) return null;

      const track = await Library.findTrackByPath(path);
      const release = await Library.findRelease(track.releaseId);
      const artistCredit = await Library.findArtistCredit(
        release.artistCreditId
      );

      const thumbnailSrc = await Library.findReleaseThumbnail(track.releaseId);

      return {
        ...track,
        thumbnailSrc,
        releaseName: release.name,
        artistCreditName: artistCredit.name,
      };
    }
  );
  return (
    <div class={classes.container}>
      <div class={classes.left}>
        <ReleasePicture src={track()?.thumbnailSrc} />

        <Show when={track()} keyed>
          <div>
            <div class={classes.name}>{track().name}</div>
            <div class={classes.release}>{track().releaseName}</div>
            <div class={classes.artist}>{track().artistCreditName}</div>
          </div>
        </Show>
      </div>

      <div class={classes.controls}>
        <Control onClick={() => Player.previous()} icon={<IoPlayBackSharp />} />
        <Control
          onClick={() =>
            playerState.playbackState === "playing"
              ? Player.pause()
              : Player.play()
          }
          icon={
            playerState.playbackState === "playing" ? (
              <IoPauseSharp />
            ) : (
              <IoPlaySharp />
            )
          }
        />
        <Control onClick={() => Player.next()} icon={<IoPlayForwardSharp />} />
      </div>

      <div class={classes.time}>
        <span>{secondsToAudioDuration(playerState.currentTrackPosition)}</span>
        <span>/</span>
        <span>{secondsToAudioDuration(playerState.currentTrackDuration)}</span>
      </div>

      <ProgressSeekControl />
    </div>
  );
}

function Control(props) {
  return (
    <div onClick={() => props.onClick?.()} class={classes.control}>
      {props.icon}
    </div>
  );
}

export default MiniPlayer;
