// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, BrowserWindow } = require("electron");

ipcMain.handle("window:close", async () => {
  BrowserWindow.getFocusedWindow().close();
});
