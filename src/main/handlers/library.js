// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const {
  getRelease,
  getReleases,
  getReleaseTracks,
} = require("../services/store");
const { scan } = require("../services/scanner");

ipcMain.handle("library:get-releases", getReleases);

ipcMain.handle("library:get-release", (_, releaseId) => getRelease(releaseId));

ipcMain.handle("library:get-release-tracks", async (_, releaseId) => {
  const tracks = await getReleaseTracks(releaseId);
  return tracks.map((track) => {
    const { filePath, ...rest } = track;
    return rest;
  });
});

ipcMain.handle("library:scan", scan);
