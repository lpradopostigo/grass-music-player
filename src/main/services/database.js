const sqlite3 = require("sqlite3");
const { map, head, pipe, groupBy, prop, values, pick } = require("ramda");
const log = require("loglevel");
const { renameKeys } = require("ramda-adjunct");
const fsp = require("fs/promises");
const { pathExist } = require("../utils/file");
const { DATABASE_PATH } = require("./constants");
const { terminateApp } = require("../utils/error");

const Table = {
  RELEASE: "Release",
  TRACK: "Track",
};

const database = new sqlite3.Database(DATABASE_PATH, (error) => {
  if (error != null) {
    log.error(error);
    terminateApp();
  }
});

async function create() {
  try {
    await close();
    await fsp.unlink(DATABASE_PATH);
    const databaseExists = await pathExist(DATABASE_PATH);
    if (!databaseExists) {
      await createTables();
    }
  } catch (error) {
    log.error(error);
    terminateApp();
  }
}

async function close() {
  return new Promise((resolve, reject) => {
    database.close((error) => {
      if (error == null) reject(error);
      resolve();
    });
  });
}

async function clear() {
  return Promise.all([clearTable(Table.RELEASE), clearTable(Table.TRACK)]);
}

async function clearTable(table) {
  return new Promise((resolve, reject) => {
    database.run(`DELETE FROM "${table}";`, (error) => {
      if (error != null) reject(error);
      resolve();
    });
  });
}

async function insertTrack(track, { releaseTitle, releaseArtist }) {
  return new Promise((resolve, reject) => {
    database.run(
      `INSERT INTO "${Table.TRACK}"
          (title, artist, trackNumber, discNumber, duration, filePath,releaseId)
          values (?,?,?,
            ?,?,?,
            (SELECT id FROM "${Table.RELEASE}"
              WHERE title = ? AND artist = ?))`,
      [
        track.title,
        track.artist,
        track.trackNumber,
        track.discNumber,
        track.duration,
        track.filePath,
        releaseTitle,
        releaseArtist,
      ],
      (error) => {
        if (error != null) reject(error);
        resolve();
      }
    );
  });
}

async function insertTracks(tracks, { releaseTitle, releaseArtist }) {
  return Promise.all(
    tracks.map((track) => insertTrack(track, { releaseTitle, releaseArtist }))
  );
}

async function insertRelease(release) {
  return new Promise((resolve, reject) => {
    database.run(
      `INSERT INTO "${Table.RELEASE}"
            (title, artist, year, pictureSm, pictureMd, pictureLg, numberOfTracks, numberOfDiscs)
            values (?,?,?,?,?,?,?,?)`,
      [
        release.title,
        release.artist,
        release.year,
        release.pictureSm,
        release.pictureMd,
        release.pictureLg,
        release.numberOfTracks,
        release.numberOfDiscs,
      ],
      (error) => {
        if (error != null) reject(error);
        resolve();
      }
    );
  });
}

function insertReleases(releases) {
  return Promise.all(releases.map((release) => insertRelease(release)));
}

/** Create a table given a valid table name */
async function createTable(table) {
  const Query = {
    [Table.RELEASE]: `CREATE TABLE "${Table.RELEASE}" (
            "id" INTEGER NOT NULL,
            "title" TEXT,
            "artist" TEXT,
            "year" INTEGER,
            "numberOfTracks" INTEGER,
            "numberOfDiscs" INTEGER,
            "pictureSm" BLOB,
            "pictureMd" BLOB,
            "pictureLg" BLOB,
            PRIMARY KEY("id" AUTOINCREMENT)
          )`,
    [Table.TRACK]: `CREATE TABLE "${Table.TRACK}" (
            "id" INTEGER NOT NULL,
            "title" TEXT,
            "artist" TEXT,
            "trackNumber" INTEGER,
            "discNumber" INTEGER,
            "duration" INTEGER,
            "filePath" TEXT,
            "releaseId" INTEGER NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
            FOREIGN KEY (releaseId)
              REFERENCES "${Table.RELEASE}" (id)
          )`,
  };

  return new Promise((resolve, reject) => {
    database.run(Query[table], (error) => {
      if (error != null) reject(error);
      resolve();
    });
  });
}

async function createTables() {
  return Promise.all([createTable(Table.RELEASE), createTable(Table.TRACK)]);
}

/** Get all tracks associated to a given release */
function getReleaseTracks(releaseId) {
  return new Promise((resolve, reject) => {
    database.all(
      `SELECT * FROM "${Table.TRACK}" 
            WHERE releaseId = ? 
            ORDER BY discNumber ASC, trackNumber ASC;`,
      [releaseId],
      (error, result) => {
        if (error != null) reject(error);
        resolve(result);
      }
    );
  });
}

function normalizeParsedFiles(parsedFiles) {
  const groupByReleaseTitle = pipe(groupBy(prop("releaseTitle")), values);
  const toNormalizedRelease = (xs) => {
    const x = head(xs);
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
      "pictureSm",
      "pictureMd",
      "pictureLg",
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
      ...pipe(pickReleaseKeys, normalizeReleaseKeys)(x),
      tracks: map(toNormalizedTrack)(xs),
    };
  };

  return pipe(groupByReleaseTitle, map(toNormalizedRelease))(parsedFiles);
}

async function insertData(parsedFiles) {
  const releases = normalizeParsedFiles(parsedFiles);
  await insertReleases(releases).catch(log.warn);
  await Promise.all(
    releases.map((release) =>
      insertTracks(release.tracks, {
        releaseTitle: release.title,
        releaseArtist: release.artist,
      })
    )
  );
}

/** Get all the releases stored in the database */
async function getReleases() {
  return new Promise((resolve, reject) => {
    database.all(`select * from "${Table.RELEASE}"`, (error, result) => {
      if (error != null) reject(error);
      resolve(result);
    });
  });
}

/** Get the corresponding release given an id */
async function getRelease(id) {
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT * FROM "${Table.RELEASE}" WHERE id = ?`,
      [id],
      (error, result) => {
        if (error != null) reject(error);
        resolve(result);
      }
    );
  });
}

/** Get the corresponding track given an id */
async function getTrack(id) {
  return new Promise((resolve, reject) => {
    database.all(
      `SELECT * FROM "${Table.TRACK}" WHERE id = ?`,
      [id],
      (error, result) => {
        if (error != null) reject(error);
        resolve(head(result));
      }
    );
  });
}

module.exports = {
  getTrack,
  getReleaseTracks,
  getRelease,
  getReleases,
  insertData,
  clear,
  close,
  create,
};
