import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { createStyles, Stack, Text } from "@mantine/core";
import ReleasePicture from "../ReleasePicture";

export default function Release(props) {
  const { size, data } = props;
  const { classes, theme } = useStyles();

  return (
    <Link to="/Release" state={data} className={classes.wrapper}>
      <Stack spacing={theme.spacing.sm}>
        <ReleasePicture data={data} size={size} />

        <Stack spacing={0}>
          <Text size="md" weight={600}>
            {data.title}
          </Text>
          <Text size="xs" color="dimmed">
            {data.artist}
          </Text>
        </Stack>
      </Stack>
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
  wrapper: {
    width: "min-content",
    height: "min-content",
  },
}));
