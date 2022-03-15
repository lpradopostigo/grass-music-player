import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Text, useMantineTheme } from "@mantine/core";
import ReleasePicture from "../ReleasePicture";
import View from "../layout/View";

export default function Release({ data }) {
  const { title, artist } = data;
  const theme = useMantineTheme();

  return (
    <Link to="/Release" state={data}>
      <View spacing={theme.spacing.xs}>
        <ReleasePicture data={data} size="lg" />

        <View>
          <Text size="md" weight="500">
            {title}
          </Text>
          <Text size="sm" weight="400" color={theme.colors.gray[6]}>
            {artist}
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
};

Release.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    picture: PropTypes.instanceOf(Uint8Array),
  }),

  className: PropTypes.string,
};
