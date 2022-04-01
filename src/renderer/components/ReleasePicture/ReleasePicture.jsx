import React from "react";

import PropTypes from "prop-types";
import { Image, createStyles } from "@mantine/core";
import { IoMusicalNotes } from "react-icons/io5";
import parsePictureSrc from "../../utils/parsePictureSrc";
import View from "../layout/View";

export default function ReleasePicture({ data, size, className }) {
  const { classes, cx } = useStyles({ size });

  const pictureAlt = `${data.title} - ${data.artist} release picture`;
  const pictureSrc = parsePictureSrc(data.picture);

  return (
    <Image
      fit="contain"
      src={pictureSrc}
      alt={pictureAlt}
      classNames={{
        root: cx(classes.container, className),
        placeholder: classes.placeholder,
      }}
      withPlaceholder
      placeholder={
        <View align="center" justify="center" className={classes.placeholder}>
          <IoMusicalNotes />
        </View>
      }
    />
  );
}

const sizes = {
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

const useStyles = createStyles((theme, { size }) => {
  const { width, height } = sizes[size];

  return {
    container: {
      overflow: "hidden",
      borderRadius: theme.radius[size],
      width,
      height,
      maxWidth: width,
      maxHeight: height,
      minHeight: height,
      minWidth: width,
    },

    placeholder: {
      height,
      width,
    },
  };
});
