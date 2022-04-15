// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const database = require("../services/database");
const { scan } = require("../services/scanner");

ipcMain.handle("library:get-releases", database.getReleases);

ipcMain.handle("library:get-release", (_, id) => database.getRelease(id));

ipcMain.handle("library:get-release-tracks", async (_, releaseId) => {
  const tracks = await database.getReleaseTracks(releaseId);
  return tracks.map((track) => {
    const { filePath, ...rest } = track;
    return rest;
  });
});

ipcMain.handle("library:scan", scan);
