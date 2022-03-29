import React from "react";

import { map } from "ramda";
import { createStyles, ScrollArea } from "@mantine/core";
import { useGetReleasesQuery } from "../../services/api/libraryApi";
import Release from "../../components/Release/Release";

export default function Library() {
  const { data: releases = [] } = useGetReleasesQuery();
  const { classes } = useStyles();

  return (
    <ScrollArea
      classNames={{
        root: classes.container,
      }}
    >
      <div className={classes.contentContainer}>
        {map(
          (release) => (
            <Release data={release} key={release.id} />
          ),
          releases
        )}
      </div>
    </ScrollArea>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    height: "100%",
    width: "100%",
  },

  contentContainer: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    flexWrap: "wrap",
  },
}));
