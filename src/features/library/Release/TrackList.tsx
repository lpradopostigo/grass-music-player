import { createEffect, createSignal, Index, JSX, Show } from "solid-js";
import { secondsToAudioDuration } from "../../../utils";
import PlayerCommands from "../../../commands/PlayerCommands";
import clsx from "clsx";
import style from "./style.module.css";
import { useGlobalStore } from "../../../providers/GlobalStoreProvider";
import { LibraryReleaseTrack } from "../../../../src-tauri/bindings/LibraryReleaseTrack";
import { useIsRouting } from "@solidjs/router";

function TrackList(props: TrackListProps) {
  const [globalData] = useGlobalStore();

  const [containerEl, setContainerEl] = createSignal<HTMLUListElement>();

  const isRouting = useIsRouting();

  createEffect(() => {
    const containerElValue = containerEl();
    if (!containerElValue || isRouting()) return;
    (containerElValue.children[0] as HTMLLIElement).focus();
  });

  function handleKeyDown(event: KeyboardEvent) {
    const children = Array.from(containerEl()!.children) as HTMLElement[];
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

  async function handleTrackClick(index: number) {
    await PlayerCommands.setPlaylist(props.data.map(({ path }) => path));
    await PlayerCommands.skipToTrack(index);
    await PlayerCommands.play();
  }

  return (
    <ul
      ref={setContainerEl}
      onKeyDown={handleKeyDown}
      class={clsx("overflow-y-auto", props.class)}
    >
      <Index each={props.data}>
        {(track, index) => (
          <Track
            class={clsx(
              index !== props.data.length - 1 && "border-b border-gray-1"
            )}
            data={track()}
            tabindex={index === 0 ? 0 : -1}
            active={
              globalData.playerState.path === track().path &&
              globalData.playerState.playbackState === "playing"
            }
            onClick={() => handleTrackClick(index)}
          />
        )}
      </Index>
    </ul>
  );
}

function Track(props: TrackProps) {
  return (
    <li
      tabindex={props.tabindex}
      class={clsx(
        "flex items-center gap-3 px-4 py-2 focus-visible:outline-offset-[-4px]",
        props.class
      )}
      onClick={() => props.onClick?.()}
    >
      <div class="w-5">
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
            width="16px"
            height="16px"
            fill="currentColor"
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
      </div>

      <div class="line-clamp-1 flex-1">
        <span class="mr-2 font-semibold">{props.data.name}</span>
        <span class="text-sm">{props.data.artistCreditName}</span>
      </div>

      <span class="text-xs">{secondsToAudioDuration(props.data.length)}</span>
    </li>
  );
}

type TrackListProps = {
  data: LibraryReleaseTrack[];
} & Pick<ComponentCommonProps, "class">;

type TrackProps = {
  active: boolean;
  data: LibraryReleaseTrack;
  onClick?: () => void;
} & Pick<JSX.HTMLAttributes<HTMLDivElement>, "tabindex" | "class">;

export type { TrackListProps, TrackProps };

export default TrackList;
