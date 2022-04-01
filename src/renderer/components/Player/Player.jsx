import React from "react";
import { ActionIcon, createStyles, Text } from "@mantine/core";
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipForwardCircle,
  IoPlaySkipBackCircle,
} from "react-icons/io5";
import { Else, If, Then } from "react-if";
import ReleasePicture from "../ReleasePicture";
import PlaybackProgress from "../PlaybackProgress";
import View from "../layout/View";
import usePlayer from "../../hooks/usePlayer";
import { navigationWidth } from "../../services/constants";

export default function Player() {
  const { state, controls } = usePlayer();
  const { classes, theme } = useStyles();

  return (
    <View className={classes.container}>
      <View className={classes.playerControls} spacing={theme.spacing.md}>
        <ActionIcon onClick={controls.previous}>
          <IoPlaySkipBackCircle size={40} color={theme.other.accentColor} />
        </ActionIcon>

        <If condition={state.playbackState === "playing"}>
          <Then>
            <ActionIcon size={48} onClick={controls.pause}>
              <IoPauseCircle color={theme.other.accentColor} size={48} />
            </ActionIcon>
          </Then>

          <Else>
            <ActionIcon size={48} onClick={controls.play}>
              <IoPlayCircle color={theme.other.accentColor} size={48} />
            </ActionIcon>
          </Else>
        </If>

        <ActionIcon onClick={controls.next}>
          <IoPlaySkipForwardCircle size={40} color={theme.other.accentColor} />
        </ActionIcon>
      </View>

      <View
        direction="row"
        align="center"
        grow
        spacing={theme.spacing.md}
        className={classes.playerInfo}
      >
        <ReleasePicture
          data={{
            title: state.track.releaseTitle,
            artist: state.track.releaseArtist,
            picture: state.track.picture,
          }}
          size="sm"
        />

        <PlaybackProgress
          data={{
            title: state.track.title,
            artist: state.track.artist,
            position: state.track.position || 0,
            duration: state.track.duration || 0,
          }}
          onTrackClick={controls.seek}
          style={{ flexGrow: 1, flexShrink: 0 }}
        />
      </View>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  playerInfo: {
    padding: theme.spacing.lg,
    backgroundColor: theme.white,
  },

  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexBasis: navigationWidth,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.875)",
    backdropFilter: "blur(24px)",
  },
}));
