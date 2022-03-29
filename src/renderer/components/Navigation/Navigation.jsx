import React from "react";
import { createStyles } from "@mantine/core";
import NavigationButton from "../NavigationButton";
import View from "../layout/View";
import { IoDisc, IoSettings } from "react-icons/io5";

export default function Navigation() {
  const { classes, theme } = useStyles();
  return (
    <View
      className={classes.container}
      height="100%"
      spacing={theme.spacing.xs}
    >
      <NavigationButton active icon={<IoDisc />} to={"/Library"}>
        Library
      </NavigationButton>

      <NavigationButton icon={<IoSettings />} to={"/Library"}>
        Preferences
      </NavigationButton>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    padding: `${theme.spacing.md}px 0`,
    width: 160,
  },
}));

Navigation.propTypes = {};
Navigation.defaultProps = {};
