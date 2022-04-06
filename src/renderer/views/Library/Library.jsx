import React from "react";

import { map } from "ramda";
import { createStyles, Group, ScrollArea } from "@mantine/core";
import { useGetReleasesQuery } from "../../services/api/libraryApi";
import Release from "../../components/Release/Release";

export default function Library() {
  const { data: releases = [] } = useGetReleasesQuery();
  const { classes, theme } = useStyles();

  return (
    <ScrollArea className={classes.container}>
      <Group
        className={classes.contentContainer}
        spacing={theme.spacing.xl}
        p={theme.other.spacing.safeView}
        align="flex-start"
      >
        {map(
          (release) => (
            <Release data={release} key={release.id} />
          ),
          releases
        )}
      </Group>
    </ScrollArea>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    alignSelf: "stretch",
    flexGrow: 1,
    backgroundColor: theme.white,
  },
}));
