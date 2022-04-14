// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, BrowserWindow } = require("electron");

ipcMain.handle("window:close", async () =>
  BrowserWindow.getFocusedWindow().close()
);

ipcMain.handle("window:minimize", async () =>
  BrowserWindow.getFocusedWindow().minimize()
);

ipcMain.handle("window:maximize", async () =>
  BrowserWindow.getFocusedWindow().maximize()
);

ipcMain.handle("window:unmaximize", async () =>
  BrowserWindow.getFocusedWindow().unmaximize()
);

ipcMain.handle("window:restore", async () =>
  BrowserWindow.getFocusedWindow().restore()
);

ipcMain.handle("window:get-state", async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  const isMaximized = focusedWindow.isMaximized();
  const isMinimized = focusedWindow.isMinimized();
  const isNormal = focusedWindow.isNormal();

  if (isNormal) {
    return "normal";
  }
  if (isMinimized) {
    return "minimized";
  }
  if (isMaximized) {
    return "maximized";
  }
  return "";
});
