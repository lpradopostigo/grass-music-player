import React from "react";
import Player from "./Player";

export default {
  title: "Player",
  component: Player,
};

export function Normal(args) {
  return (
    <Player
      data={{
        title: "AMON",
        artist: "DIR EN GREY",
        releaseTitle: "DUM SPIRO SPERO",
      }}
      {...args}
    />
  );
}
