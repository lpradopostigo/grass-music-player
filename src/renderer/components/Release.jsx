import React from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import classNames from "./Release.module.css";
import ReleasePicture from "./ReleasePicture";

export default function Release({ data }) {
  return (
    <Link to="/ReleaseView" state={data}>
      <div className={classNames.container}>
        <ReleasePicture data={data} />

        <div className={classNames.textContainer}>
          <span className={classNames.title}>{data.title}</span>
          <span className={classNames.artist}>{data.artist}</span>
        </div>
      </div>
    </Link>
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
