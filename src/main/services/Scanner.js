const { parseFile } = require("music-metadata");
const { compose, groupBy, head, map, prop, values } = require("ramda");
const { getFiles, isAudioPath } = require("../utils/file");
const PersistentStorage = require("./PersistentStorage");

class Scanner {
  #store = new PersistentStorage();

  static async parseAudioFiles(path) {
    let parsedFiles = [];
    for await (const filePath of getFiles(path)) {
      if (isAudioPath(filePath)) {
        const { common, format } = await parseFile(filePath);
        parsedFiles.push({
          filePath,
          title: common.title,
          artist: common.artist,
          track: common.track,
          disk: common.disk,
          releaseTitle: common.album,
          releaseArtist: common.albumartist,
          year: common.year,
          picture: common.picture?.[0].data,
          duration: format.duration,
        });
      }
    }
    return parsedFiles;
  }

  async getLibrary() {
    const parsedAudioFiles = await Scanner.parseAudioFiles(
      this.#store.get(PersistentStorage.Keys.LIBRARY_PATH)
    );

    const groupByReleaseTitle = compose(values, groupBy(prop("releaseTitle")));
    const toParsedTrack = (obj) => ({
      title: obj.title,
      artist: obj.artist,
      number: obj.track.no,
      diskNumber: obj.disk.no,
      duration: obj.duration,
      filePath: obj.filePath,
    });

    const toParsedRelease = (tracks) => {
      const first = head(tracks);
      return {
        year: first.year,
        picture: first.picture,
        title: first.releaseTitle,
        artist: first.releaseArtist,
        tracks: map(toParsedTrack, tracks),
      };
    };

    return compose(map(toParsedRelease), groupByReleaseTitle)(parsedAudioFiles);
  }
}

module.exports = Scanner;
