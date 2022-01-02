import React from "react";

import PropTypes from "prop-types";
import { map } from "ramda";

import Release from "./Release";
import classNames from "./ReleaseCollection.module.css";

export default function ReleaseCollection({ data }) {
  return (
    <div className={classNames.container}>
      {map(
        (release) => (
          <Release data={release} key={release.id} />
        ),
        data
      )}
    </div>
  );
}

ReleaseCollection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      artist: PropTypes.string,
      year: PropTypes.number,
      picture: PropTypes.instanceOf(Uint8Array),
    })
  ).isRequired,
};
