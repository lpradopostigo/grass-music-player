import React from "react";
import { createStyles, Text } from "@mantine/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { When } from "react-if";

export default function NavigationButton(props) {
  const { active, icon, children, to } = props;
  const { classes, theme } = useStyles({ active });

  return (
    <Link to={to} className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.spaceFiller}>
          <When condition={active}>
            <div className={classes.activeIndicator} />
          </When>
        </div>

        <div className={classes.contentContainer}>
          {icon}
          <Text size="sm" weight={500} ml={theme.spacing.sm}>
            {children}
          </Text>
        </div>
        <div className={classes.spaceFiller} />
      </div>
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
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    lineHeight: "normal",
    width: 100,
    color: active ? theme.black : theme.other.textSecondary,
    padding: theme.spacing.xs / 4,
  },
}));
