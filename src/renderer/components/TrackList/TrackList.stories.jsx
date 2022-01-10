import React from "react";
import TrackList from "./TrackList";

export default {
  title: "TrackList",
  component: TrackList,
};

export function Normal(args) {
  return <TrackList
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
    playingTrackIndex={1}
    {...args}
  />
}
