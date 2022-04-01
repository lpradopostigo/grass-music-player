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
import { createStyles, Text, ScrollArea, Button, Title } from "@mantine/core";
import { IoPlayCircle } from "react-icons/io5";
import TrackList from "../../components/TrackList";
import Track from "../../components/Track";
import { useGetReleaseTracksQuery } from "../../services/api/libraryApi";
import ReleasePicture from "../../components/ReleasePicture";
import parsePictureSrc from "../../utils/parsePictureSrc";
import View from "../../components/layout/View";
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
      className={classes.trackList}
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
    <View className={classes.container}>
      <View className={classes.header} direction="row">
        <img
          src={parsePictureSrc(releaseData.picture)}
          alt=""
          className={classes.headerBackground}
        />
        <ReleasePicture data={releaseData} size="lg" />
        <View spacing={theme.spacing.lg} style={{ zIndex: 1 }}>
          <View>
            <Title order={1}>{releaseData.title}</Title>

            <View direction="row" align="center" spacing={theme.spacing.md}>
              <Text weight={500}>{releaseData.year}</Text>
              <Text weight={600} size="lg">
                {releaseData.artist}
              </Text>
            </View>
          </View>

          <Button
            compact
            onClick={partial(playTrack, [0])}
            color={theme.other.accentColor}
            leftIcon={<IoPlayCircle size={theme.fontSizes.lg} />}
          >
            Play
          </Button>
        </View>
      </View>

      <ScrollArea classNames={{ root: classes.scrollArea }}>
        <View spacing={theme.spacing.md}>
          {pipe(groupByDiscNumber, values, map(renderTrackList))(tracks)}
        </View>
      </ScrollArea>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },

  header: {
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
