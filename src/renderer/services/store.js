import { configureStore } from "@reduxjs/toolkit";
import playerApi from "./api/playerApi";
import libraryApi from "./api/libraryApi";

export default configureStore({
  reducer: {
    [playerApi.reducerPath]: playerApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(playerApi.middleware)
      .concat(libraryApi.middleware),
});
