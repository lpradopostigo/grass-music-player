import React, { useEffect, useState } from "react";

import { map } from "ramda";
import { library } from "../../services/api";
import cls from "./styles.module.css";
import Release from "../../components/Release/Release";

export default function ReleaseCollectionView() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    (async () => {
      setReleases(await library.getReleases());
    })();
  }, []);

  return (
    <div className={cls["container"]}>
      {map(
        (release) => (
          <Release data={release} key={release.id} />
        ),
        releases
      )}
    </div>
  );
}
