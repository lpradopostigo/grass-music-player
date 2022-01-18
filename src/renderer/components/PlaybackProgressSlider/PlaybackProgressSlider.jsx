import React from "react";
import PropTypes from "prop-types";
import { useSliderState } from "react-stately";
import {
  usePress,
  useSlider,
  useSliderThumb,
  useFocusRing,
  VisuallyHidden,
  mergeProps,
  useNumberFormatter,
  useMove,
} from "react-aria";
import cls from "./styles.module.css";
import useTrackPosition from "../../hooks/useTrackPosition";
import { secondsToAudioDuration } from "../../utils/format/format";
import { grass } from "../../services/api";
import { percentageToValue, valueToPercentage } from "../../utils/conversion";

export default function PlaybackProgressSlider() {
  const trackRef = React.useRef(null);
  const numberFormatter = useNumberFormatter({});
  const trackPosition = useTrackPosition();
  const state = useSliderState({
    isDisabled: trackPosition.current === 0 && trackPosition.total === 0,
    value: [trackPosition.current],
    minValue: 0,
    maxValue: trackPosition.total,
    numberFormatter,
    step: 0,
  });

  const { groupProps, trackProps, outputProps } = useSlider(
    { "aria-label": "playback progress" },
    state,
    trackRef
  );

  const trackCurrentStyle = {
    width: `${state.getThumbPercent(0) * 100}%`,
    maxWidth: "100%",
  };

  return (
    <div {...groupProps} className={cls["container"]}>
      <output {...outputProps} className={cls["output"]}>
        {secondsToAudioDuration(state.getThumbValue(0))}
      </output>
      <div
        {...trackProps}
        onClick={(event) => {
          if (state.isThumbEditable(0)) {
            const { width, x } = trackRef.current.getBoundingClientRect();
            const relX = event.nativeEvent.x - x;

            const percentage = valueToPercentage(relX, width);
            console.log(percentageToValue(percentage, trackPosition.total));

            grass.setTrackPosition(
              percentageToValue(percentage, trackPosition.total)
            );
            state.setThumbValue(
              0,
              percentageToValue(percentage, trackPosition.total)
            );
          }
        }}
        ref={trackRef}
        className={cls["thumb-and-track-wrapper"]}
      >
        <div className={cls["track__total"]} />

        <div className={cls["track__current"]} style={trackCurrentStyle} />

        <Thumb index={0} state={state} trackRef={trackRef} />
      </div>
      <output {...outputProps} className={cls["output"]}>
        {secondsToAudioDuration(trackPosition.total)}
      </output>
    </div>
  );
}

function Thumb({ state, trackRef, index }) {
  const inputRef = React.useRef(null);
  const { thumbProps, inputProps } = useSliderThumb(
    { index, trackRef, inputRef },
    state
  );
  const { focusProps } = useFocusRing();

  const thumbPercent = state.getThumbPercent(index);

  const thumbStyle = {
    left: `${thumbPercent <= 1 ? thumbPercent * 100 : 100}%`,
  };

  return (
    <div className={cls["thumb"]} style={thumbStyle} {...thumbProps}>
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
}

Thumb.propTypes = {
  trackRef: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  state: PropTypes.any.isRequired,
};
