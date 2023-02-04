import classes from "./Track.module.css";
import { Show } from "solid-js";
import EqBars from "./EqBars.jsx";
import { secondsToAudioDuration } from "../../utils/index.js";

function Track(props) {
  // const trackNumberWidth = createMemo(() => {
  //   const digits = Math.trunc(Math.log10(props.trackNumberDigits)) + 1;
  //   return isNaN(digits) ? undefined : `${Math.max(digits, 2)}ch`;
  // });

  return (
    <li onClick={() => props.onClick?.()} class={classes.track}>
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

export default Track;
