const log = require("loglevel");

async function parseFiles(path) {
  const { parseFile } = require("music-metadata");
  const { getFiles, isAudioPath } = require("../utils/file/file");

  const parsedFiles = [];
  for await (const filePath of getFiles(path)) {
    if (isAudioPath(filePath)) {
      const { common, format } = await parseFile(filePath).catch(() =>
        log.warn(`could not parse ${filePath}`)
      );

      parsedFiles.push({
        filePath,
        picture: common.picture?.[0]?.data,
        title: common.title,
        artist: common.artist,
        trackNumber: common.track.no,
        numberOfTracks: common.track.of,
        discNumber: common.disk.no,
        numberOfDiscs: common.disk.of,
        releaseTitle: common.album,
        releaseArtist: common.albumartist,
        year: common.year,
        duration: format.duration,
      });
    }
  }
  return parsedFiles;
}

async function scan() {
  const database = require("./database");
  const persistentStorage = require("./persistentStorage");

  const parsedFiles = await parseFiles(
    persistentStorage.getValue(persistentStorage.Keys.LIBRARY_PATH)
  );
  log.info("parsed files", parsedFiles);

  await database.clear();
  await database.insertData(parsedFiles);
}

module.exports = { parseFiles, scan };
