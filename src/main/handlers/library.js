// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const {
  getRelease,
  getAllReleases,
  getReleaseTracks,
} = require("../services/store");

ipcMain.handle("library:getAllReleases", () => getAllReleases());

ipcMain.handle("library:getRelease", (event, releaseId) =>
  getRelease(releaseId)
);

ipcMain.handle("library:getReleaseTracks", (event, releaseId) =>
  getReleaseTracks(releaseId)
);
