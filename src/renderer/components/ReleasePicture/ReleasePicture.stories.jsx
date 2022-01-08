import React from "react";

import ReleasePicture from "./ReleasePicture";
import picture from "../../../../dummy_local_files/library/Distant Satellites/cover.jpg";

export default {
  title: "ReleasePicture",
  component: ReleasePicture,
};

export function Normal(args) {
  return (
    <ReleasePicture
      data={{
        artist: "Yes",
        title: "Roundabout",
        picture: picture,
      }}
      {...args}
    />
  );
}
