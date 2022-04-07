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
import parsePictureSrc from "../../utils/parsePictureSrc";
import usePlayer from "../../hooks/usePlayer";

export default function Release() {
  const { state: releaseData } = useLocation();
  const { data: tracks = [] } = useGetReleaseTracksQuery(releaseData.id);
  const { classes, theme } = useStyles({
    pictureSrc: parsePictureSrc(releaseData.picture),
  });
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
    <Stack className={classes.container} spacing={0}>
      <Stack
        className={classes.header}
        spacing={theme.other.spacing.view}
        align="flex-start"
        p={theme.other.spacing.safeView}
      >
        <Stack>
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
          leftIcon={<IoPlayCircle size={theme.fontSizes.lg} />}
        >
          Play
        </Button>
      </Stack>

      <ScrollArea>
        <Stack p={theme.other.spacing.view} spacing={theme.other.spacing.view}>
          {pipe(groupByDiscNumber, values, map(renderTrackList))(tracks)}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

const useStyles = createStyles((theme, { pictureSrc }) => ({
  container: {
    overflow: "hidden",
    flexGrow: 1,
    backgroundColor: theme.white,
  },

  header: {
    color: theme.white,
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backgroundImage: `url(${pictureSrc})`,
    backgroundSize: "cover",
    backgroundBlendMode: "overlay",
    backgroundPosition: "center",
  },
}));
