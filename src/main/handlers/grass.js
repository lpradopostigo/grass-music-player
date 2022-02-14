// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const { map, prop } = require("ramda");
const GrassAudio = require("grass-audio");
const { getTrack } = require("../services/store");

const grass = new GrassAudio();

let playlist = [];

ipcMain.handle("grass:setPlaylist", async (event, tracks) => {
  const tracksWithFilePath = await Promise.all(
    map(({ id }) => getTrack(id), tracks)
  );
  playlist = tracksWithFilePath;
  const filePaths = map(prop("filePath"));
  grass.setFiles(filePaths(tracksWithFilePath));
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

ipcMain.handle("grass:previous", () => {
  grass.previous();
});

ipcMain.handle("grass:skipToTrack", (event, index) => {
  grass.skipToFile(index);
});

ipcMain.handle("grass:getTrackPosition", () => ({
  current: grass.getPosition(),
  total: grass.getLength(),
}));

ipcMain.handle("grass:setTrackPosition", (event, position) => {
  grass.setPosition(position);
});

ipcMain.handle("grass:getPlaybackStatus", () => grass.getStatus());

ipcMain.handle("grass:getCurrentTrack", () => {
  const track = { ...playlist[grass.getCurrentFileIndex()] };
  delete track.filePath;
  return track;
});
