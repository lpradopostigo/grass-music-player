/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import TrackList from "./TrackList";
import Track from "../track/Track";

export default {
  title: "TrackList",
  component: TrackList,
};

const tracks = [
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
  {
    trackNumber: 3,
    discNumber: 1,
    artist: "Yes",
    title: "Five percent for nothing",
    duration: 323,
  },
];

export function Normal(args) {
  const [activeTrack, setActiveTrack] = useState(0);

  return (
    <TrackList showDiscNumber playingTrackIndex={1} {...args}>
      {tracks.map((track, index) => (
        <Track
          key={index}
          active={index === activeTrack}
          data={track}
          onClick={() => {
            setActiveTrack(index);
          }}
        />
      ))}
    </TrackList>
  );
}
