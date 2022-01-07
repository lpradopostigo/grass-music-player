import React from "react";
import TrackList from "./TrackList";

export default {
  title: "TrackList",
  component: TrackList,
};

export const Normal = (args) => (
  <TrackList
    showDiscNumber
    data={[
      {
        trackNumber: 1,
        discNumber: 1,
        artist: "Yes",
        title: "Roundabout",
        duration: 2349,
      },
      {
        trackNumber: 2,
        discNumber: 1,
        artist: "Yes",
        title: "The fish",
        duration: 323,
      },
    ]}
    {...args}
  />
);
