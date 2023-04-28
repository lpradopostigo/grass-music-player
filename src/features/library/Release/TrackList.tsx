import { Accessor, For, JSX, Show } from "solid-js";
import { secondsToAudioDuration } from "../../../utils";
import PlayerCommands from "../../../commands/PlayerCommands";
import clsx from "clsx";
import { Track as TrackData } from "../../../../src-tauri/bindings/Track";
import style from "./style.module.css";
import { useGlobalStore } from "../../../providers/GlobalStoreProvider";

function TrackList(props: TrackListProps) {
  const [globalData] = useGlobalStore();

  let containerEl!: HTMLUListElement;

  function handleKeyDown(event: KeyboardEvent) {
    const children = Array.from(containerEl.children) as HTMLElement[];
    const currentIndex = children.findIndex(
      (child) => child === document.activeElement
    );
    const updateTabIndex = (nextIndex: number) => {
      children[currentIndex].tabIndex = -1;
      children[nextIndex].tabIndex = 0;
    };

    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        const nextIndex =
          currentIndex === 0 ? children.length - 1 : currentIndex - 1;
        updateTabIndex(nextIndex);
        const elementToFocus = children[nextIndex];
        elementToFocus.focus();
        elementToFocus.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % children.length;
        updateTabIndex(nextIndex);
        const elementToFocus = children[nextIndex];
        elementToFocus.focus();
        elementToFocus.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      }
      case "Enter": {
        children[currentIndex].click();
        break;
      }
    }
  }

  async function handleTrackClick(index: Accessor<number>) {
    await PlayerCommands.setPlaylist(props.data.map(({ path }) => path));
    await PlayerCommands.skipToTrack(index());
    await PlayerCommands.play();
  }

  return (
    <ul
      ref={containerEl}
      onKeyDown={handleKeyDown}
      class={clsx("overflow-y-auto", props.class)}
    >
      <For each={props.data}>
        {(track, index) => (
          <Track
            class={clsx(
              index() !== props.data.length - 1 && "border-b border-gray-1"
            )}
            data={track}
            lastTrackNumber={props.data[props.data.length - 1].trackNumber}
            lastDiscNumber={props.data[props.data.length - 1].discNumber}
            tabindex={index() === 0 ? 0 : -1}
            active={
              globalData.playerState.path === track.path &&
              globalData.playerState.playbackState === "playing"
            }
            onClick={() => handleTrackClick(index)}
          />
        )}
      </For>
    </ul>
  );
}

function Track(props: TrackProps) {
  const trackNumberWidth = () =>
    stringToPixels(`${props.lastDiscNumber}.${props.lastTrackNumber}`);

  return (
    <li
      tabindex={props.tabindex}
      class={clsx("grid items-center gap-3 px-4 py-2", props.class)}
      style={{
        "grid-template-columns": `${trackNumberWidth()}px 1fr auto`,
      }}
      onClick={() => props.onClick?.()}
    >
      <Show
        when={props.active}
        fallback={
          <span class="text-xs">
            {props.data.discNumber}.{props.data.trackNumber}
          </span>
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
        >
          <rect
            class={clsx(style["eq-bar"])}
            x="4"
            y="4"
            width="3.7"
            height="8"
          />
          <rect
            class={clsx(style["eq-bar"])}
            x="10.2"
            y="4"
            width="3.7"
            height="16"
          />
          <rect
            class={clsx(style["eq-bar"])}
            x="16.3"
            y="4"
            width="3.7"
            height="11"
          />
        </svg>
      </Show>

      <div>
        <span class="mr-2 font-semibold">{props.data.name}</span>
        <span class="text-sm">{props.data.artistCreditName}</span>
      </div>

      <span class="text-xs">{secondsToAudioDuration(props.data.length)}</span>
    </li>
  );
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;

function stringToPixels(str: string) {
  ctx.font = "0.6875rem Inter";
  return ctx.measureText(str).width;
}

type TrackListProps = {
  data: (Pick<
    TrackData,
    "path" | "trackNumber" | "name" | "length" | "discNumber"
  > & {
    artistCreditName: string;
  })[];
} & Pick<ComponentCommonProps, "class">;

type TrackProps = {
  lastTrackNumber: number;
  lastDiscNumber: number;
  active: boolean;
  data: {
    artistCreditName: string;
  } & Pick<TrackData, "trackNumber" | "name" | "length" | "discNumber">;
  onClick?: () => void;
} & Pick<JSX.HTMLAttributes<HTMLDivElement>, "tabindex" | "class">;

export type { TrackListProps, TrackProps };

export default TrackList;
