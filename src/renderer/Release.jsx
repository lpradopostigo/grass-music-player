import React from "react";

import PropTypes from "prop-types";
import base64js from "base64-js";

import classNames from "./Release.module.css";

export default function Release({ data }) {
  const pictureAlt = `${data.title} release art`;
  const pictureSrc = `data:image/png;base64,${base64js.fromByteArray(
    data.picture
  )}`;

  return (
    <div className={classNames.container}>
      <img className={classNames.picture} src={pictureSrc} alt={pictureAlt} />

      <div className={classNames.textContainer}>
        <span className={classNames.title}>{data.title}</span>
        <span className={classNames.artist}>{data.artist}</span>
      </div>
    </div>
  );
}

Release.defaultProps = {
  data: {
    title: "unknown",
    artist: "unknown",
    picture: null,
  },
};

Release.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    picture: PropTypes.instanceOf(Uint8Array),
  }),
};
