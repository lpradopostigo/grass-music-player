import React from "react";
import { createStyles } from "@mantine/core";
import { FiDisc, FiSettings } from "react-icons/fi";
import NavigationButton from "../NavigationButton";
import View from "../layout/View";

export default function Navigation() {
  const { classes, theme } = useStyles();
  return (
    <View
      className={classes.container}
      height="100%"
      spacing={theme.spacing.xs / 2}
    >
      <NavigationButton
        active
        icon={<FiDisc color={theme.other.accentColor} />}
      >
        Library
      </NavigationButton>

      <NavigationButton icon={<FiSettings color={theme.other.accentColor} />}>
        Preferences
      </NavigationButton>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.md,
    width: 200,
  },
}));

Navigation.propTypes = {};
Navigation.defaultProps = {};
