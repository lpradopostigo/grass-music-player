const { parseFile } = require("music-metadata");
const log = require("loglevel");
const Sharp = require("sharp");
const { getFiles, isAudioPath } = require("../utils/file");
const persistentStorage = require("./persistentStorage");
const Database = require("./Database");

const PictureWidth = {
  sm: 160,
  md: 320,
  lg: 640,
};

function resizePicture(picture, width) {
  return Sharp(picture)
    .resize({ width: width })
    .jpeg({ mozjpeg: true })
    .toBuffer();
}

async function parseFiles(path) {
  const parsedFiles = [];
  for await (const filePath of getFiles(path)) {
    if (isAudioPath(filePath)) {
      const { common, format } = await parseFile(filePath).catch(() =>
        log.warn(`could not parse ${filePath}`)
      );
      const picture = common.picture?.[0]?.data;

      parsedFiles.push({
        filePath,
        pictureSm: await resizePicture(picture, PictureWidth.sm),
        pictureMd: await resizePicture(picture, PictureWidth.md),
        pictureLg: await resizePicture(picture, PictureWidth.lg),
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
  const parsedFiles = await parseFiles(
    persistentStorage.getValue(persistentStorage.Keys.LIBRARY_PATH)
  );
  log.info("parsed files", parsedFiles);

  await Database.delete();
  const database = await Database.construct();
  await database.open();
  await database.insertData(parsedFiles);
  await database.close();
}

module.exports = { parseFiles, scan };
