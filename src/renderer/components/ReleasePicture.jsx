import React from "react";

import PropTypes from "prop-types";
import base64js from "base64-js";

import classNames from "./ReleasePicture.module.css";

export default function ReleasePicture({ data }) {
  const pictureAlt = `${data.title} - ${data.artist} release picture`;
  const pictureSrc = `data:image/png;base64,${base64js.fromByteArray(
    data.picture
  )}`;
  return (
    <img className={classNames.container} src={pictureSrc} alt={pictureAlt} />
  );
}

ReleasePicture.defaultProps = {
  data: {
    title: "unknown",
    artist: "unknown",
    picture: null,
  },
};

ReleasePicture.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    picture: PropTypes.instanceOf(Uint8Array),
  }),
};
