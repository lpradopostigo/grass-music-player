import React, { useState } from "react";
import PlaybackProgress from "./PlaybackProgress";

export default {
  title: "PlaybackProgress",
  component: PlaybackProgress,
};

export function Normal() {
  const [trackPosition, setTrackPosition] = useState(12);
  return (
    <PlaybackProgress
      onTrackClick={(position) => {
        setTrackPosition(position);
      }}
      duration={112}
      position={trackPosition}
    />
  );
}
