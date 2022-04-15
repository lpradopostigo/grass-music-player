// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow } = require("electron");
const path = require("path");
const log = require("loglevel");

log.setLevel("info");

require("./handlers/library");
require("./handlers/player");
require("./handlers/window");
require("./handlers/preferences");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
  });

  // eslint-disable-next-line no-undef
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(() => {
    if (process.env.NODE_ENV === "development") {
      mainWindow.webContents.openDevTools();
    }
  });
};

app.on("ready", () => {
  if (process.env.NODE_ENV === "development") {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer");
    installExtension(REACT_DEVELOPER_TOOLS).then(() => {
      log.info("chrome extensions successfully installed");
    });
  }
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
