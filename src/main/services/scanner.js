const { parseFile } = require("music-metadata");
const { groupBy, head, map, prop, values, pipe, pick } = require("ramda");
const log = require("loglevel");
const { renameKeys } = require("ramda-adjunct");
const { getFiles, isAudioPath } = require("../utils/file");
const persistentStorage = require("./persistentStorage");

async function parsePath(path) {
  const parsedFiles = [];
  for await (const filePath of getFiles(path)) {
    if (isAudioPath(filePath)) {
      const { common, format } = await parseFile(filePath).catch(() =>
        log.warn(`could not parse ${filePath}`)
      );

      if (common != null && format != null) {
        parsedFiles.push({
          filePath,
          title: common.title,
          artist: common.artist,
          trackNumber: common.track.no,
          numberOfTracks: common.track.of,
          discNumber: common.disk.no,
          numberOfDiscs: common.disk.of,
          releaseTitle: common.album,
          releaseArtist: common.albumartist,
          year: common.year,
          picture: common.picture?.[0]?.data,
          duration: format.duration,
        });
      }
    }
  }
  return parsedFiles;
}

async function getLibrary() {
  const parsedAudioFiles = await parsePath(
    persistentStorage.getValue(persistentStorage.Keys.LIBRARY_PATH)
  );

  const groupByReleaseTitle = pipe(groupBy(prop("releaseTitle")), values);
  const toNormalizedRelease = (tracks) => {
    const firstTrack = head(tracks);
    const toNormalizedTrack = pick([
      "title",
      "artist",
      "trackNumber",
      "discNumber",
      "duration",
      "filePath",
    ]);
    const pickReleaseKeys = pick([
      "year",
      "picture",
      "releaseTitle",
      "releaseArtist",
      "numberOfDiscs",
      "numberOfTracks",
    ]);
    const normalizeReleaseKeys = renameKeys({
      releaseTitle: "title",
      releaseArtist: "artist",
    });

    return {
      ...pipe(pickReleaseKeys, normalizeReleaseKeys)(firstTrack),
      tracks: map(toNormalizedTrack)(tracks),
    };
  };

  return pipe(groupByReleaseTitle, map(toNormalizedRelease))(parsedAudioFiles);
}

module.exports = { parsePath, getLibrary };
