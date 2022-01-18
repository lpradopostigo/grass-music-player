// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const { map } = require("ramda");
const GrassAudio = require("grass-audio");
const Database = require("./services/Database");

const grass = new GrassAudio();

let playlist = [];

ipcMain.handle("library:getReleases", async () => {
  const database = new Database();
  await database.open();
  const releases = await database.getReleases();
  await database.close();
  return releases;
});

ipcMain.handle("library:getRelease", async (event, releaseId) => {
  const database = new Database();
  await database.open();
  const release = await database.getRelease(releaseId);
  console.log(release)
  await database.close();
  return release;
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
  playlist = tracks;
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

ipcMain.handle("grass:getTrackPosition", async () => ({
  current: grass.getPosition(),
  total: grass.getLength(),
}));

ipcMain.handle("grass:getPlaybackState", async () => grass.getStatus());

ipcMain.handle("grass:setTrackPosition", async (event, position) => {
  grass.setPosition(position);
});

ipcMain.handle(
  "grass:getCurrentTrack",
  async () => playlist[grass.getCurrentFileIndex()]
);
