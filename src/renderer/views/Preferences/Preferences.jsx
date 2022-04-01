import React from "react";
import { Button, createStyles, TextInput, Title } from "@mantine/core";
import usePreferences from "../../hooks/usePreferences";
import { useOpenPathSelectorMutation } from "../../services/api/preferencesApi";
import View from "../../components/layout/View";

export default function Preferences() {
  const { preferences, setPreference } = usePreferences();
  const [openPathSelector] = useOpenPathSelectorMutation();
  const { classes, theme } = useStyles();
  return (
    <View className={classes.container}>
      <Title order={1}>Preferences</Title>

      <View direction="row" spacing={theme.spacing.md} align="flex-end">
        <TextInput
          label="Library path"
          value={preferences.libraryPath || ""}
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
      </View>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
}));

Preferences.propTypes = {};
Preferences.defaultProps = {};
