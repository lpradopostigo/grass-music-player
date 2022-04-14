const Database = require("./Database");

async function getTrack(id) {
  const database = await Database.construct();
  await database.open();
  const track = await database.getTrack(id);
  await database.close();
  return track;
}

async function getRelease(id) {
  const database = await Database.construct();
  await database.open();
  const release = await database.getRelease(id);
  await database.close();
  return release;
}

async function getReleases() {
  const database = await Database.construct();
  await database.open();
  const releases = await database.getReleases();
  await database.close();
  return releases;
}

async function getReleaseTracks(releaseId) {
  const database = await Database.construct();
  await database.open();
  const tracks = await database.getTracks(releaseId);
  await database.close();
  return tracks;
}

module.exports = {
  getTrack,
  getRelease,
  getReleases,
  getReleaseTracks,
};
