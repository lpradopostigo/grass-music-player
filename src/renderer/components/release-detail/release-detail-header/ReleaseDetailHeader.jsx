import React, { useMemo } from "react";
import { Button, createStyles, Group, Text } from "@mantine/core";
import { IoPlayCircle } from "react-icons/io5";
import PropTypes from "prop-types";
import parsePictureSrc from "../../../utils/parsePictureSrc";
import Header from "../../header/Header";

const ReleaseDetailHeader = React.memo((props) => {
  const {
    data: { artist, picture, title, year },
    onPlayButtonClick,
    className,
    style,
  } = props;

  const pictureSrc = useMemo(() => parsePictureSrc(picture), [props.data]);
  const { classes, theme, cx } = useStyles({
    pictureSrc,
  });

  return (
    <Header
      style={style}
      title={title}
      className={cx(classes.container, className)}
    >
      <Group align="center" spacing="xs" mt={theme.spacing.md}>
        <Text weight={500}>{year}</Text>

        <Text weight={600} size="lg">
          {artist}
        </Text>
      </Group>
      <Button
        mt={theme.other.spacing.view}
        compact
        onClick={onPlayButtonClick}
        leftIcon={<IoPlayCircle size={theme.fontSizes.lg} />}
      >
        Play
      </Button>
    </Header>
  );
});

ReleaseDetailHeader.defaultProps = {
  className: undefined,
  style: undefined,
};

ReleaseDetailHeader.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    picture: PropTypes.instanceOf(Uint8Array),
  }).isRequired,
  onPlayButtonClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.any,
};

const useStyles = createStyles((theme, { pictureSrc }) => ({
  container: {
    color: theme.white,
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backgroundImage: `url(${pictureSrc})`,
    backgroundSize: "cover",
    backgroundBlendMode: "overlay",
    backgroundPosition: "center",
  },
}));

export default ReleaseDetailHeader;
