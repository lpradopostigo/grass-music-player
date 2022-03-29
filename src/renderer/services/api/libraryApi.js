import { createApi } from "@reduxjs/toolkit/dist/query/react";
import ipcQuery from "./ipcQuery";

const libraryApi = createApi({
  reducerPath: "library",
  baseQuery: ipcQuery({ baseHandler: "library" }),
  endpoints: (builder) => ({
    getReleases: builder.query({ query: () => ({ handler: "get-releases" }) }),
    getRelease: builder.query({
      query: (id) => ({ handler: "get-release", args: [id] }),
    }),
    getReleaseTracks: builder.query({
      query: (id) => ({ handler: "get-release-tracks", args: [id] }),
    }),
  }),
});

export const {
  useGetReleasesQuery,
  useGetReleaseQuery,
  useGetReleaseTracksQuery,
} = libraryApi;

export default libraryApi;
