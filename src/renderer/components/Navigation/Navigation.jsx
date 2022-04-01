import React from "react";
import { createStyles } from "@mantine/core";
import { IoAlbums, IoSettings } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import NavigationButton from "../NavigationButton";
import View from "../layout/View";
import { navigationWidth } from "../../services/constants";

export default function Navigation() {
  const { classes } = useStyles();
  const { pathname } = useLocation();
  return (
    <View className={classes.container} height="100%">
      <NavigationButton
        active={pathname === "/Library"}
        icon={<IoAlbums />}
        to="/Library"
      >
        Library
      </NavigationButton>

      <NavigationButton
        active={pathname === "/Preferences"}
        icon={<IoSettings />}
        to="/Preferences"
      >
        Preferences
      </NavigationButton>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.other.spacing.view,
    width: navigationWidth,
    backgroundColor: theme.other.colors.accentSecondary,
    gap: theme.spacing.xl,
  },
}));

Navigation.propTypes = {};
Navigation.defaultProps = {};
