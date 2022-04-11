import React, { useMemo } from "react";
import { Button, createStyles, Group, Stack, Text, Title } from "@mantine/core";
import { IoPlayCircle } from "react-icons/io5";
import PropTypes from "prop-types";
import parsePictureSrc from "../../utils/parsePictureSrc";

const ReleaseHeader = React.memo((props) => {
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
    <Stack
      className={cx(classes.container, className)}
      spacing={theme.other.spacing.view}
      align="flex-start"
      p={theme.other.spacing.safeView}
      style={style}
    >
      <Stack>
        <Title order={1}>{title}</Title>

        <Group align="center" spacing="xs">
          <Text inline weight={500}>
            {year}
          </Text>

          <Text inline weight={600} size="lg">
            {artist}
          </Text>
        </Group>
      </Stack>

      <Button
        compact
        onClick={onPlayButtonClick}
        leftIcon={<IoPlayCircle size={theme.fontSizes.lg} />}
      >
        Play
      </Button>
    </Stack>
  );
});

ReleaseHeader.defaultProps = {
  className: undefined,
  style: undefined,
};

ReleaseHeader.propTypes = {
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

export default ReleaseHeader;
