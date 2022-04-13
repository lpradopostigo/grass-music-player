import React from "react";
import {
  ActionIcon,
  Center,
  createStyles,
  Group,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import {
  IoPlayCircle,
  IoPauseCircle,
  IoPlaySkipForwardCircle,
  IoPlaySkipBackCircle,
} from "react-icons/io5";
import PropTypes from "prop-types";
import ReleasePicture from "../release-picture/ReleasePicture";
import usePlayer from "../../hooks/usePlayer";
import { navigationWidth } from "../../services/constants";
import { secondsToAudioDuration } from "../../utils/format/format";

export default function Player(props) {
  const { className, style } = props;

  const { state, controls, isLoading } = usePlayer();
  const { classes, theme } = useStyles();

  const { track } = state ?? {};
  const handleSliderOnChange = (value) => {
    controls.seek(value);
  };
  return (
    isLoading || (
      <Group className={className} spacing={0} style={style}>
        <Center className={classes.playerControls}>
          <Group>
            <ActionIcon onClick={controls.previous}>
              <IoPlaySkipBackCircle size={40} color={theme.other.accentColor} />
            </ActionIcon>

            {state.playbackState === "playing" ? (
              <ActionIcon size={48} onClick={controls.pause}>
                <IoPauseCircle color={theme.other.accentColor} size={48} />
              </ActionIcon>
            ) : (
              <ActionIcon size={48} onClick={controls.play}>
                <IoPlayCircle color={theme.other.accentColor} size={48} />
              </ActionIcon>
            )}

            <ActionIcon onClick={controls.next}>
              <IoPlaySkipForwardCircle
                size={40}
                color={theme.other.accentColor}
              />
            </ActionIcon>
          </Group>
        </Center>

        <Group className={classes.playerInfo} p={theme.spacing.md}>
          <ReleasePicture
            data={{
              title: track.releaseTitle ?? "",
              artist: track.releaseArtist ?? "",
              picture: track.pictureSm,
            }}
            size="sm"
          />

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

              <Slider
                size="xs"
                disabled={state.playbackState === "stopped"}
                color={theme.other.accentColor}
                step={5}
                label={null}
                onChange={handleSliderOnChange}
                value={track.position}
                max={track.duration}
                min={0}
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

  playerControls: {
    flexBasis: navigationWidth,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(24px)",
  },

  textAndSliderWrapper: {
    flexGrow: 1,
  },
}));
