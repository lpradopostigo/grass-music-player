/** @typedef {import('../../shared/types').DatabaseTrack} */
/** @typedef {import('../../shared/types').PlayerTrack} */

// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const GrassAudio = require("grass-audio");
const { getTrack, getRelease } = require("../services/store");

const grass = new GrassAudio();
let playlist = [];

ipcMain.handle("grass:set-playlist", async (event, tracks) => {
  const tracksWithFilePath = await Promise.all(
    tracks.map(({ id }) => getTrack(id))
  );
  const filePaths = tracksWithFilePath.map((track) => track.filePath);
  playlist = tracksWithFilePath;
  grass.setFiles(filePaths);
});

ipcMain.handle("grass:get-playlist", () => playlist);

ipcMain.handle("grass:get-track", async () => {
  const playlistTrack = playlist[grass.getCurrentFileIndex()];
  if (!playlistTrack) return null;

  const release = await getRelease(playlistTrack.releaseId);

  const track = {
    ...playlistTrack,
    position: grass.getPosition(),
    releaseTitle: release.title,
    releaseArtist: release.artist,
    year: release.year,
    picture: release.picture,
  };

  // don't want to expose the filepath
  delete track.filePath;

  return track;
});

ipcMain.handle("grass:get-playback-status", () => grass.getStatus());

ipcMain.handle("grass:previous", () => {
  grass.previous();
});

ipcMain.handle("grass:skip-to-index", (event, index) => {
  grass.skipToFile(index);
});

ipcMain.handle("grass:play", () => {
  grass.play();
});

ipcMain.handle("grass:pause", () => {
  grass.pause();
});

ipcMain.handle("grass:next", () => {
  grass.next();
});

ipcMain.handle("grass:seek", (event, position) => {
  grass.setPosition(position);
});
