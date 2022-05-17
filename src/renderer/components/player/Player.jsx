import React, { useCallback, useRef } from "react";
import {
  createStyles,
  Group,
  Progress,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import PropTypes from "prop-types";
import ReleasePicture from "../release-picture/ReleasePicture";
import usePlayer from "../../hooks/usePlayer";
import { secondsToAudioDuration } from "../../utils/format/format";
import PlayerControls from "./player-controls/PlayerControls";
import { valueToPercentage } from "../../utils/conversion";

export default function Player(props) {
  const { className, style } = props;

  const { state, controls, isLoading } = usePlayer();
  const { classes, theme } = useStyles();

  const { track } = state ?? {};
  const handleProgressClick = (event) => {
    const { width, x } = progressRef.current.getBoundingClientRect();
    const relX = event.clientX - x;
    controls.seek((track.duration * relX) / width);
  };

  const progressRef = useRef(null);

  const releasePictureData = {
    title: track?.releaseTitle ?? "",
    artist: track?.releaseArtist ?? "",
    picture: track?.thumbnail,
    id: track?.id ?? -1,
  };

  return (
    isLoading || (
      <Group className={className} spacing={0} style={style}>
        <PlayerControls playing={state.playbackState === "playing"} />
        <Group className={classes.playerInfo} p={theme.spacing.md}>
          <ReleasePicture data={releasePictureData} size="sm" />

          {state.playbackState === "stopped" || (
            <Stack
              spacing={theme.spacing.xs / 2}
              className={classes.textAndSliderWrapper}
            >
              <Stack spacing={0}>
                <Text weight={600}>{track.title}</Text>

                <Group position="apart">
                  <Text color="dimmed" size="sm">
                    {track.artist}
                  </Text>

                  <Group spacing={theme.spacing.xs}>
                    <Text weight={500} size="sm">
                      {secondsToAudioDuration(track.position)}
                    </Text>
                    <Text size="xs" color="dimmed">
                      /
                    </Text>
                    <Text size="xs" color="dimmed">
                      {secondsToAudioDuration(track.duration)}
                    </Text>
                  </Group>
                </Group>
              </Stack>

              <Progress
                ref={progressRef}
                onClick={handleProgressClick}
                value={valueToPercentage(track.position, track.duration)}
                size="xs"
              />
            </Stack>
          )}
        </Group>
      </Group>
    )
  );
}

Player.defaultProps = {
  className: undefined,
  style: undefined,
};

Player.propTypes = {
  className: PropTypes.string,
  style: PropTypes.any,
};

const useStyles = createStyles((theme) => ({
  playerInfo: {
    backgroundColor: theme.white,
    flexGrow: 1,
  },

  textAndSliderWrapper: {
    flexGrow: 1,
  },
}));
