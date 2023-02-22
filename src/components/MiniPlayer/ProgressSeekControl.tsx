import classes from "./ProgressSeekControl.module.css";
import { usePlayerState } from "../../providers/PlayerStateProvider";
import Player from "../../commands/Player";
import { JSX } from "solid-js";

function ProgressSeekControl() {
  const playerState = usePlayerState();
  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
    const { width, left } = event.currentTarget.getBoundingClientRect();
    const { clientX } = event;
    const x = clientX - left;
    const percent = valueToPercentage(x, width);
    const seekTime = percentageToValue(
      percent,
      playerState.currentTrackDuration
    );
    Player.seek(seekTime);
  };

  return (
    <div onClick={handleClick} class={classes.container}>
      <div class={classes.track}>
        <div
          class={classes.progress}
          style={{
            width: `${valueToPercentage(
              playerState.currentTrackPosition,
              playerState.currentTrackDuration
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

export default ProgressSeekControl;
