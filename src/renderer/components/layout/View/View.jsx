import React from "react";
import { createStyles } from "@mantine/core";
import PropTypes from "prop-types";

export default function View(props) {
  const { className, direction, align, justify, height, spacing, ...other } =
    props;
  const { classes, cx } = useStyles({
    direction,
    align,
    justify,
    height,
    spacing,
  });
  return <div className={cx(classes.container, className)} {...other} />;
}

View.defaultProps = {
  direction: "column",
  align: "flex-start",
  justify: "flex-start",
  className: undefined,
  height: undefined,
  spacing: undefined,
};

View.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  align: PropTypes.oneOf(["center", "flex-start", "flex-end", "stretch"]),
  justify: PropTypes.oneOf([
    "center",
    "flex-start",
    "flex-end",
    "stretch",
    "space-between",
    "space-around",
    "space-evenly",
  ]),
  direction: PropTypes.oneOf(["column", "row"]),
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const useStyles = createStyles(
  (theme, { direction, align, justify, height, spacing }) => ({
    container: {
      display: "flex",
      alignItems: align,
      justifyContent: justify,
      flexDirection: direction,
      height,
      gap: spacing,
      width: "100%",
    },
  })
);
