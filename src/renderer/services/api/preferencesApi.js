import { createApi } from "@reduxjs/toolkit/dist/query/react";
import ipcQuery from "./ipcQuery";

const preferencesApi = createApi({
  reducerPath: "preferences",
  baseQuery: ipcQuery({ baseHandler: "preferences" }),
  tagTypes: ["preferences"],
  endpoints: (builder) => ({
    getValue: builder.query({
      query: (key) => ({ handler: "get-value", args: [key] }),
      providesTags: ["preferences"],
    }),
    setValue: builder.mutation({
      query: ({ key, value }) => ({ handler: "set-value", args: [key, value] }),
      invalidatesTags: ["preferences"],
    }),
    openPathSelector: builder.mutation({
      query: () => ({ handler: "open-path-selector" }),
      invalidatesTags: ["preferences"],
    }),
  }),
});

export const {
  useGetValueQuery,
  useSetValueMutation,
  useOpenPathSelectorMutation,
} = preferencesApi;

export default preferencesApi;
