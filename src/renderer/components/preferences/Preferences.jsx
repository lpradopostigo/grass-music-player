import React from "react";
import {
  Button,
  createStyles,
  Group,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import usePreferences from "../../hooks/usePreferences";
import { useOpenPathSelectorMutation } from "../../services/api/preferencesApi";
import Header from "../header/Header";
import { useScanMutation } from "../../services/api/libraryApi";

export default function Preferences() {
  const { preferences, setPreference } = usePreferences();
  const [openPathSelector] = useOpenPathSelectorMutation();
  const { classes, theme } = useStyles();
  const [scan, { isLoading }] = useScanMutation({
    fixedCacheKey: "scan",
  });
  return (
    <Stack className={classes.container} spacing={0}>
      <Header title="Preferences" />
      <Stack p={theme.other.spacing.view} pt={0}>
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

        <Button loading={isLoading} onClick={scan}>
          Rescan
        </Button>
      </Stack>
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.white,
    flexGrow: 1,
  },
}));
