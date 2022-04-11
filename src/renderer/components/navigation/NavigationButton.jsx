import React from "react";
import { Anchor, createStyles, Group, Text } from "@mantine/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function NavigationButton(props) {
  const { active, icon, children, to } = props;
  const { classes, theme } = useStyles({ active });

  return (
    <Anchor component={Link} to={to} p={theme.spacing.xs} underline={false}>
      <Group className={classes.contentContainer} spacing={theme.spacing.sm}>
        {icon}
        <Text size="sm" weight={active ? 600 : 500}>
          {children}
        </Text>
      </Group>
    </Anchor>
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
  contentContainer: {
    fontSize: theme.fontSizes.sm * 1.5,
    color: active ? theme.black : theme.other.textSecondary,
  },
}));
