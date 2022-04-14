import { createApi } from "@reduxjs/toolkit/dist/query/react";
import ipcQuery from "./ipcQuery";

const windowApi = createApi({
  reducerPath: "window",
  tagTypes: ["window"],
  baseQuery: ipcQuery({ baseHandler: "window" }),
  endpoints: (builder) => ({
    close: builder.mutation({
      query: () => ({ handler: "close" }),
      invalidatesTags: ["window"],
    }),
    minimize: builder.mutation({
      query: () => ({ handler: "minimize" }),
      invalidatesTags: ["window"],
    }),
    maximize: builder.mutation({
      query: () => ({ handler: "maximize" }),
      invalidatesTags: ["window"],
    }),
    unmaximize: builder.mutation({
      query: () => ({ handler: "unmaximize" }),
      invalidatesTags: ["window"],
    }),
    restore: builder.mutation({
      query: () => ({ handler: "restore" }),
      invalidatesTags: ["window"],
    }),
    getState: builder.query({
      query: () => ({ handler: "get-state" }),
      providesTags: ["window"],
    }),
  }),
});

export const {
  useCloseMutation,
  useMinimizeMutation,
  useMaximizeMutation,
  useUnmaximizeMutation,
  useRestoreMutation,
  useGetStateQuery,
} = windowApi;
export default windowApi;
