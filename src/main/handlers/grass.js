// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const { map } = require("ramda");
const GrassAudio = require("grass-audio");

const grass = new GrassAudio();

let playlist = [];

ipcMain.handle("grass:setPlaylist", (event, tracks) => {
  const paths = map((track) => track.filePath, tracks);
  playlist = tracks;
  grass.setFiles(paths);
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

ipcMain.handle(
  "grass:getCurrentTrack",
  () => playlist[grass.getCurrentFileIndex()]
);
