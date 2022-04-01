import React from "react";
import PropTypes from "prop-types";
import { createStyles } from "@mantine/core";
import { useLocation } from "react-router-dom";
import TitleBar from "../../components/TitleBar";
import backgroundSrc from "../../../../assets/img/navigation-bg.jpg";

export default function App(props) {
  const { children, navigation, player } = props;
  const { classes, theme } = useStyles();
  const { pathname } = useLocation();

  return (
    <div className={classes.container}>
      <TitleBar color={pathname === "/Release" ? theme.white : theme.black} />
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
    overflow: "hidden",
    backgroundImage: `url(${backgroundSrc})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
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

  navigationContainer: {},
  playerContainer: {
    filter: `drop-shadow(0px 12px 8px ${theme.black})`,
  },
}));
