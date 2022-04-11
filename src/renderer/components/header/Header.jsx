import React from "react";
import { createStyles, Stack, Title } from "@mantine/core";
import PropTypes from "prop-types";

function Header(props) {
  const { className, style, children, title } = props;
  const { classes, theme, cx } = useStyles({});

  return (
    <Stack
      className={cx(classes.container, className)}
      spacing={0}
      align="flex-start"
      p={theme.other.spacing.safeView}
      style={style}
    >
      <Title order={1}>{title}</Title>

      {children}
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.white,
  },
}));

Header.propTypes = {
  className: PropTypes.string,
  style: PropTypes.any,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

Header.defaultProps = {
  className: undefined,
  style: undefined,
  children: undefined,
};

export default React.memo(Header);
