import classes from "./TrackList.module.css";
import { For, onMount, Show } from "solid-js";
import EqBars from "./EqBars.jsx";
import { secondsToAudioDuration } from "../../utils/index.js";
import Player from "../../commands/Player/index.js";
import { usePlayerState } from "../../commands/Player/PlayerStateProvider.jsx";
import { makeEventListener } from "@solid-primitives/event-listener";
import clsx from "clsx";

function TrackList(props) {
  const playerState = usePlayerState();

  let containerEl = null;

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
        children.at(indexToFocus).focus();
        children
          .at(indexToFocus)
          .scrollIntoView({ block: "center", behavior: "smooth" });
      } else if (key === "ArrowDown") {
        event.preventDefault();
        const indexToFocus = (focusedChildIndex + 1) % children.length;
        children[indexToFocus].focus();
        children[indexToFocus].scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      } else if (key === "Enter") {
        document.activeElement.click();
      }
    });

    containerEl.children[0].focus();
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

function Track(props) {
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

export default TrackList;
