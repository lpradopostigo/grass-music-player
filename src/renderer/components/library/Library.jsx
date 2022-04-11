import React, { useMemo } from "react";

import { map } from "ramda";
import {
  createStyles,
  Group,
  ScrollArea,
  Stack,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import { useGetReleasesQuery } from "../../services/api/libraryApi";
import Release from "../release/Release";

export default function Library() {
  const { data, isLoading } = useGetReleasesQuery();
  const { classes, theme } = useStyles();

  const releases = useMemo(
    () =>
      isLoading ||
      map((release) => <Release data={release} key={release.id} />)(data),
    [isLoading]
  );

  return (
    <Stack className={classes.container} spacing={0}>
      <Title p={theme.other.spacing.safeView} order={1}>
        Library
      </Title>
      {isLoading ? (
        <Center className={classes.loaderWrapper}>
          <Loader />
        </Center>
      ) : (
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
              {releases}
            </Group>
          </Stack>
        </ScrollArea>
      )}
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    alignSelf: "stretch",
    flexGrow: 1,
    backgroundColor: theme.white,
  },

  loaderWrapper: {
    flexGrow: 1,
  },
}));
