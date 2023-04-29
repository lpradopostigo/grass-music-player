import CoverArt from "../../components/CoverArt";
import { secondsToAudioDuration } from "../../utils";
import PlayerCommands from "../../commands/PlayerCommands";
import { Show } from "solid-js";
import classes from "./ProgressSeekControl.module.css";
import Icon from "../../components/Icon";
import { useGlobalStore } from "../../providers/GlobalStoreProvider";

function MiniPlayer() {
  const [globalData] = useGlobalStore();

  return (
    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] grid-rows-1 items-center gap-8 border-t border-gray-0 p-2 shadow-inner">
      <div class="flex items-center gap-2">
        <CoverArt
          class="flex-shrink-0"
          size="sm"
          srcs={
            globalData.playerState.track?.thumbnailSrc
              ? [globalData.playerState.track!.thumbnailSrc!]
              : []
          }
        />

        <Show when={globalData.playerState.track}>
          <div>
            <div class="line-clamp-1 font-semibold">
              {globalData.playerState.track!.name}
            </div>
            <div class="line-clamp-1 text-sm">
              {globalData.playerState.track!.artistCreditName}
            </div>
          </div>
        </Show>
      </div>

      <div class="flex items-center gap-3">
        <Icon name="skip-back" onClick={PlayerCommands.previous} />

        <Icon
          class="text-[36px]"
          name={
            globalData.playerState.playbackState === "playing"
              ? "pause-circle"
              : "play-circle"
          }
          onClick={() => {
            if (globalData.playerState.playbackState === "playing") {
              PlayerCommands.pause();
            } else {
              PlayerCommands.play();
            }
          }}
        />

        <Icon name="skip-forward" onClick={PlayerCommands.next} />
      </div>

      <div class="text-right text-xs">
        <span class="font-medium">
          {secondsToAudioDuration(globalData.playerState.position)}
        </span>
        <span class="mx-1">/</span>
        <span>{secondsToAudioDuration(globalData.playerState.totalTime)}</span>
      </div>
    </div>
  );
}

function ProgressSeekControl() {
  const playerState = usePlayerState();

  function handleClick(event: MouseEvent) {
    const { width, left } = (
      event.currentTarget as HTMLDivElement
    ).getBoundingClientRect();
    const { clientX } = event;
    const x = clientX - left;
    const percent = valueToPercentage(x, width);
    const seekTime = percentageToValue(percent, playerState.trackLength);
    PlayerCommands.seek(seekTime);
  }

  return (
    <div onClick={handleClick} class={classes.container}>
      <div class={classes.track}>
        <div
          class={classes.progress}
          style={{
            width: `${valueToPercentage(
              playerState.trackPosition,
              playerState.trackLength
            )}%`,
          }}
        >
          <div class={classes.thumb} />
        </div>
      </div>
    </div>
  );
}

function valueToPercentage(value: number, referenceValue: number) {
  if (value === 0 || referenceValue === 0) {
    return 0;
  }

  return (value / referenceValue) * 100;
}

function percentageToValue(percentage: number, referenceValue: number) {
  if (percentage === 0 || referenceValue === 0) {
    return 0;
  }

  return (percentage * referenceValue) / 100;
}

export default MiniPlayer;
