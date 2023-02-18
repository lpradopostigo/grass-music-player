import classes from "./ProgressSeekControl.module.css";
import { usePlayerState } from "../../commands/Player/PlayerStateProvider.jsx";
import Player from "../../commands/Player/index.js";

const ProgressSeekControl = () => {
  const playerState = usePlayerState();
  const handleClick = (event) => {
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
};

export function valueToPercentage(value, referenceValue) {
  if (typeof value !== "number" || typeof referenceValue !== "number") return 0;

  return (value / referenceValue) * 100;
}

export function percentageToValue(percentage, referenceValue) {
  if (typeof percentage !== "number" || typeof referenceValue !== "number")
    return 0;

  return (percentage * referenceValue) / 100;
}

export default ProgressSeekControl;
