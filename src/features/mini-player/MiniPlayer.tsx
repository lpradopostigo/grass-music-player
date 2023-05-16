import CoverArt from "../../components/CoverArt";
import { secondsToAudioDuration } from "../../utils";
import PlayerCommands from "../../commands/PlayerCommands";
import { Show } from "solid-js";
import Icon from "../../components/Icon";
import { useGlobalStore } from "../../providers/GlobalStoreProvider";
import clsx from "clsx";

function MiniPlayer() {
  const [globalData] = useGlobalStore();

  return (
    <div class="grid grid-cols-[minmax(0,3fr)_auto_minmax(0,7fr)] grid-rows-1 items-center gap-4 border-t border-gray-0 p-2 shadow-inner ">
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
          <div class="min-w-0">
            <div class="truncate font-semibold">
              {globalData.playerState.track!.name}
            </div>
            <div class="truncate text-sm">
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

      <div class="grid grid-cols-[6ch_1fr_6ch] items-center text-xs">
        <span>{secondsToAudioDuration(globalData.playerState.position)}</span>
        <SeekControl
          current={globalData.playerState.position}
          total={globalData.playerState.totalTime}
        />
        <span class="text-end">
          {secondsToAudioDuration(globalData.playerState.totalTime)}
        </span>
      </div>
    </div>
  );
}

function SeekControl(props: SeekControlProps) {
  function handleClick(event: MouseEvent) {
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
    <div onClick={handleClick} class={clsx("group relative h-4", props.class)}>
      <div class="absolute bottom-0 top-0 my-auto h-1 w-full overflow-hidden rounded bg-gray-0 group-hover:scale-y-125 group-hover:bg-gray-1">
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

type SeekControlProps = {
  current: number;
  total: number;
} & Pick<ComponentCommonProps, "class">;

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
