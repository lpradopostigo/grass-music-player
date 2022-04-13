import { createApi } from "@reduxjs/toolkit/dist/query/react";
import ipcQuery from "./ipcQuery";

const libraryApi = createApi({
  reducerPath: "library",
  baseQuery: ipcQuery({ baseHandler: "library" }),
  tagTypes: ["library"],
  endpoints: (builder) => ({
    getReleases: builder.query({
      query: () => ({ handler: "get-releases" }),
      providesTags: ["library"],
    }),
    getRelease: builder.query({
      query: (id) => ({ handler: "get-release", args: [id] }),
      providesTags: ["library"],
    }),
    getReleaseTracks: builder.query({
      query: (id) => ({ handler: "get-release-tracks", args: [id] }),
      providesTags: ["library"],
    }),
    scan: builder.mutation({
      query: () => ({ handler: "scan" }),
      invalidatesTags: ["library"],
    }),
  }),
});

export const {
  useGetReleasesQuery,
  useGetReleaseQuery,
  useGetReleaseTracksQuery,
  useScanMutation,
} = libraryApi;

export default libraryApi;
