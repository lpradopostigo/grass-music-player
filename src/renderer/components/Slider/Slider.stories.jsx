import React from "react";
import Slider from "./Slider";

export default {
  title: "Slider",
  component: Slider,
};

export function Normal(args) {
  return (
    <Slider
      maxValue={120}
      step={0.5}
      formatter={(value) => `output ${value}`}
      {...args}
    />
  );
}
