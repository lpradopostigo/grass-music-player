// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");

ipcMain.handle("preferences:get-value", (_, key, defaultValue) => {
  const { getValue } = require("../services/persistentStorage");
  return getValue(key, defaultValue);
});

ipcMain.handle("preferences:set-value", (_, key, value) => {
  const { setValue } = require("../services/persistentStorage");
  return setValue(key, value);
});

ipcMain.handle("preferences:open-path-selector", async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { dialog } = require("electron");
  const paths = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  });

  return paths.filePaths[0];
});
