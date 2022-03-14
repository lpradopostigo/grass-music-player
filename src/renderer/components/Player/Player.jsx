import React from "react";
import { createStyles, Grid, Text } from "@mantine/core";
import { FiSkipForward, FiSkipBack, FiPlay, FiPause } from "react-icons/fi";
import { Else, If, Then } from "react-if";
import ReleasePicture from "../ReleasePicture";
import PlaybackProgress from "../PlaybackProgress";
import { grass } from "../../services/api";
import usePlaybackStatus, {
  PlaybackStatus,
} from "../../hooks/usePlaybackStatus";
import useTrackPosition from "../../hooks/useTrackPosition";
import useCurrentTrack from "../../hooks/useCurrentTrack";
import View from "../layout/View";

export default function Player() {
  const playbackState = usePlaybackStatus();
  const [currentTrack] = useCurrentTrack();
  const [trackPosition, setTrackPosition] = useTrackPosition();

  const { classes, theme } = useStyles();
  return (
    <Grid columns={4} align="center" className={classes.container}>
      <Grid.Col span={1}>
        <View
          align="center"
          justify="center"
          direction="row"
          spacing={theme.spacing.md}
        >
          <FiSkipBack
            className={classes.playerControlIcon}
            onClick={grass.previous}
          />

          <If condition={playbackState === PlaybackStatus.PLAYING}>
            <Then>
              <FiPause
                className={classes.playerControlIcon}
                onClick={grass.pause}
              />
            </Then>

            <Else>
              <FiPlay
                className={classes.playerControlIcon}
                onClick={grass.play}
              />
            </Else>
          </If>

          <FiSkipForward
            className={classes.playerControlIcon}
            onClick={grass.next}
          />
        </View>
      </Grid.Col>

      <Grid.Col span={1}>
        <View direction="row" spacing={theme.spacing.md}>
          <ReleasePicture
            data={{ title: "", artist: "", picture: currentTrack?.picture }}
            size="sm"
          />

          <View align="flex-start">
            <Text weight={500} lineClamp={1}>
              {currentTrack?.title}
            </Text>

            <Text size="sm">{currentTrack?.artist}</Text>

            <Text size="xs">{currentTrack?.releaseTitle}</Text>
          </View>
        </View>
      </Grid.Col>
      <Grid.Col span={2}>
        <PlaybackProgress
          current={trackPosition.current}
          total={trackPosition.total}
          onTrackClick={(position) => {
            setTrackPosition(position);
          }}
        />
      </Grid.Col>
    </Grid>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    margin: 0,
  },

  playerControlIcon: {
    height: theme.fontSizes.xl,
    width: theme.fontSizes.xl,
  },
}));
