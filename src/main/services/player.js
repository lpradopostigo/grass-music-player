const GrassAudio = require("grass-audio");

const player = new GrassAudio();
let playlist = [];

async function setPlaylist(tracks) {
  const database = require("./database");

  const filePaths = await Promise.all(
    tracks.map(async ({ id }) => {
      const { filePath } = await database.getTrack(id);
      return filePath;
    })
  );

  playlist = tracks;
  player.setFiles(filePaths);
}

async function getState() {
  const database = require("./database");
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
}

function play() {
  player.play();
}

function pause() {
  player.pause();
}

function next() {
  player.next();
}

function previous() {
  player.previous();
}

function seek(position) {
  player.seek(position);
}

function skipToIndex(index) {
  player.skipToIndex(index);
}

module.exports = {
  play,
  pause,
  next,
  previous,
  seek,
  setPlaylist,
  skipToIndex,
  getState,
};
