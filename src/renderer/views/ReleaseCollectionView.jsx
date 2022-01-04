import React, { useEffect, useState } from "react";

import { library } from "../services/api";
import classNames from "./ReleaseCollectionView.module.css";
import { map } from "ramda";
import Release from "../components/Release";

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
