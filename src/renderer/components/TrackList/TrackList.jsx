import React from "react";
import PropTypes from "prop-types";
import { When } from "react-if";
import { Stack, Text, useMantineTheme } from "@mantine/core";

export default function TrackList({
  discNumber,
  showDiscNumber,
  children,
  className,
}) {
  const theme = useMantineTheme();
  return (
    <Stack spacing={theme.spacing.xs} className={className}>
      <When condition={showDiscNumber}>
        <Text ml="md" mb="xs" weight={600} size="xs" color="dimmed">
          Disc {discNumber}
        </Text>
      </When>

      {children}
    </Stack>
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
