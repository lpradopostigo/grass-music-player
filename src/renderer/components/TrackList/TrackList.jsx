import React from "react";
import PropTypes from "prop-types";
import { When } from "react-if";
import { createStyles, Text } from "@mantine/core";

export default function TrackList({
  discNumber,
  showDiscNumber,
  children,
  className,
}) {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.container, className)}>
      <When condition={showDiscNumber}>
        <Text ml="sm" mb="xs" weight={600} size="sm" color="dimmed">
          Disc {discNumber}
        </Text>
      </When>

      {children}
    </div>
  );
}

TrackList.defaultProps = {
  showDiscNumber: false,
  discNumber: 1,
  className: undefined,
};

TrackList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  discNumber: PropTypes.number,
  showDiscNumber: PropTypes.bool,
  className: PropTypes.string,
};

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
  },
}));
