import React from "react";
import { createStyles, Group, Text } from "@mantine/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function NavigationButton(props) {
  const { active, icon, children, to } = props;
  const { classes, theme } = useStyles({ active });

  return (
    <Link to={to} className={classes.container}>
      <Group className={classes.contentContainer}>
        {icon}
        <Text size="sm" weight={active ? 600 : 500} ml={theme.spacing.md}>
          {children}
        </Text>
      </Group>
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
  container: {
    width: "100%",
  },

  contentContainer: {
    color: active ? theme.black : theme.other.textSecondary,
  },
}));
