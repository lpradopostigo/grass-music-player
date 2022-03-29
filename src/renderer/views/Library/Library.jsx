import React from "react";

import { map } from "ramda";
import { createStyles } from "@mantine/core";
import { useGetReleasesQuery } from "../../services/api/libraryApi";
import Release from "../../components/Release/Release";

export default function Library() {
  const { data: releases = [] } = useGetReleasesQuery();
  const { classes } = useStyles();

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
