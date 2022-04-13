import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { createStyles, Center, Skeleton } from "@mantine/core";
import { IoMusicalNotes } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import parsePictureSrc from "../../utils/parsePictureSrc";

export default function ReleasePicture(props) {
  const { data, size, className } = props;
  const { classes, cx } = useStyles({ size });

  if (!data.picture) {
    return (
      <Center className={classes.container}>
        <IoMusicalNotes size={sizes[size].height / 4} />
      </Center>
    );
  }

  const pictureAlt = `${data.title} by ${data.artist} release`;
  const pictureSrc = useMemo(() => parsePictureSrc(data.picture), [data]);

  return (
    <LazyLoadImage
      effect="opacity"
      placeholder={
        <Skeleton height={sizes[size].height} width={sizes[size].width} />
      }
      fit="contain"
      src={pictureSrc}
      alt={pictureAlt}
      height={sizes[size].height}
      width={sizes[size].width}
      className={cx(classes.container, className)}
    />
  );
}

export const sizes = {
  sm: {
    width: 56,
    height: 56,
  },
  md: {
    width: 144,
    height: 144,
  },
  lg: {
    width: 176,
    height: 176,
  },
};

ReleasePicture.defaultProps = {
  data: {
    picture: null,
  },
  size: "md",
  className: null,
  style: null,
};

ReleasePicture.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    picture: PropTypes.oneOfType([
      PropTypes.instanceOf(Uint8Array),
      PropTypes.string,
    ]),
  }),

  size: PropTypes.oneOf(["lg", "md", "sm"]),
  className: PropTypes.string,
  style: PropTypes.object,
};

const useStyles = createStyles((theme, { size }) => ({
  container: {
    overflow: "hidden",
    borderRadius: theme.radius[size],
    boxShadow: theme.shadows[size],
    height: sizes[size].height,
    width: sizes[size].width,
    color: theme.other.accentColor,
  },
}));
