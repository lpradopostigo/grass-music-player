import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { createStyles, Text } from "@mantine/core";
import ReleasePicture from "../ReleasePicture";
import View from "../layout/View";

export default function Release(props) {
  const { size, data } = props;

  const { classes, theme } = useStyles();

  return (
    <Link to="/Release" state={data} className={classes.wrapper}>
      <View className={classes.container} spacing={theme.spacing.md}>
        <ReleasePicture data={data} size={size} />

        <View>
          <Text size="sm" weight={600}>
            {data.title}
          </Text>
          <Text size="xs" color="dimmed">
            {data.artist}
          </Text>
        </View>
      </View>
    </Link>
  );
}

Release.defaultProps = {
  data: {
    picture: null,
  },
  className: undefined,
  size: "md",
};

Release.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    picture: PropTypes.instanceOf(Uint8Array),
  }),

  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

const useStyles = createStyles(() => ({
  container: {
    width: "min-content",
    height: "min-content",
  },

  wrapper: {
    width: "min-content",
    height: "min-content",
  },
}));
