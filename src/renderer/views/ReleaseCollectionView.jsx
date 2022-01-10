import React, { useEffect, useState } from "react";

import { map } from "ramda";
import { library } from "../services/api";
import classNames from "./ReleaseCollectionView.module.css";
import Release from "../components/Release/Release";

export default function ReleaseCollectionView() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    (async () => {
      setReleases(await library.getReleases());
    })();
  }, []);

  return (
    <div className={classNames.container}>
      {map(
        (release) => (
          <Release data={release} key={release.id} />
        ),
        releases
      )}
    </div>
  );
}
