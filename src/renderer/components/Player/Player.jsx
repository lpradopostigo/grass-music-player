import React from "react";
import { createStyles, Grid, Text } from "@mantine/core";
import { FiSkipForward, FiSkipBack, FiPlay, FiPause } from "react-icons/fi";
import { Else, If, Then } from "react-if";
import ReleasePicture from "../ReleasePicture";
import PlaybackProgress from "../PlaybackProgress";
import View from "../layout/View";
import usePlayer from "../../hooks/usePlayer";
import { PlaybackState } from "../../hooks/usePlayerPlaybackState";

export default function Player() {
  const { state, controls } = usePlayer();
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
            onClick={controls.previous}
          />

          <If condition={state.playbackState === PlaybackState.PLAYING}>
            <Then>
              <FiPause
                className={classes.playerControlIcon}
                onClick={controls.pause}
              />
            </Then>

            <Else>
              <FiPlay
                className={classes.playerControlIcon}
                onClick={controls.play}
              />
            </Else>
          </If>

          <FiSkipForward
            className={classes.playerControlIcon}
            onClick={controls.next}
          />
        </View>
      </Grid.Col>

      <Grid.Col span={1}>
        <View direction="row" spacing={theme.spacing.md}>
          <ReleasePicture
            data={{
              title: state.track.releaseTitle,
              artist: state.track.releaseArtist,
              picture: state.track.picture,
            }}
            size="sm"
          />

          <View align="flex-start">
            <Text weight={500} lineClamp={1}>
              {state.track.title}
            </Text>

            <Text size="sm">{state.track.artist}</Text>

            <Text size="xs">{state.track.releaseTitle}</Text>
          </View>
        </View>
      </Grid.Col>
      <Grid.Col span={2}>
        <PlaybackProgress
          current={state.track.position}
          total={state.track.duration}
          onTrackClick={controls.seek}
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
