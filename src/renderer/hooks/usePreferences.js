import {
  useGetValueQuery,
  useSetValueMutation,
} from "../services/api/preferencesApi";

export default function usePreferences() {
  const { data: libraryPath } = useGetValueQuery("libraryPath");
  const [setValue] = useSetValueMutation();

  return {
    preferences: { libraryPath },
    setPreference: setValue,
    setPreferences: async (obj) =>
      Promise.all(
        Object.entries(obj).map(async ([key, value]) =>
          setValue({ key, value })
        )
      ),
  };
}
