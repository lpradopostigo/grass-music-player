import React from "react";
import PropTypes from "prop-types";
import { createStyles, Group, Progress, Text } from "@mantine/core";
import { secondsToAudioDuration } from "../../utils/format/format";
import { percentageToValue, valueToPercentage } from "../../utils/conversion";
import useDimensions from "../../hooks/useDimensions";
import View from "../layout/View";

export default function PlaybackProgress(props) {
  const { data, onTrackClick, style, className } = props;
  const [progressWrapperRef, { width }] = useDimensions();
  const { classes, theme, cx } = useStyles();

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    onTrackClick?.(
      percentageToValue(valueToPercentage(x, width), data.duration)
    );
  };

  return (
    <View className={cx(classes.container, className)} style={style}>
      <View
        direction="row"
        justify="space-between"
        align="flex-end"
        width="100%"
      >
        <View>
          <Text weight={600}>{data.title}</Text>
          <Text color="dimmed" size="sm">
            {data.artist}
          </Text>
        </View>

        <View direction="row" align="flex-end" spacing={theme.spacing.sm}>
          <Text weight={500} size="sm">
            {secondsToAudioDuration(data.position)}
          </Text>
          <Text size="xs" color="dimmed">
            /
          </Text>
          <Text size="xs" color="dimmed">
            {secondsToAudioDuration(data.duration)}
          </Text>
        </View>
      </View>

      <View
        ref={progressWrapperRef}
        className={classes.progressWrapper}
        onClick={handleClick}
      >
        <Progress
          size="sm"
          color={theme.other.accentColor}
          className={classes.progress}
          value={valueToPercentage(data.position, data.duration)}
        />
      </View>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {},

  progressWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
    paddingTop: theme.spacing.sm,
    cursor: "pointer",
  },

  progress: {
    flex: "1 0 0",
  },
}));

PlaybackProgress.propTypes = {
  isDisabled: PropTypes.bool,
  onTrackClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  data: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    duration: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
  }).isRequired,
};

PlaybackProgress.defaultProps = {
  isDisabled: false,
  className: undefined,
  style: undefined,
};
