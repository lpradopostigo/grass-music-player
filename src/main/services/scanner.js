const log = require("loglevel");

const PictureWidth = {
  sm: 160,
  md: 320,
  lg: 640,
};

function resizePicture(picture, width) {
  const Sharp = require("sharp");

  return Sharp(picture)
    .resize({ width: width })
    .jpeg({ mozjpeg: true })
    .toBuffer();
}

async function parseFiles(path) {
  const { parseFile } = require("music-metadata");
  const { getFiles, isAudioPath } = require("../utils/file/file");

  const parsedFiles = [];
  for await (const filePath of getFiles(path)) {
    if (isAudioPath(filePath)) {
      const { common, format } = await parseFile(filePath).catch(() =>
        log.warn(`could not parse ${filePath}`)
      );
      const picture = common.picture?.[0]?.data;

      parsedFiles.push({
        filePath,
        pictureSm: picture
          ? await resizePicture(picture, PictureWidth.sm)
          : null,
        pictureMd: picture
          ? await resizePicture(picture, PictureWidth.md)
          : null,
        pictureLg: picture
          ? await resizePicture(picture, PictureWidth.lg)
          : null,
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
