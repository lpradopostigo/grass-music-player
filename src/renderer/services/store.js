import { configureStore } from "@reduxjs/toolkit";
import playerApi from "./api/playerApi";
import libraryApi from "./api/libraryApi";
import preferencesApi from "./api/preferencesApi";
import windowApi from "./api/windowApi";

export default configureStore({
  reducer: {
    [playerApi.reducerPath]: playerApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
    [preferencesApi.reducerPath]: preferencesApi.reducer,
    [windowApi.reducerPath]: windowApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(playerApi.middleware)
      .concat(libraryApi.middleware)
      .concat(windowApi.middleware)
      .concat(preferencesApi.middleware),
});
