import React from "react";
import { createStyles, Text } from "@mantine/core";
import PropTypes from "prop-types";

export default function NavigationButton(props) {
  const { active, icon, children } = props;
  const { classes } = useStyles({ active });

  return (
    <div className={classes.container}>
      {icon}
      <Text size="sm" inline weight={500}>
        {children}
      </Text>
    </div>
  );
}

NavigationButton.defaultProps = {
  active: false,
  icon: undefined,
};

NavigationButton.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.element,
  children: PropTypes.element.isRequired,
};

const useStyles = createStyles((theme, { active }) => ({
  container: {
    display: "flex",
    gap: theme.spacing.sm,
    padding: `${theme.spacing.xs}px`,
    width: "100%",
    alignItems: "center",
    lineHeight: "normal",
    color: theme.other.textSecondary,
    backgroundColor: active ? theme.colors.gray[0] : "transparent",
    borderRadius: active ? theme.radius.md : 0,
  },
}));
