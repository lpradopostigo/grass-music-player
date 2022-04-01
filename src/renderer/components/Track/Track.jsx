import React from "react";
import { Text, createStyles } from "@mantine/core";
import PropTypes from "prop-types";
import { secondsToAudioDuration } from "../../utils/format/format";
import View from "../layout/View";

export default function Track(props) {
  const { data, onClick, active } = props;
  const { classes, theme } = useStyles({ active });

  return (
    <View onClick={onClick} className={classes.container}>
      <View className={classes.wrapper} spacing={theme.spacing.lg}>
        <Text size="xs" color="dimmed">
          {data.trackNumber}
        </Text>

        <View>
          <Text size="sm" weight={600} lineClamp={1}>
            {data.title}
          </Text>
          <Text color="dimmed" lineClamp={1} size="xs">
            {data.artist}
          </Text>
        </View>
      </View>

      <Text size="xs" align="right" color="dimmed">
        {secondsToAudioDuration(data.duration)}
      </Text>
    </View>
  );
}

const useStyles = createStyles((theme, { active }) => ({
  container: {
    backgroundColor: active ? theme.colors.gray[0] : "transparent",
    borderRadius: active ? theme.radius.md : 0,
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
}));

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
