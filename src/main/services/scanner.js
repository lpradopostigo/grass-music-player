const { parseFile } = require("music-metadata");
const { map, compose, values, head, prop, groupBy } = require("ramda");
const { getFiles, isAudioFile } = require("./file");

/** @typedef ParsedAudioFile
 * @property {string} [title]
 * @property {string} [artist]
 * @property {{ no: number | null; of: number | null }} track
 * @property {{ no: number | null; of: number | null }} disk
 * @property {string} [releaseTitle]
 * @property {string} [releaseArtist]
 * @property {number} [year]
 * @property {Buffer} [picture]
 * @property {string} filePath
 * */

/** @typedef Track
 * @property {string} [title]
 * @property {string} [artist]
 * @property {number | null} number
 * @property {number | null} diskNumber
 * @property {string} filePath
 * */

/** @typedef Release
 * @property {string} [title]
 * @property {string} [artist]
 * @property {number} [year]
 * @property {Buffer} [picture]
 * @property {Track[]} tracks
 * */

/** @param {string} path
 * @return {Promise<ParsedAudioFile[]>} */
async function parseAudioFiles(path) {
  const parsedFiles = [];
  for await (const filePath of getFiles(path)) {
    if (isAudioFile(filePath)) {
      const { common } = await parseFile(filePath);
      parsedFiles.push({
        title: common.title,
        artist: common.artist,
        track: common.track,
        disk: common.disk,
        releaseTitle: common.album,
        releaseArtist: common.albumartist,
        year: common.year,
        picture: common.picture?.[0].data,
        filePath,
      });
    }
  }
  return parsedFiles;
}

/** @return {Promise<Release[]>} */
async function getReleases() {
  const parsedAudioFiles = await parseAudioFiles("dummy_local_files/library");
  const groupByReleaseTitle = compose(values, groupBy(prop("releaseTitle")));
  const toTrack = (obj) => ({
    title: obj.title,
    artist: obj.artist,
    number: obj.track.no,
    diskNumber: obj.disk.no,
    filePath: obj.filePath,
  });
  const toRelease = (arr) => {
    const first = head(arr);
    return {
      year: first.year,
      picture: first.picture,
      title: first.releaseTitle,
      artist: first.releaseArtist,
      tracks: map(toTrack)(arr),
    };
  };
  return compose(map(toRelease), groupByReleaseTitle)(parsedAudioFiles);
}

module.exports = {
  getReleases,
};
