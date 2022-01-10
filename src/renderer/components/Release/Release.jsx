import React from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import cls from "./styles.module.css";
import ReleasePicture from "../ReleasePicture/ReleasePicture";

export default function Release({ data }) {
  return (
    <Link to="/ReleaseView" state={data}>
      <div className={cls["container"]}>
        <ReleasePicture data={data} />

        <div className={cls["text__wrapper"]}>
          <span className={cls["title"]}>{data.title}</span>
          <span className={cls["artist"]}>{data.artist}</span>
        </div>
      </div>
    </Link>
  );
}

Release.defaultProps = {
  data: {
    picture: null,
  },
};

Release.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    picture: PropTypes.instanceOf(Uint8Array),
  }),
};
