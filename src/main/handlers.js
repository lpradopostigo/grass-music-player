// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const { map } = require("ramda");
const GrassAudio = require("grass-audio");
const Database = require("./services/Database");

const grass = new GrassAudio();

ipcMain.handle("library:getReleases", async () => {
  const database = new Database();
  await database.open();
  const releases = await database.getReleases();
  await database.close();
  return releases;
});

ipcMain.handle("library:getTracks", async (event, releaseId) => {
  const database = new Database();
  await database.open();
  const tracks = await database.getTracks(releaseId);
  await database.close();
  return tracks;
});

ipcMain.handle("grass:setPlaylist", async (event, tracks) => {
  const paths = map((track) => track.filePath, tracks);
  grass.setFiles(paths);
});

ipcMain.handle("grass:play", async () => {
  grass.play();
});

ipcMain.handle("grass:pause", async () => {
  grass.pause();
});

ipcMain.handle("grass:next", async () => {
  grass.next();
});

ipcMain.handle("grass:previous", async () => {
  grass.previous();
});

ipcMain.handle("grass:skipToTrack", async (event, index) => {
  grass.skipToFile(index);
});

ipcMain.handle("grass:getTrackPosition", async () => {
  return {
    current: grass.getPosition(),
    total: grass.getLength(),
  };
});

ipcMain.handle("grass:getPlaybackState", async () => {
  return grass.getStatus();
});

ipcMain.handle("grass:setTrackPosition", async (event, position) => {
  return grass.setPosition(position);
});
