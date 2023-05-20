import clsx from "clsx";
import PlayerCommands from "../../commands/PlayerCommands.ts";
import Icon from "../../components/Icon.tsx";
import { secondsToAudioDuration } from "../../utils/misc.ts";
import { useGlobalStore } from "../../providers/GlobalStoreProvider.tsx";

function PlaybackControls() {
  const [globalData] = useGlobalStore();

  const noTrackIsPlaying = () => !globalData.playerState.track;

  return (
    <>
      <div class="flex items-center gap-3">
        <button
          onClick={PlayerCommands.previous}
          disabled={noTrackIsPlaying()}
          tabIndex={-1}
        >
          <Icon name="skip-back" />
        </button>

        <button
          tabIndex={-1}
          onClick={() =>
            globalData.playerState.playbackState === "playing"
              ? PlayerCommands.pause()
              : PlayerCommands.play()
          }
        >
          <Icon
            class="text-[36px]"
            name={
              globalData.playerState.playbackState === "playing"
                ? "pause-circle"
                : "play-circle"
            }
          />
        </button>

        <button
          tabIndex={-1}
          onClick={PlayerCommands.next}
          disabled={noTrackIsPlaying()}
        >
          <Icon name="skip-forward" />
        </button>
      </div>

      <div class="grid grid-cols-[6ch_1fr_6ch] items-center text-xs">
        <span class={clsx(noTrackIsPlaying() && "disabled")}>
          {secondsToAudioDuration(globalData.playerState.position)}
        </span>
        <SeekControl
          disabled={noTrackIsPlaying()}
          current={globalData.playerState.position}
          total={globalData.playerState.totalTime}
        />
        <span class={clsx("text-end", noTrackIsPlaying() && "disabled")}>
          {secondsToAudioDuration(globalData.playerState.totalTime)}
        </span>
      </div>
    </>
  );
}

function SeekControl(props: {
  current: number;
  total: number;
  disabled?: boolean;
}) {
  function handleClick(event: MouseEvent) {
    if (props.disabled) return;

    const { width, left } = (
      event.currentTarget as HTMLDivElement
    ).getBoundingClientRect();
    const { clientX } = event;
    const x = clientX - left;
    const percent = valueToPercentage(x, width);
    const seekTime = percentageToValue(percent, props.total);
    PlayerCommands.seek(seekTime);
  }

  return (
    <div onClick={handleClick} class="group relative h-4">
      <div
        class={clsx(
          "absolute bottom-0 top-0 my-auto h-1 w-full overflow-hidden rounded bg-gray-0",
          props.disabled
            ? "disabled"
            : "group-hover:scale-y-125 group-hover:bg-gray-1"
        )}
      >
        <div
          class="h-full bg-black"
          style={{
            width: `${valueToPercentage(props.current, props.total)}%`,
          }}
        />
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

export default PlaybackControls;
