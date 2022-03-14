import React from "react";
import PropTypes from "prop-types";
import { createStyles, Group, Progress, Text } from "@mantine/core";
import { secondsToAudioDuration } from "../../utils/format/format";
import { percentageToValue, valueToPercentage } from "../../utils/conversion";
import useDimensions from "../../hooks/useDimensions";

export default function PlaybackProgress(props) {
  const { current, total, onTrackClick } = props;
  const [progressWrapperRef, { width }] = useDimensions();
  const { classes, theme } = useStyles();

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    onTrackClick?.(percentageToValue(valueToPercentage(x, width), total));
  };

  return (
    <Group className={classes.container}>
      <Text className={classes.text} size="sm">
        {secondsToAudioDuration(current)}
      </Text>
      <Group
        ref={progressWrapperRef}
        className={classes.progressWrapper}
        onClick={handleClick}
      >
        <Progress
          color={theme.other.accentColor}
          className={classes.progress}
          value={valueToPercentage(current, total)}
        />
      </Group>

      <Text className={classes.text} size="sm">
        {secondsToAudioDuration(total)}
      </Text>
    </Group>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  progressWrapper: {
    flex: 1,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },

  progress: {
    flex: 1,
  },

  text: {
    lineHeight: "normal",
    width: "5ch",
  },
}));

PlaybackProgress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool,
  onTrackClick: PropTypes.func.isRequired,
};

PlaybackProgress.defaultProps = {
  isDisabled: false,
};
