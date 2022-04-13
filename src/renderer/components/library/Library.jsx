import React, { useMemo } from "react";
import { map } from "ramda";
import {
  createStyles,
  Group,
  Stack,
  Loader,
  Center,
  Anchor,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useGetReleasesQuery } from "../../services/api/libraryApi";
import Release from "../release/Release";
import Header from "../header/Header";

export default function Library() {
  const { data, isLoading } = useGetReleasesQuery();
  const { classes, theme } = useStyles();

  const releases = useMemo(() => {
    if (isLoading) {
      return [];
    }

    return map((release) => {
      const releaseData = {
        ...release,
        picture: release.pictureMd,
      };

      const linkData = {
        ...release,
        picture: release.pictureLg,
      };

      return (
        <Anchor
          underline={false}
          component={Link}
          to={`/library/${release.id}`}
          state={linkData}
          key={release.id}
        >
          <Release data={releaseData} />
        </Anchor>
      );
    })(data);
  }, [isLoading, data]);

  return (
    <Stack className={classes.container} spacing={0}>
      <Header title="Library" />

      {isLoading ? (
        <Center className={classes.loaderWrapper}>
          <Loader />
        </Center>
      ) : (
        <Group
          className={classes.contentContainer}
          spacing={theme.spacing.xl}
          align="flex-start"
          p={theme.other.spacing.view}
          pt={0}
        >
          {releases}
        </Group>
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

  contentContainer: {
    overflowY: "scroll",
  },

  loaderWrapper: {
    flexGrow: 1,
  },
}));
