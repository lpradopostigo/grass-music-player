// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");

ipcMain.handle("player:get-state", () => {
  const { getState } = require("../services/player");
  return getState();
});

ipcMain.handle("player:set-playlist", (_, tracks) => {
  const { setPlaylist } = require("../services/player");
  return setPlaylist(tracks);
});

ipcMain.handle("player:skip-to-index", (_, index) => {
  const { skipToIndex } = require("../services/player");
  skipToIndex(index);
});

ipcMain.handle("player:play", () => {
  const { play } = require("../services/player");
  play();
});

ipcMain.handle("player:pause", () => {
  const { pause } = require("../services/player");
  pause();
});

ipcMain.handle("player:next", () => {
  const { next } = require("../services/player");
  next();
});

ipcMain.handle("player:previous", () => {
  const { previous } = require("../services/player");
  previous();
});

ipcMain.handle("player:seek", (_, position) => {
  const { seek } = require("../services/player");
  seek(position);
});
