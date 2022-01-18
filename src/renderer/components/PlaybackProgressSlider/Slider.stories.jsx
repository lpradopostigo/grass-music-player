import React from "react";
import PlaybackProgressSlider from "./PlaybackProgressSlider";

export default {
  title: "Slider",
  component: PlaybackProgressSlider,
};

export function Normal(args) {
  return (
    <PlaybackProgressSlider
      maxValue={120}
      step={0.5}
      formatter={(value) => `output ${value}`}
      {...args}
    />
  );
}
