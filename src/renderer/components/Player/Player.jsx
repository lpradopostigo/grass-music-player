import React from "react";
import { ActionIcon, createStyles, Text } from "@mantine/core";
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5";
import { Else, If, Then } from "react-if";
import ReleasePicture from "../ReleasePicture";
import PlaybackProgress from "../PlaybackProgress";
import View from "../layout/View";
import usePlayer from "../../hooks/usePlayer";

export default function Player() {
  const { state, controls } = usePlayer();
  const { classes, theme } = useStyles();

  return (
    <View className={classes.container}>
      <View
        style={{ flexBasis: "25%", flexShrink: 0, flexGrow: 0 }}
        align="center"
        direction="row"
        spacing={theme.spacing.md}
      >
        <ReleasePicture
          data={{
            title: state?.track.releaseTitle,
            artist: state?.track.releaseArtist,
            picture: state?.track.picture,
          }}
          size="sm"
        />

        <View>
          <Text weight={500} lineClamp={1}>
            {state?.track.title}
          </Text>

          <Text size="sm">{state?.track.artist}</Text>

          <Text size="xs">{state?.track.releaseTitle}</Text>
        </View>
      </View>
      <View
        direction="row"
        align="center"
        justify="center"
        style={{ padding: `0 ${theme.spacing.xl}px` }}
        spacing={theme.spacing.md}
      >
        <ActionIcon onClick={controls.previous}>
          <IoPlaySkipBack />
        </ActionIcon>

        <If condition={state.playbackState === "playing"}>
          <Then>
            <ActionIcon size={40} onClick={controls.pause}>
              <IoPauseCircle color={theme.other.accentColor} size={40} />
            </ActionIcon>
          </Then>

          <Else>
            <ActionIcon size={40} onClick={controls.play}>
              <IoPlayCircle color={theme.other.accentColor} size={40} />
            </ActionIcon>
          </Else>
        </If>

        <ActionIcon onClick={controls.next}>
          <IoPlaySkipForward />
        </ActionIcon>
      </View>

      <PlaybackProgress
        style={{ flexGrow: 1 }}
        current={state?.track.position}
        total={state?.track.duration}
        onTrackClick={controls.seek}
      />
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },

  playerControlIcon: {
    height: theme.fontSizes.xl,
    width: theme.fontSizes.xl,
  },
}));
