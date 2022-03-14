import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import {
  map,
  groupBy,
  prop,
  values,
  compose,
  head,
  sortBy,
  addIndex,
  partial,
} from "ramda";
import { createStyles, Text, ScrollArea } from "@mantine/core";
import TrackList from "../../components/TrackList";
import Track from "../../components/Track";
import { library, grass } from "../../services/api";
import ReleasePicture from "../../components/ReleasePicture";
import useCurrentTrack from "../../hooks/useCurrentTrack";
import parsePictureSrc from "../../utils/parsePictureSrc";
import View from "../../components/layout/View";

export default function Release() {
  const { state: releaseData } = useLocation();
  const [tracks, setTracks] = useState([]);
  const { classes, theme } = useStyles();
  const [currentTrack] = useCurrentTrack();

  useEffect(() => {
    (async () => {
      setTracks(await library.getReleaseTracks(releaseData.id));
    })();
  }, []);

  const playTrack = async (index) => {
    await grass.setPlaylist(tracks);
    await grass.skipToTrack(index);
    await grass.play();
  };

  const mapIndexed = addIndex(map);
  const sortByTrackNumber = sortBy(prop("trackNumber"));
  const showDiscNumber = releaseData.numberOfDiscs > 1;
  const groupByDiscNumber = groupBy(prop("discNumber"));
  const renderTrackList = (dataArr) => (
    <TrackList
      key={head(dataArr)?.discNumber}
      showDiscNumber={showDiscNumber}
      discNumber={head(dataArr)?.discNumber}
      className={classes.trackList}
    >
      {mapIndexed(
        (data, index) => (
          <Track
            key={data.id}
            data={data}
            onClick={partial(playTrack, [index])}
          />
        ),
        dataArr
      )}
    </TrackList>
  );
  const process = compose(
    map(renderTrackList),
    map(sortByTrackNumber),
    values,
    groupByDiscNumber
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
        {process(tracks)}
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
