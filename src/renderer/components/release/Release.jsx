import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Anchor, createStyles, Skeleton, Stack, Text } from "@mantine/core";
import { sizes } from "../release-picture/ReleasePicture";

const ReleasePicture = React.lazy(() =>
  import("../release-picture/ReleasePicture")
);

export default function Release(props) {
  const { size, data, style, className } = props;
  const { classes, theme, cx } = useStyles();

  return (
    <Anchor
      underline={false}
      component={Link}
      to={`/library/${data.id}`}
      state={data}
      style={style}
      className={cx(classes.wrapper, className)}
    >
      <Stack spacing={theme.spacing.sm}>
        <Suspense
          fallback={
            <Skeleton height={sizes.md.height} width={sizes.md.width} />
          }
        >
          <ReleasePicture data={data} size={size} />
        </Suspense>

        <Stack spacing={0}>
          <Text lineClamp={2} color={theme.black} size="md" weight={600}>
            {data.title}
          </Text>
          <Text lineClamp={1} size="xs" color="dimmed">
            {data.artist}
          </Text>
        </Stack>
      </Stack>
    </Anchor>
  );
}

Release.defaultProps = {
  data: {
    picture: null,
  },
  className: undefined,
  size: "md",
  style: undefined,
};

Release.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    picture: PropTypes.instanceOf(Uint8Array),
    id: PropTypes.number.isRequired,
  }),

  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  style: PropTypes.any,
};

const useStyles = createStyles(() => ({
  wrapper: {
    width: "min-content",
    height: "min-content",
  },
}));
