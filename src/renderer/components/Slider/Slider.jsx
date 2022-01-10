import React from "react";
import PropTypes from "prop-types";
import { identity } from "ramda";
import { useSliderState } from "react-stately";
import {
  useSlider,
  useSliderThumb,
  useFocusRing,
  VisuallyHidden,
  mergeProps,
  useNumberFormatter,
} from "react-aria";
import cls from "./styles.module.css";

export default function Slider(props) {
  const trackRef = React.useRef(null);
  const numberFormatter = useNumberFormatter({});
  const state = useSliderState({ ...props, numberFormatter });
  const { groupProps, trackProps, outputProps } = useSlider(
    props,
    state,
    trackRef
  );

  const trackCurrentStyle = {
    width: `${state.getThumbPercent(0) * 100}%`,
  };

  return (
    <div {...groupProps} className={cls["container"]}>
      <output {...outputProps} className={cls["output"]}>
        {props.formatter(state.getThumbValue(0))}
      </output>
      <div
        {...trackProps}
        ref={trackRef}
        className={cls["thumb-and-track-wrapper"]}
      >
        <div className={cls["track__total"]} />

        <div className={cls["track__current"]} style={trackCurrentStyle} />

        <Thumb index={0} state={state} trackRef={trackRef} />
      </div>
      <output {...outputProps} className={cls["output"]}>
        {props.formatter(props.maxValue)}
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

  const thumbStyle = {
    left: `${state.getThumbPercent(index) * 100}%`,
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

Slider.propTypes = {
  isDisabled: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  step: PropTypes.number,
  formatter: PropTypes.func,
};

Slider.defaultProps = {
  isDisabled: false,
  minValue: 0,
  maxValue: 100,
  step: 1,
  formatter: identity,
};
