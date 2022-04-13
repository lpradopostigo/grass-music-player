import React from "react";
import PropTypes from "prop-types";
import { ActionIcon, Center, createStyles, Group } from "@mantine/core";
import {
  IoPauseCircle,
  IoPlayCircle,
  IoPlaySkipBackCircle,
  IoPlaySkipForwardCircle,
} from "react-icons/io5";
import { navigationWidth } from "../../../services/constants";
import usePlayerControls from "../../../hooks/usePlayerControls";

function PlayerControls(props) {
  const controls = usePlayerControls();
  const { classes, theme } = useStyles();
  const { playing } = props;

  return (
    <Center className={classes.container}>
      <Group>
        <ActionIcon onClick={controls.previous}>
          <IoPlaySkipBackCircle size={40} color={theme.other.accentColor} />
        </ActionIcon>

        {playing ? (
          <ActionIcon size={48} onClick={controls.pause}>
            <IoPauseCircle color={theme.other.accentColor} size={48} />
          </ActionIcon>
        ) : (
          <ActionIcon size={48} onClick={controls.play}>
            <IoPlayCircle color={theme.other.accentColor} size={48} />
          </ActionIcon>
        )}

        <ActionIcon onClick={controls.next}>
          <IoPlaySkipForwardCircle size={40} color={theme.other.accentColor} />
        </ActionIcon>
      </Group>
    </Center>
  );
}

PlayerControls.defaultProps = {
  playing: false,
};

PlayerControls.propTypes = {
  playing: PropTypes.bool,
};

const useStyles = createStyles(() => ({
  container: {
    flexBasis: navigationWidth,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(24px)",
  },
}));

export default React.memo(PlayerControls);
