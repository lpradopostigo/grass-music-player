import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { createStyles, Text, useMantineTheme } from "@mantine/core";
import ReleasePicture from "../ReleasePicture";
import View from "../layout/View";

export default function Release(props) {
  const { size, data } = props;

  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Link to="/Release" state={data} className={classes.wrapper}>
      <View className={classes.container} spacing={theme.spacing.xs}>
        <ReleasePicture data={data} size={size} />

        <View>
          <Text size="md" weight="500">
            {data.title}
          </Text>
          <Text size="sm" weight="400" color={theme.colors.gray[6]}>
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
