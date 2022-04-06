import React from "react";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
} from "react-icons/vsc";
import { Center, createStyles, Group, UnstyledButton } from "@mantine/core";
import PropTypes from "prop-types";
import { titleBarButtonSize } from "../../services/constants";
import { useCloseMutation } from "../../services/api/windowApi";

const ICON_SIZE = 16;

export default function TitleBar(props) {
  const { color } = props;
  const { classes, cx } = useStyles({ color });
  const [close] = useCloseMutation();
  return (
    <Group className={classes.container} spacing={0}>
      <UnstyledButton className={classes.button}>
        <Center>
          <VscChromeMinimize size={ICON_SIZE} />
        </Center>
      </UnstyledButton>

      <UnstyledButton className={classes.button}>
        <Center>
          <VscChromeMaximize size={ICON_SIZE} />
        </Center>
      </UnstyledButton>

      <UnstyledButton
        onClick={close}
        className={cx(classes.button, classes.buttonClose)}
      >
        <Center>
          <VscChromeClose size={ICON_SIZE} />
        </Center>
      </UnstyledButton>
    </Group>
  );
}

TitleBar.propTypes = {
  color: PropTypes.string.isRequired,
};

const useStyles = createStyles((theme, { color }) => ({
  container: {
    justifyContent: "flex-end",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    WebkitAppRegion: "drag",
    zIndex: 10,
  },

  button: {
    ":hover": {
      backgroundColor: theme.other.colors.accentSecondary,
      color: theme.black,
    },
    height: titleBarButtonSize.height,
    width: titleBarButtonSize.width,
    WebkitAppRegion: "no-drag",
    color,
  },

  buttonClose: {
    ":hover": {
      backgroundColor: theme.colors.red[6],
      color: theme.white,
    },
  },
}));
