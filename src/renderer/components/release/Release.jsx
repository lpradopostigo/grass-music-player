import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { createStyles, Skeleton, Stack, Text } from "@mantine/core";
import { sizes } from "../release-picture/ReleasePicture";

const ReleasePicture = React.lazy(() =>
  import("../release-picture/ReleasePicture")
);

export default function Release(props) {
  const { size, data, style, className } = props;
  const { classes, theme, cx } = useStyles({ size });

  return (
    <Stack
      className={cx(classes.container, className)}
      spacing={theme.spacing.sm}
      style={style}
    >
      <Suspense
        fallback={<Skeleton height={sizes.md.height} width={sizes.md.width} />}
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
  );
}

Release.defaultProps = {
  data: {
    picture: null,
  },
  className: null,
  size: "md",
  style: null,
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
  style: PropTypes.object,
};

const useStyles = createStyles((theme, { size }) => ({
  container: {
    width: sizes[size].width,
  },
}));
