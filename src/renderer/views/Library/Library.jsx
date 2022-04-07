import React from "react";

import { map } from "ramda";
import { createStyles, Group, ScrollArea, Stack, Title } from "@mantine/core";
import { useGetReleasesQuery } from "../../services/api/libraryApi";
import Release from "../../components/Release/Release";

export default function Library() {
  const { data: releases = [] } = useGetReleasesQuery();
  const { classes, theme } = useStyles();

  return (
    <Stack className={classes.container} spacing={0}>
      <Title p={theme.other.spacing.safeView} order={1}>
        Library
      </Title>
      <ScrollArea>
        <Stack
          p={theme.other.spacing.view}
          pt={0}
          spacing={theme.other.spacing.view}
        >
          <Group
            className={classes.contentContainer}
            spacing={theme.spacing.xl}
            align="flex-start"
          >
            {map(
              (release) => (
                <Release data={release} key={release.id} />
              ),
              releases
            )}
          </Group>
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    alignSelf: "stretch",
    flexGrow: 1,
    backgroundColor: theme.white,
  },
}));
