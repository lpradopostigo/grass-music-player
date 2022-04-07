import React from "react";
import { useLocation } from "react-router-dom";
import {
  map,
  groupBy,
  prop,
  values,
  head,
  addIndex,
  partial,
  pipe,
  findIndex,
  propEq,
} from "ramda";
import {
  createStyles,
  Text,
  ScrollArea,
  Button,
  Title,
  Group,
  Stack,
} from "@mantine/core";
import { IoPlayCircle } from "react-icons/io5";
import TrackList from "../../components/TrackList";
import Track from "../../components/Track";
import { useGetReleaseTracksQuery } from "../../services/api/libraryApi";
import ReleasePicture from "../../components/ReleasePicture";
import parsePictureSrc from "../../utils/parsePictureSrc";
import usePlayer from "../../hooks/usePlayer";

export default function Release() {
  const { state: releaseData } = useLocation();
  const { data: tracks = [] } = useGetReleaseTracksQuery(releaseData.id);
  const { classes, theme } = useStyles();
  const {
    controls: { play, skipToIndex, setPlaylist },
    state: { track },
  } = usePlayer();

  const showDiscNumber = releaseData.numberOfDiscs > 1;
  const groupByDiscNumber = groupBy(prop("discNumber"));

  const playTrack = async (index) => {
    await setPlaylist(tracks);
    await skipToIndex(index);
    await play();
  };

  const mapIndexed = addIndex(map);
  const renderTrackList = (dataArr) => (
    <TrackList
      key={head(dataArr)?.discNumber}
      showDiscNumber={showDiscNumber}
      discNumber={head(dataArr)?.discNumber}
    >
      {mapIndexed((data) => {
        const index = findIndex(propEq("id", data.id))(tracks);
        return (
          <Track
            active={track.id === data.id}
            key={data.id}
            data={data}
            onClick={partial(playTrack, [index])}
          />
        );
      }, dataArr)}
    </TrackList>
  );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <img
          src={parsePictureSrc(releaseData.picture)}
          alt="release"
          className={classes.headerBackground}
        />

        <ReleasePicture data={releaseData} size="lg" />

        <Stack spacing={theme.spacing.xl} sx={{ zIndex: 1 }} align="flex-start">
          <Stack spacing={theme.spacing.xs}>
            <Title order={1}>{releaseData.title}</Title>

            <Group align="center" spacing="xs">
              <Text inline weight={500}>
                {releaseData.year}
              </Text>

              <Text inline weight={600} size="lg">
                {releaseData.artist}
              </Text>
            </Group>
          </Stack>

          <Button
            compact
            onClick={partial(playTrack, [0])}
            color={theme.other.accentColor}
            leftIcon={<IoPlayCircle size={theme.fontSizes.lg} />}
          >
            Play
          </Button>
        </Stack>
      </div>

      <ScrollArea className={classes.scrollArea}>
        <Stack p={theme.other.spacing.view} spacing={theme.other.spacing.view}>
          {pipe(groupByDiscNumber, values, map(renderTrackList))(tracks)}
        </Stack>
      </ScrollArea>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },

  header: {
    display: "flex",
    position: "relative",
    padding: theme.other.spacing.safeView,
    gap: theme.spacing.xl,
    alignItems: "center",
    boxShadow: theme.shadows.sm,
    color: theme.white,
    overflow: "hidden",
    flexShrink: 0,
    width: "100%",
  },

  headerBackground: {
    position: "absolute",
    filter: "brightness(50%)",
    top: 0,
    left: 0,
    objectFit: "cover",
    objectPosition: "center",
    width: "100%",
    height: 400,
  },

  scrollArea: {
    width: "100%",
    backgroundColor: theme.white,
  },

  trackList: {
    width: "100%",
    padding: theme.spacing.xl,
  },
}));
