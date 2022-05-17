const { createTable, dropTable, select, insert } = require("./utils");
const releasesModel = require("./models/releases");
const tracksModel = require("./models/tracks");

async function migrate() {
  await createTable(releasesModel);
  await createTable(tracksModel);
}

async function drop() {
  await dropTable(releasesModel);
  await dropTable(tracksModel);
}

async function getReleases() {
  return select(releasesModel, null, null, {
    title: "COLLATE NOCASE ASC",
    artist: "COLLATE NOCASE ASC",
  });
}

async function getTracks() {
  return select(tracksModel, null, null, {
    title: "COLLATE NOCASE ASC",
    artist: "COLLATE NOCASE ASC",
  });
}

async function getRelease(id) {
  return (await select(releasesModel, null, { id }))?.[0];
}

async function getTrack(id) {
  return (await select(tracksModel, null, { id }))?.[0];
}

async function getReleaseTracks(releaseId) {
  return select(tracksModel, null, { releaseId });
}

async function insertReleases(releases) {
  return insert(releasesModel, releases);
}

async function insertTracks(tracks) {
  return insert(tracksModel, tracks);
}

async function insertLibrary(library) {
  await insertReleases(library.map(({ tracks, ...rest }) => ({ ...rest })));
  const tracks = (
    await Promise.all(
      library.map(async (release) => {
        const { title, artist, tracks } = release;

        const releaseId = (
          await select(releasesModel, ["id"], {
            title,
            artist,
          })
        )?.[0].id;

        return tracks.map(({ tracks, ...rest }) => ({ ...rest, releaseId }));
      })
    )
  ).flat();

  await insertTracks(tracks);
}

module.exports = {
  migrate,
  drop,
  getReleases,
  getTracks,
  getTrack,
  getRelease,
  getReleaseTracks,
  insertLibrary,
};
