import React from "react";

import Track from "./Track";

export default {
  title: "Track",
  component: Track,
};

export function Normal(args) {
  return <Track
    data={{
      trackNumber: 1,
      discNumber: 1,
      artist: "Yes",
      title: "Roundabout",
      duration: 2349,
    }}
    {...args}
  />
}


export function LongTitle(args) {
  return <Track
    data={{
      trackNumber: 1,
      discNumber: 1,
      artist: "Anathema",
      title: "The Lost Song, Part 1 (acoustic in session - Liverpool Parr Street Studios)\n",
      duration: 349,
    }}
    {...args}
  />
}
