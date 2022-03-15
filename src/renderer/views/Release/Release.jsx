import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  map,
  groupBy,
  prop,
  values,
  head,
  sortBy,
  addIndex,
  partial,
  pipe,
  flatten,
  sortWith,
  ascend,
  findIndex,
  propEq,
} from "ramda";
import { createStyles, Text, ScrollArea } from "@mantine/core";
import TrackList from "../../components/TrackList";
import Track from "../../components/Track";
import { library } from "../../services/api";
import ReleasePicture from "../../components/ReleasePicture";
import parsePictureSrc from "../../utils/parsePictureSrc";
import View from "../../components/layout/View";
import usePlayerControls from "../../hooks/usePlayerControls";
import usePlayerTrack from "../../hooks/usePlayerTrack";

export default function Release() {
  const { state: releaseData } = useLocation();
  const [tracks, setTracks] = useState([]);
  const { classes, theme } = useStyles();
  const { play, skipToIndex, setPlaylist } = usePlayerControls();
  const [track] = usePlayerTrack();

  const showDiscNumber = releaseData.numberOfDiscs > 1;
  const groupByDiscNumber = groupBy(prop("discNumber"));
  const sortTracks = sortWith([
    ascend(prop("discNumber")),
    ascend(prop("trackNumber")),
  ]);

  useEffect(() => {
    (async () => {
      const tracks = await library.getReleaseTracks(releaseData.id);
      setTracks(sortTracks(tracks));
    })();
  }, []);

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
          style={{
            position: "absolute",
            filter: "brightness(50%)",
            top: 0,
            left: 0,
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
            height: 400,
            zIndex: -1,
          }}
        />
        <ReleasePicture data={releaseData} size="lg" />

        <View spacing={theme.spacing.xs / 2}>
          <Text size="lg" weight="500">
            {releaseData.title}
          </Text>
          <Text size="md">{releaseData.artist}</Text>
          <Text size="sm">{releaseData.year}</Text>
        </View>
      </View>
      <ScrollArea classNames={{ root: classes.scrollArea }}>
        {pipe(groupByDiscNumber, values, map(renderTrackList))(tracks)}
      </ScrollArea>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    height: "100%",
    overflow: "hidden",
  },

  header: {
    position: "relative",
    padding: `${theme.spacing.xl}px`,
    backgroundColor: "transparent",
    gap: theme.spacing.md,
    alignItems: "center",
    boxShadow: theme.shadows.sm,
    color: theme.white,
    overflow: "hidden",
    flexShrink: 0,
  },

  trackList: {
    padding: theme.spacing.xl,
  },

  scrollArea: {
    width: "100%",
  },
}));
