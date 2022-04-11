import React from "react";
import PropTypes from "prop-types";
import { createStyles, Group, Stack } from "@mantine/core";
import { useLocation } from "react-router-dom";
import TitleBar from "../title-bar/TitleBar";
import backgroundSrc from "../../../../assets/img/navigation-bg.jpg";

export default function App(props) {
  const { children, navigation, player } = props;
  const { classes, theme } = useStyles();
  const { pathname } = useLocation();

  return (
    <Stack className={classes.container} spacing={0}>
      <TitleBar
        color={pathname.startsWith("/library/") ? theme.white : theme.black}
      />

      <Group className={classes.contentAndNavigationWrapper} spacing={0} noWrap>
        <Stack className={classes.navigationContainer}>{navigation}</Stack>
        <main className={classes.contentContainer}>{children}</main>
      </Group>

      <Stack className={classes.playerContainer}>{player}</Stack>
    </Stack>
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
    display: "flex",
    alignSelf: "stretch",
    flexGrow: 1,
    overflow: "hidden",
  },

  navigationContainer: {
    alignSelf: "stretch",
  },

  playerContainer: {
    filter: `drop-shadow(0px 12px 8px ${theme.black})`,
  },
}));
