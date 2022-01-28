const memoize = require("memoizee");
const Database = require("./Database");

async function getRelease(id) {
  const database = new Database();
  await database.open();
  const release = await database.getRelease(id);
  await database.close();
  return release;
}

async function getAllReleases() {
  const database = new Database();
  await database.open();
  const releases = await database.getReleases();
  await database.close();
  return releases;
}

async function getReleaseTracks(releaseId) {
  const database = new Database();
  await database.open();
  const tracks = await database.getTracks(releaseId);
  await database.close();
  return tracks;
}

module.exports = {
  getRelease: memoize(getRelease, { promise: true }),
  getAllReleases: memoize(getAllReleases, { promise: true }),
  getReleaseTracks: memoize(getReleaseTracks, { promise: true }),
};
