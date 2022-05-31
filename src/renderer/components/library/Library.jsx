import React, { useEffect, useState } from "react";
import { createStyles } from "@mantine/core";
import ReleasePicture from "../release-picture/ReleasePicture";

export default function Library() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    window.api.invoke("library:get-releases").then(setReleases);
  }, []);

  const { classes, theme } = useStyles();

  const processedReleases = releases.map((release) => (
    <ReleasePicture data={release} />
  ));

  return <div className={classes.container}>{processedReleases}</div>;
}

const useStyles = createStyles((theme) => ({
  container: {
    alignSelf: "stretch",
    flexGrow: 1,
    backgroundColor: theme.white,
    overflowY: "scroll",
    display: "flex",
    flexWrap: "wrap",
  },

  contentContainer: {
    overflowY: "scroll",
  },

  loaderWrapper: {
    flexGrow: 1,
  },
}));
