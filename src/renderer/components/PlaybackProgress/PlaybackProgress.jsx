import React from "react";
import PropTypes from "prop-types";
import { createStyles, Group, Progress, Text } from "@mantine/core";
import { secondsToAudioDuration } from "../../utils/format/format";
import { percentageToValue, valueToPercentage } from "../../utils/conversion";
import useDimensions from "../../hooks/useDimensions";
import View from "../layout/View";

export default function PlaybackProgress(props) {
  const { current, total, onTrackClick, style, className } = props;
  const [progressWrapperRef, { width }] = useDimensions();
  const { classes, theme, cx } = useStyles();

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    onTrackClick?.(percentageToValue(valueToPercentage(x, width), total));
  };

  return (
    <View className={cx(classes.container, className)} style={style}>
      <Text className={classes.text} size="sm">
        {secondsToAudioDuration(current)}
      </Text>
      <Group
        ref={progressWrapperRef}
        className={classes.progressWrapper}
        onClick={handleClick}
      >
        <Progress
          size="xs"
          color={theme.other.accentColor}
          className={classes.progress}
          value={valueToPercentage(current, total)}
        />
      </Group>

      <Text className={classes.text} size="sm">
        {secondsToAudioDuration(total)}
      </Text>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    gap: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressWrapper: {
    flex: 1,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    cursor: "pointer",
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
  current: PropTypes.number,
  total: PropTypes.number,
  isDisabled: PropTypes.bool,
  onTrackClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

PlaybackProgress.defaultProps = {
  isDisabled: false,
  current: 0,
  total: 0,
  className: undefined,
  style: undefined,
};
