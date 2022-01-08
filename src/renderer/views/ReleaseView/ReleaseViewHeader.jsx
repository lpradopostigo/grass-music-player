import React from "react";

import classNames from "./ReleaseViewHeader.module.css";
import ReleasePicture from "../../components/ReleasePicture/ReleasePicture";

export default function ReleaseViewHeader({ data }) {
  return (
    <div className={classNames.container}>
      <ReleasePicture data={data} />
      <div className={classNames.text}>
        <span className={classNames.title}>{data.title}</span>
        <span className={classNames.artist}>{data.artist}</span>
        <span className={classNames.year}>{data.year}</span>
      </div>
    </div>
  );
}
