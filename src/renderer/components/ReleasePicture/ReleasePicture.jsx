import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Image, createStyles, Center } from "@mantine/core";
import { IoMusicalNotes } from "react-icons/io5";
import parsePictureSrc from "../../utils/parsePictureSrc";

export default function ReleasePicture(props) {
  const { data, size, className } = props;
  const { classes, cx } = useStyles({ size });

  const pictureAlt = `${data.title} - ${data.artist} release`;
  const pictureSrc = useMemo(() => parsePictureSrc(data.picture), [data]);

  return (
    <Image
      imageProps={{ loading: "lazy" }}
      fit="contain"
      src={pictureSrc}
      alt={pictureAlt}
      height={sizes[size].height}
      width={sizes[size].width}
      className={cx(classes.container, className)}
      withPlaceholder
      placeholder={
        <Center>
          <IoMusicalNotes />
        </Center>
      }
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
    picture: undefined,
    title: "",
    artist: "",
  },
  size: "md",
  className: undefined,
};

ReleasePicture.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    picture: PropTypes.oneOfType([
      PropTypes.instanceOf(Uint8Array),
      PropTypes.string,
    ]),
  }),

  size: PropTypes.oneOf(["lg", "md", "sm"]),
  className: PropTypes.string,
};

const useStyles = createStyles((theme, { size }) => ({
  container: {
    overflow: "hidden",
    borderRadius: theme.radius[size],
    boxShadow: theme.shadows[size],
  },
}));
