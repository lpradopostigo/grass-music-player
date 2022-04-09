import React, { Suspense, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  map,
  groupBy,
  prop,
  values,
  head,
  partial,
  pipe,
  findIndex,
  propEq,
} from "ramda";
import { mapIndexed } from "ramda-adjunct";
import { createStyles, ScrollArea, Stack, Skeleton } from "@mantine/core";
import TrackList from "../../components/TrackList";
import { useGetReleaseTracksQuery } from "../../services/api/libraryApi";
import usePlayer from "../../hooks/usePlayer";
import ReleaseHeader from "../../components/ReleaseHeader";

const Track = React.lazy(() => import("../../components/Track"));

export default function Release() {
  const { state: releaseData } = useLocation();
  const { data: tracks, isLoading } = useGetReleaseTracksQuery(releaseData.id);
  const { classes, theme } = useStyles({});
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

  const renderTrackList = (dataArr) => (
    <TrackList
      key={head(dataArr)?.discNumber}
      showDiscNumber={showDiscNumber}
      discNumber={head(dataArr)?.discNumber}
    >
      {mapIndexed((data) => {
        const index = findIndex(propEq("id", data.id))(tracks);
        return (
          <Suspense key={data.id} fallback={<Skeleton height={64} />}>
            <Track
              active={track.id === data.id}
              data={data}
              onClick={partial(playTrack, [index])}
            />
          </Suspense>
        );
      })(dataArr)}
    </TrackList>
  );

  const processedTracks = useMemo(
    () =>
      isLoading
        ? []
        : pipe(groupByDiscNumber, values, map(renderTrackList))(tracks),
    [isLoading]
  );

  const handlePlayButtonClick = useCallback(() => playTrack(0), []);

  return (
    <Stack className={classes.container} spacing={0}>
      <ReleaseHeader
        data={releaseData}
        onPlayButtonClick={handlePlayButtonClick}
      />
      <ScrollArea>
        <Stack p={theme.other.spacing.view} spacing={theme.other.spacing.view}>
          {processedTracks}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    overflow: "hidden",
    flexGrow: 1,
    backgroundColor: theme.white,
  },
}));
