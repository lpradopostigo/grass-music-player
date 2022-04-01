import React from "react";
import { createStyles } from "@mantine/core";
import PropTypes from "prop-types";

const View = React.forwardRef((props, ref) => {
  const {
    className,
    direction,
    align,
    justify,
    height,
    spacing,
    width,
    style,
    grow,
    ...other
  } = props;
  const { classes, cx } = useStyles({
    direction,
    align,
    justify,
    height,
    width,
    spacing,
    grow,
  });
  return (
    <div
      style={style}
      className={cx(classes.container, className)}
      {...other}
      ref={ref}
    />
  );
});

View.defaultProps = {
  direction: "column",
  align: "flex-start",
  justify: "flex-start",
  className: undefined,
  height: undefined,
  width: undefined,
  spacing: undefined,
  style: undefined,
  grow: false,
  ref: undefined,
};

View.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
  style: PropTypes.object,
  grow: PropTypes.bool,
  ref: PropTypes.any,
};

const useStyles = createStyles(
  (theme, { direction, align, justify, height, spacing, width, grow }) => ({
    container: {
      display: "flex",
      alignItems: align,
      justifyContent: justify,
      flexDirection: direction,
      height,
      width,
      gap: spacing,
      flexGrow: grow ? 1 : 0,
    },
  })
);

export default View;
