import {
  IoPlaySharp,
  IoPauseSharp,
  IoPlayBackSharp,
  IoPlayForwardSharp,
} from "solid-icons/io";
import ProgressSeekControl from "./ProgressSeekControl";
import classes from "./index.module.css";
import CoverArt from "../CoverArt";
import { secondsToAudioDuration } from "../../utils";
import Player from "../../commands/Player";
import { createResource, JSX, Show } from "solid-js";
import Library from "../../commands/Library";
import { usePlayerState } from "../../providers/PlayerStateProvider";

function MiniPlayer() {
  const playerState = usePlayerState();

  const [track] = createResource(
    () => playerState.currentTrackPath,
    async (path) => {
      if (!path) return;

      const track = await Library.findTrackByPath(path);
      const release = await Library.findRelease(track.releaseId);
      const artistCredit = await Library.findArtistCredit(
        release.artistCreditId
      );

      const thumbnailSrc = await Library.findReleaseThumbnail(track.releaseId);
      const pictureSrc = await Library.findReleasePicture(track.releaseId);

      return {
        ...track,
        thumbnailSrc,
        pictureSrc,
        releaseName: release.name,
        artistCreditName: artistCredit.name,
      };
    }
  );

  const gradient =
    "linear-gradient(rgba(255, 255, 255, 0.825), rgba(255,255,255, 0.825))";

  return (
    <div
      class={classes.container}
      style={{
        "background-image": `${gradient}, url(${track()?.pictureSrc})`,
      }}
    >
      <div class={classes.left}>
        <CoverArt size="sm" src={track()?.thumbnailSrc} />

        <Show when={track()} keyed>
          <div>
            <div class={classes.name}>{track()!.name}</div>
            <div class={classes.release}>{track()!.releaseName}</div>
            <div class={classes.artist}>{track()!.artistCreditName}</div>
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

function Control(props: { icon: JSX.Element; onClick?: () => void }) {
  return (
    <div onClick={() => props.onClick?.()} class={classes.control}>
      {props.icon}
    </div>
  );
}

export default MiniPlayer;
