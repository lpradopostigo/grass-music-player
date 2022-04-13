import { createApi } from "@reduxjs/toolkit/dist/query/react";
import ipcQuery from "./ipcQuery";

const playerApi = createApi({
  reducerPath: "player",
  baseQuery: ipcQuery({ baseHandler: "player" }),
  tagTypes: ["player"],
  endpoints: (builder) => ({
    getState: builder.query({
      query: () => ({ handler: "get-state" }),
      providesTags: ["player"],
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let intervalId;
        try {
          await cacheDataLoaded;

          intervalId = setInterval(async () => {
            const { data } = await ipcQuery({ baseHandler: "player" })({
              handler: "get-state",
            });

            updateCachedData((draft) => {
              Object.assign(draft, data);
            });
          }, 1000);
        } catch {
          // this was intentional
        }

        await cacheEntryRemoved;
        clearInterval(intervalId);
      },
    }),
    play: builder.mutation({
      query: () => ({ handler: "play" }),
      invalidatesTags: ["player"],
    }),
    pause: builder.mutation({
      query: () => ({ handler: "pause" }),
      invalidatesTags: ["player"],
    }),
    skipToIndex: builder.mutation({
      query: (index) => ({
        handler: "skip-to-index",
        args: [index],
        invalidatesTags: ["player"],
      }),
    }),
    previous: builder.mutation({
      query: () => ({ handler: "previous" }),
      invalidatesTags: ["player"],
    }),
    next: builder.mutation({
      query: () => ({ handler: "next" }),
      invalidatesTags: ["player"],
    }),
    seek: builder.mutation({
      query: (position) => ({ handler: "seek", args: [position] }),
      invalidatesTags: ["player"],
    }),
    setPlaylist: builder.mutation({
      query: (tracks) => ({ handler: "set-playlist", args: [tracks] }),
      invalidatesTags: ["player"],
    }),
  }),
});

export const {
  useGetStateQuery,
  usePlayMutation,
  usePauseMutation,
  useSkipToIndexMutation,
  usePreviousMutation,
  useNextMutation,
  useSeekMutation,
  useSetPlaylistMutation,
} = playerApi;

export default playerApi;
