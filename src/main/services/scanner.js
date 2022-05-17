const log = require("loglevel");

async function resizePicture(picture, width, options) {
  const Sharp = require("sharp");

  return Sharp(picture)
    .resize(width, width, options)
    .webp({ effort: 0, smartSubsample: true })
    .toBuffer();
}

function bufferToWebpUrl(buffer) {
  return `data:image/webp;base64,${buffer.toString("base64")}`;
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
        picture,
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

async function parsedFilesToLibrary(parsedFiles) {
  const groupedTracksByRelease = Object.values(
    parsedFiles.groupBy(({ releaseTitle }) => releaseTitle)
  );

  return Promise.all(
    groupedTracksByRelease.map(async (releaseTracks) => {
      const [sampleTrack] = releaseTracks;
      return {
        title: sampleTrack.releaseTitle,
        artist: sampleTrack.releaseArtist,
        year: sampleTrack.year,
        picture: sampleTrack.picture
          ? bufferToWebpUrl(
              await resizePicture(sampleTrack.picture, 800, {
                withoutEnlargement: true,
              })
            )
          : null,
        thumbnail: sampleTrack.picture
          ? bufferToWebpUrl(
              await resizePicture(sampleTrack.picture, 300, {
                withoutEnlargement: true,
              })
            )
          : null,
        numberOfTracks: sampleTrack.numberOfTracks || releaseTracks.length,
        numberOfDiscs: sampleTrack.numberOfDiscs,
        tracks: releaseTracks.map((track) => ({
          title: track.title,
          artist: track.artist,
          trackNumber: track.trackNumber,
          discNumber: track.discNumber,
          duration: track.duration,
          filePath: track.filePath,
        })),
      };
    })
  );
}

async function scan() {
  const database = require("./database");
  const persistentStorage = require("./persistentStorage");

  const parsedFiles = await parseFiles(
    persistentStorage.getValue(persistentStorage.Keys.LIBRARY_PATH)
  );
  log.info("parsed files", parsedFiles);

  const library = await parsedFilesToLibrary(parsedFiles);
  log.info("library", library);

  await database.drop();
  await database.migrate();
  await database.insertLibrary(library);
}

module.exports = { parseFiles, scan };
