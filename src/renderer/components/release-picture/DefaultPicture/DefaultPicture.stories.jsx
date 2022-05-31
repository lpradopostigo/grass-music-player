import React from "react";
import DefaultPicture from "./DefaultPicture.jsx";

export default {
  title: "ReleasePicture/DefaultPicture",
  component: DefaultPicture,
};

export function Default(props) {
  return <DefaultPicture {...props} />;
}
