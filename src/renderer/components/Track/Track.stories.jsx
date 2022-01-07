import React from "react";

import Track from "./Track";

export default {
  title: "Track",
  component: Track,
};

export const Normal = (args) => (
  <Track
    data={{
      trackNumber: 1,
      discNumber: 1,
      artist: "Yes",
      title: "Roundabout",
      duration: 2349,
    }}
    {...args}
  />
);
