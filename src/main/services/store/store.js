const { createSlice, configureStore } = require("@reduxjs/toolkit");
const storage = require("electron-json-storage");
storage.setDataPath(__dirname);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    value: {},
  },
  reducers: {
    load: (state) => {
      state.value += 1;
    },
  },
});

export const { incremented } = settingsSlice.actions;

const store = configureStore({
  reducer: settingsSlice.reducer,
});

export default store;
