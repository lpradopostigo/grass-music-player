import React from "react";
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { styled } from "@stitches/react";
import sizes from "./sizes";
import DefaultPicture from "./DefaultPicture/DefaultPicture";

const Image = styled(LazyLoadImage, {
  overflow: "hidden",
  borderRadius: 5,
  height: 200,
  width: 200,
});

function ReleasePicture(props) {
  const { data, size, className } = props;
  const pictureAlt = `${data.title} by ${data.artist} release`;

  return data.picture ? (
    <Image
      effect="opacity"
      fit="contain"
      src={data.picture}
      alt={pictureAlt}
      height={200}
      width={200}
    />
  ) : (
    <DefaultPicture size={size} />
  );
}

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
    id: PropTypes.number.isRequired,
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

export default React.memo(
  ReleasePicture,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
);
