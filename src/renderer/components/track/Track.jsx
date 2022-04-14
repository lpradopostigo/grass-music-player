import React from "react";
import {
  Text,
  createStyles,
  UnstyledButton,
  Group,
  Stack,
} from "@mantine/core";
import PropTypes from "prop-types";
import { secondsToAudioDuration } from "../../utils/format/format";

export default function Track(props) {
  const { data, onClick, active } = props;
  const { classes, theme } = useStyles({ active });

  return (
    <UnstyledButton onClick={onClick}>
      <Group noWrap className={classes.contentContainer} p={theme.spacing.xs}>
        <Group noWrap className={classes.wrapper}>
          <Text size="xs" color="dimmed">
            {data.trackNumber}
          </Text>

          <Stack spacing={0}>
            <Text weight={600} lineClamp={1}>
              {data.title}
            </Text>
            <Text color="dimmed" lineClamp={1} size="sm">
              {data.artist}
            </Text>
          </Stack>
        </Group>

        <Text size="xs" align="right" color="dimmed">
          {secondsToAudioDuration(data.duration)}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

Track.defaultProps = {
  active: false,
  className: undefined,
};

Track.propTypes = {
  data: PropTypes.shape({
    trackNumber: PropTypes.number.isRequired,
    discNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const useStyles = createStyles((theme, { active }) => ({
  contentContainer: {
    backgroundColor: active ? theme.colors.gray[0] : "transparent",
    borderRadius: theme.radius.md,
  },

  wrapper: {
    flexGrow: 1,
  },
}));
