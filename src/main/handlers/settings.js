// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, dialog } = require("electron");
const persistentStorage = require("../services/persistentStorage");

ipcMain.handle("settings:getValue", (_, key, defaultValue) =>
  persistentStorage.getValue(key, defaultValue)
);

ipcMain.handle("settings:setValue", (_, key, value) =>
  persistentStorage.setValue(key, value)
);

ipcMain.handle("settings:openPathSelector", async () => {
  const paths = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
  });

  return paths.filePaths[0];
});
