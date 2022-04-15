// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require("electron");
const GrassAudio = require("grass-audio");
const { map, prop, pipe, andThen } = require("ramda");
const database = require("../services/database");

const player = new GrassAudio();
let playlist = [];

ipcMain.handle("player:set-playlist", async (_, tracks) => {
  const getFilePath = pipe(
    prop("id"),
    database.getTrack,
    andThen(prop("filePath"))
  );
  playlist = tracks;
  const filePaths = await Promise.all(map(getFilePath)(tracks));
  player.setFiles(filePaths);
});

ipcMain.handle("player:get-state", async () => {
  const { fileIndex, filePosition, fileDuration, playbackState } =
    player.getState();
  const playlistTrack = playlist[fileIndex];
  let track = {};

  if (playlistTrack) {
    const release = await database.getRelease(playlistTrack.releaseId);
    track = {
      ...playlistTrack,
      duration: fileDuration,
      position: filePosition,
      releaseTitle: release.title,
      releaseArtist: release.artist,
      year: release.year,
      pictureSm: release.pictureSm,
      pictureMd: release.pictureMd,
      pictureLg: release.pictureLg,
      playlistIndex: fileIndex,
    };
  }

  return {
    track,
    playbackState,
    playlist,
  };
});

ipcMain.handle("player:skip-to-index", (event, index) =>
  player.skipToIndex(index)
);
ipcMain.handle("player:play", () => player.play());
ipcMain.handle("player:pause", () => player.pause());
ipcMain.handle("player:next", () => player.next());
ipcMain.handle("player:previous", () => player.previous());
ipcMain.handle("player:seek", (_, position) => player.seek(position));
