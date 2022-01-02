import React, { useEffect, useState } from 'react';

import ReleaseCollection from './ReleaseCollection';
import { library } from './services/api';

export default function Home() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    (async () => {
      setReleases(await library.getReleases());
    })();
  });

  return <ReleaseCollection data={releases} />;
}
