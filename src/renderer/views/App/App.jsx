import React from "react";
import PropTypes from "prop-types";
import { createStyles } from "@mantine/core";

export default function App(props) {
  const { children, navigation, player } = props;
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.contentAndNavigationWrapper}>
        <div className={classes.navigationContainer}>{navigation}</div>
        <main className={classes.contentContainer}>{children}</main>
      </div>
      <div className={classes.playerContainer}>{player}</div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  navigation: PropTypes.element,
  player: PropTypes.element,
};

App.defaultProps = {
  navigation: undefined,
  player: undefined,
};

const useStyles = createStyles((theme) => ({
  container: {
    minHeight: "100vh",
    maxHeight: "100vh",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    maxWidth: "100vw",
  },

  contentAndNavigationWrapper: {
    flex: "1 0 0",
    display: "flex",
    minHeight: 0,
  },

  contentContainer: {
    flex: 1,
    overflow: "hidden",
  },

  navigationContainer: {
    borderRight: `${theme.other.borderSize}px solid ${theme.other.borderColor}`,
  },

  playerContainer: {
    borderTop: `${theme.other.borderSize}px solid ${theme.other.borderColor}`,
  },
}));
