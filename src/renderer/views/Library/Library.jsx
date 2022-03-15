import React, { useEffect, useState } from "react";

import { map } from "ramda";
import { createStyles } from "@mantine/core";
import { library } from "../../services/api";
import Release from "../../components/Release/Release";

export default function Library() {
  const [releases, setReleases] = useState([]);
  const { classes } = useStyles();

  useEffect(() => {
    (async () => {
      setReleases(await library.getReleases());
    })();
  }, []);

  return (
    <div className={classes.container}>
      {map(
        (release) => (
          <Release data={release} key={release.id} />
        ),
        releases
      )}
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    height: "100%",
    flexWrap: "wrap",
    overflowY: "scroll",
    overflowX: "hidden",
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
  },
}));
