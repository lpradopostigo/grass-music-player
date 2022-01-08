import React from "react";

import PropTypes from "prop-types";
import base64js from "base64-js";
import classNames from "classnames";

import styles from "./styles.module.css";

export default function ReleasePicture({ data, variant }) {
  const pictureAlt = `${data.title} - ${data.artist} release picture`;
  const pictureSrc =
    typeof data.picture === "string"
      ? data.picture
      : `data:image/png;base64,${base64js.fromByteArray(data.picture)}`;
  return (
    <img
      className={classNames(styles.container, styles[variant])}
      src={pictureSrc}
      alt={pictureAlt}
    />
  );
}

ReleasePicture.defaultProps = {
  data: {
    picture: null,
  },
  variant: "big",
};

ReleasePicture.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    picture: PropTypes.oneOfType([
      PropTypes.instanceOf(Uint8Array),
      PropTypes.string,
    ]),
  }),

  variant: PropTypes.oneOf(["big", "medium", "small"]),
};
