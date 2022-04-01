// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, dialog } = require("electron");
const persistentStorage = require("../services/persistentStorage");

ipcMain.handle("preferences:get-value", (_, key, defaultValue) =>
  persistentStorage.getValue(key, defaultValue)
);

ipcMain.handle("preferences:set-value", (_, key, value) =>
  persistentStorage.setValue(key, value)
);

ipcMain.handle("preferences:open-path-selector", async () => {
  const paths = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  });

  return paths.filePaths[0];
});
