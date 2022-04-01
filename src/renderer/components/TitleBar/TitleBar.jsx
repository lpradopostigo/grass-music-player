import React from "react";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
} from "react-icons/vsc";
import { createStyles } from "@mantine/core";
import PropTypes from "prop-types";
import { titleBarButtonSize } from "../../services/constants";
import { useCloseMutation } from "../../services/api/windowApi";

export default function TitleBar(props) {
  const { color } = props;
  const { classes } = useStyles();
  const [close] = useCloseMutation();
  return (
    <div className={classes.container}>
      <div className={classes.iconWrapper}>
        <VscChromeMinimize color={color} size={16} />
      </div>

      <div className={classes.iconWrapper}>
        <VscChromeMaximize color={color} size={16} />
      </div>

      <div onClick={close} className={classes.iconWrapper}>
        <VscChromeClose color={color} size={16} />
      </div>
    </div>
  );
}

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    WebkitAppRegion: "drag",
    zIndex: 10,
  },
  iconWrapper: {
    height: titleBarButtonSize.height,
    width: titleBarButtonSize.width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    WebkitAppRegion: "no-drag",
  },
}));

TitleBar.propTypes = {
  color: PropTypes.string.isRequired,
};
