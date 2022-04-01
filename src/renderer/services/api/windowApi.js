import { createApi } from "@reduxjs/toolkit/dist/query/react";
import ipcQuery from "./ipcQuery";

const windowApi = createApi({
  reducerPath: "window",
  baseQuery: ipcQuery({ baseHandler: "window" }),
  endpoints: (builder) => ({
    close: builder.mutation({ query: () => ({ handler: "close" }) }),
  }),
});

export const { useCloseMutation } = windowApi;
export default windowApi;
