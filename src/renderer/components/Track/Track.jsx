import React from "react";
import { Text, createStyles } from "@mantine/core";
import PropTypes from "prop-types";
import { secondsToAudioDuration } from "../../utils/format/format";

export default function Track(props) {
  const { data, onClick } = props;
  const { classes, theme } = useStyles(props);

  return (
    <div onClick={onClick} className={classes.container}>
      <div className={classes.trackAndTitleWrapper}>
        <Text align="right" size="sm" className={classes.text}>
          {data.trackNumber}
        </Text>

        <Text
          size="md"
          weight="500"
          lineClamp={1}
          className={classes.text}
          ml={theme.spacing.md}
        >
          {data.title}
        </Text>
      </div>

      <div className={classes.artistAndDurationWrapper}>
        <Text lineClamp={1} size="sm" className={classes.text}>
          {data.artist}
        </Text>

        <Text size="sm" align="right" className={classes.text}>
          {secondsToAudioDuration(data.duration)}
        </Text>
      </div>
    </div>
  );
}

const useStyles = createStyles((theme, { active }) => ({
  text: {
    lineHeight: "normal",
  },

  container: {
    backgroundColor: active ? theme.colors.gray[0] : "transparent",
    borderRadius: active ? theme.radius.md : 0,
    padding: theme.spacing.xs,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
  },

  trackAndTitleWrapper: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  artistAndDurationWrapper: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
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
