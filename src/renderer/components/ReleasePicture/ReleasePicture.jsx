import React from "react";

import PropTypes from "prop-types";
import base64js from "base64-js";
import clsx from "clsx";
import { If, Then, Else } from "react-if";

import cls from "./styles.module.css";
import colors from "../../../theme/colors";

export default function ReleasePicture({ data, variant }) {
  const pictureAlt = `${data.title} - ${data.artist} release picture`;
  const pictureSrc = parsePictureSrc(data.picture);
  const className = clsx(cls["container"], cls[variant]);

  return (
    <If condition={data.picture}>
      <Then>
        <img className={className} src={pictureSrc} alt={pictureAlt} />
      </Then>
      <Else>
        <svg
          className={className}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="200" height="200" fill={colors.grey.darkest} />
          <path
            d="M89.5833 137.5C99.9386 137.5 108.333 129.105 108.333 118.75C108.333 108.395 99.9386 100 89.5833 100C79.2279 100 70.8333 108.395 70.8333 118.75C70.8333 129.105 79.2279 137.5 89.5833 137.5Z"
            fill="white"
          />
          <path
            d="M100 62.5V118.75H108.333V79.1667L131.25 85.4167V70.8333L100 62.5Z"
            fill="white"
          />
        </svg>
      </Else>
    </If>
  );
}

function parsePictureSrc(picture) {
  if (!picture) return undefined;
  return typeof picture === "string"
    ? picture
    : `data:image/png;base64,${base64js.fromByteArray(picture)}`;
}

ReleasePicture.defaultProps = {
  data: {
    picture: undefined,
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
