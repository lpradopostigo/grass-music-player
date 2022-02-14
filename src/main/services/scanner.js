/** @typedef {import('../../shared/types').ScannerParsedFile} ScannerParsedFile */
/** @typedef {import('../../shared/types').ScannerTrack} ScannerTrack */
/** @typedef {import('../../shared/types').ScannerRelease} ScannerRelease */
const {parseFile} = require("music-metadata");
const {compose, groupBy, head, map, prop, values} = require("ramda");
const log = require("loglevel");
const {getFiles, isAudioPath} = require("../utils/file");
const persistentStorage = require("./persistentStorage");

/** Parse recursively the audio files in the given path
 * @param {string} path
 * @return {Promise<ScannerParsedFile[]>} */
async function parsePath(path) {
  const parsedFiles = [];
  for await (const filePath of getFiles(path)) {
    if (isAudioPath(filePath)) {
      const {common, format} = await parseFile(filePath).catch(() =>
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
          picture: (common.picture)?.[0]?.data,
          duration: format.duration,
        });
      }
    }
  }
  return parsedFiles;
}


/** Get the library, specified in the LIBRARY_PATH
 * @return {Promise<ScannerRelease[]>} */
async function getLibrary() {
  const parsedAudioFiles = await parsePath(
    persistentStorage.getValue(persistentStorage.Keys.LIBRARY_PATH)
  );
  const groupByReleaseTitle = compose(values, groupBy(prop("releaseTitle")));
  const toTrack = (obj) => ({
    title: obj.title,
    artist: obj.artist,
    trackNumber: obj.trackNumber,
    discNumber: obj.discNumber,
    duration: obj.duration,
    filePath: obj.filePath,
  });

  const toRelease = (tracks) => {
    const first = head(tracks);
    return {
      year: first.year,
      picture: first.picture,
      title: first.releaseTitle,
      artist: first.releaseArtist,
      numberOfTracks: first.numberOfTracks,
      numberOfDiscs: first.numberOfDiscs,
      tracks: map(toTrack, tracks),
    };
  };

  return compose(map(toRelease), groupByReleaseTitle)(parsedAudioFiles);
}


module.exports = {parsePath, getLibrary};
