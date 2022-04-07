import React from "react";
import { createStyles, Stack } from "@mantine/core";
import { IoAlbums, IoSettings } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import NavigationButton from "../NavigationButton";
import { navigationWidth } from "../../services/constants";

export default function Navigation() {
  const { classes, theme } = useStyles();
  const { pathname } = useLocation();

  return (
    <Stack
      className={classes.container}
      p={theme.other.spacing.safeView}
      spacing={0}
    >
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
    </Stack>
  );
}

const useStyles = createStyles(() => ({
  container: {
    width: navigationWidth,
    backgroundColor: "rgb(255,255,255, 0.625)",
    backdropFilter: "blur(24px)",
    height: "100%",
  },
}));
