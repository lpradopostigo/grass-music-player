import React from "react";
import { MemoryRouter } from "react-router-dom";
import Release from "./Release";
import picture from "../../../../dummy_local_files/library/Katatonia/The Great Cold Distance/cover.jpg";

export default {
  title: "Release",
  component: Release,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export function Normal(args) {
  return (
    <Release
      data={{
        artist: "Katatonia",
        title: "The Great Cold Distance",
        picture: picture,
      }}
      {...args}
    />
  );
}
