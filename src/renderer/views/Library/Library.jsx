import React from "react";

import { map } from "ramda";
import { createStyles, ScrollArea } from "@mantine/core";
import { useGetReleasesQuery } from "../../services/api/libraryApi";
import Release from "../../components/Release/Release";
import { titleBarButtonSize } from "../../services/constants";

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
    backgroundColor: theme.white,
  },

  contentContainer: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing.xl,
    padding: theme.other.spacing.safeView,
    flexWrap: "wrap",
  },
}));
