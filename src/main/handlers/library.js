// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const { map, omit } = require("ramda");
const {
  getRelease,
  getReleases,
  getReleaseTracks,
} = require("../services/store");

ipcMain.handle("library:getReleases", () => getReleases());

ipcMain.handle("library:getRelease", (event, releaseId) =>
  getRelease(releaseId)
);

ipcMain.handle("library:getReleaseTracks", async (event, releaseId) => {
  const tracks = await getReleaseTracks(releaseId);
  return map(omit(["filePath"]), tracks);
});
