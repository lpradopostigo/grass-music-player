import React from "react";
import { createStyles, Text } from "@mantine/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import View from "../layout/View";

export default function NavigationButton(props) {
  const { active, icon, children, to } = props;
  const { classes, theme } = useStyles({ active });

  return (
    <Link to={to} className={classes.wrapper}>
      <View className={classes.contentContainer}>
        {icon}
        <Text size="xs" weight={active ? 600 : 500} ml={theme.spacing.md}>
          {children}
        </Text>
      </View>
    </Link>
  );
}

NavigationButton.defaultProps = {
  active: false,
  icon: undefined,
};

NavigationButton.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.element,
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

const useStyles = createStyles((theme, { active }) => ({
  spaceFiller: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },

  activeIndicator: {
    height: "100%",
    width: 3,
    backgroundColor: theme.other.accentColor,
  },

  wrapper: {
    width: "100%",
  },

  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  contentContainer: {
    alignItems: "center",
    flexDirection: "row",
    color: active ? theme.black : theme.other.textSecondary,
  },
}));
