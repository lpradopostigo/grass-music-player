import React from "react";

import PropTypes from "prop-types";
import { Image, createStyles } from "@mantine/core";
import { BsMusicNoteBeamed } from "react-icons/bs";
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
          <BsMusicNoteBeamed />
        </View>
      }
    />
  );
}

const sizes = {
  sm: {
    width: 64,
    height: 64,
  },
  md: {
    width: 160,
    height: 160,
  },
  lg: {
    width: 192,
    height: 192,
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
      boxShadow: theme.shadows.md,
      borderRadius: theme.radius.md,
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
