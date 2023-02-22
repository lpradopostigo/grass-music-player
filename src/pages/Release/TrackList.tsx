import classes from "./TrackList.module.css";
import { For, onMount, Show } from "solid-js";
import EqBars from "./EqBars";
import { secondsToAudioDuration } from "../../utils";
import Player from "../../commands/Player";
import { usePlayerState } from "../../providers/PlayerStateProvider";
import { makeEventListener } from "@solid-primitives/event-listener";
import clsx from "clsx";
import { Track as TTrack } from "../../../src-tauri/bindings/Track";

function TrackList(props: TrackListProps) {
  const playerState = usePlayerState();

  let containerEl!: HTMLUListElement;

  onMount(() => {
    makeEventListener(containerEl, "keydown", (event) => {
      const children = Array.from(containerEl.children);
      const focusedChildIndex = children.findIndex(
        (child) => child === document.activeElement
      );

      const { key } = event;

      if (key === "ArrowUp") {
        event.preventDefault();
        const indexToFocus = focusedChildIndex - 1;
        const elementToFocus = children.at(indexToFocus);

        if (elementToFocus instanceof HTMLElement) {
          elementToFocus.focus();
          elementToFocus.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } else if (key === "ArrowDown") {
        event.preventDefault();
        const indexToFocus = (focusedChildIndex + 1) % children.length;
        const elementToFocus = children.at(indexToFocus);

        if (elementToFocus instanceof HTMLElement) {
          elementToFocus.focus();
          elementToFocus.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } else if (key === "Enter") {
        const activeElement = document.activeElement;

        if (activeElement instanceof HTMLElement) {
          activeElement.click();
        }
      }
    });

    const [firstChild] = containerEl.children;

    if (firstChild instanceof HTMLElement) {
      firstChild.focus();
    }
  });

  return (
    <ul
      ref={containerEl}
      class={clsx(classes.tracks, "focusable")}
      tabIndex={0}
    >
      <For each={props.tracks}>
        {(track, index) => (
          <Track
            {...track}
            active={
              playerState.currentTrackPath === track.path &&
              playerState.playbackState === "playing"
            }
            onClick={async () => {
              await Player.setPlaylist(props.tracks.map(({ path }) => path));
              await Player.skipToTrack(index());
              await Player.play();
            }}
          />
        )}
      </For>
    </ul>
  );
}

function Track(props: TrackProps) {
  // const trackNumberWidth = createMemo(() => {
  //   const digits = Math.trunc(Math.log10(props.trackNumberDigits)) + 1;
  //   return isNaN(digits) ? undefined : `${Math.max(digits, 2)}ch`;
  // });

  return (
    <li tabIndex={-1} class={classes.track} onClick={() => props.onClick?.()}>
      <Show
        when={props.active}
        fallback={<span class={classes.trackNumber}>{props.trackNumber}</span>}
        keyed
      >
        <EqBars />
      </Show>

      <div>
        <div>{props.name}</div>
        <div class={classes.trackArtistCredit}>{props.artistCreditName}</div>
      </div>

      <span class={classes.trackLength}>
        {secondsToAudioDuration(props.length)}
      </span>
    </li>
  );
}

type TrackListProps = {
  tracks: (Pick<TTrack, "path" | "trackNumber" | "name" | "length"> & {
    artistCreditName: string;
  })[];
};

type TrackProps = {
  active: boolean;
  artistCreditName: string;
  onClick?: () => void;
} & Pick<TTrack, "trackNumber" | "name" | "length">;

export default TrackList;
