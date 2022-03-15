/** @typedef {import('../../shared/types').DatabaseTrack} DatabaseTrack */
/** @typedef {import('../../shared/types').DatabaseRelease} DatabaseRelease */
const memoize = require("memoizee");
const Database = require("./Database");
const { withDeepCopyReturn } = require("../utils/inmutable/inmutable");

/** @param {number} id
 * @return {Promise<DatabaseTrack>} */
async function getTrack(id) {
  if (typeof id !== "number") throw Error("invalid id");

  const database = new Database();
  await database.open();
  const track = await database.getTrack(id);
  await database.close();
  return track;
}

/** @param {number} id
 * @return {Promise<DatabaseRelease>} */
async function getRelease(id) {
  const database = new Database();
  await database.open();
  const release = await database.getRelease(id);
  await database.close();
  return release;
}

/** @return {Promise<DatabaseRelease[]>} */
async function getReleases() {
  const database = new Database();
  await database.open();
  const releases = await database.getReleases();
  await database.close();
  return releases;
}

/** @param {number} releaseId
 * @return {Promise<DatabaseTrack[]>} */
async function getReleaseTracks(releaseId) {
  const database = new Database();
  await database.open();
  const tracks = await database.getTracks(releaseId);
  await database.close();
  return tracks;
}

module.exports = {
  /** @param {number} id
   * @return {Promise<DatabaseTrack>} */
  getTrack,

  /** @param {number} id
   * @return {Promise<DatabaseRelease>} */
  getRelease: memoize(getRelease, { promise: true }),

  /** @return {Promise<DatabaseRelease[]>} */
  getReleases: memoize(getReleases, { promise: true }),

  /** @param {number} releaseId
   * @return {Promise<DatabaseTrack[]>} */
  getReleaseTracks: withDeepCopyReturn(
    memoize(getReleaseTracks, { promise: true })
  ),
};
