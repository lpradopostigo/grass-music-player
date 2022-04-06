import React from "react";
import {
  Button,
  createStyles,
  Group,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import usePreferences from "../../hooks/usePreferences";
import { useOpenPathSelectorMutation } from "../../services/api/preferencesApi";

export default function Preferences() {
  const { preferences, setPreference } = usePreferences();
  const [openPathSelector] = useOpenPathSelectorMutation();
  const { classes, theme } = useStyles();
  return (
    <Stack className={classes.container} p={theme.other.spacing.safeView}>
      <Title order={1}>Preferences</Title>

      <Group spacing={theme.spacing.md} align="flex-end">
        <TextInput
          label="Library path"
          value={preferences.libraryPath ?? ""}
          onChange={(event) =>
            setPreference({
              key: "libraryPath",
              value: event.currentTarget.value,
            })
          }
        />

        <Button
          onClick={async () => {
            const { data: path } = await openPathSelector();
            if (path) {
              setPreference({ key: "libraryPath", value: path });
            }
          }}
        >
          Browse folder
        </Button>
      </Group>

      <Select
        label="Select theme"
        data={["blue", "red", "green"]}
        defaultValue="green"
      />
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.white,
    flexGrow: 1,
  },
}));

Preferences.propTypes = {};
Preferences.defaultProps = {};
