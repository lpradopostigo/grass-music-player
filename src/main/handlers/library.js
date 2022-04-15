// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");

ipcMain.handle("library:get-releases", () => {
  const database = require("../services/database");
  return database.getReleases();
});

ipcMain.handle("library:get-release", (_, id) => {
  const database = require("../services/database");
  return database.getRelease(id);
});

ipcMain.handle("library:get-release-tracks", async (_, releaseId) => {
  const database = require("../services/database");
  const tracks = await database.getReleaseTracks(releaseId);
  return tracks.map((track) => {
    const { filePath, ...rest } = track;
    return rest;
  });
});

ipcMain.handle("library:scan", () => {
  const scanner = require("../services/scanner");
  return scanner.scan();
});
