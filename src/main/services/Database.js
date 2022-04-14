const sqlite3 = require("sqlite3");
const { map, head, pipe, groupBy, prop, values, pick } = require("ramda");
const log = require("loglevel");
const { renameKeys } = require("ramda-adjunct");
const fsp = require("fs/promises");
const { pathExist } = require("../utils/file");
const { DATABASE_PATH } = require("./constants");
const { terminateApp } = require("../utils/error");

class Database {
  static #Table = {
    RELEASE: "Release",
    TRACK: "Track",
  };

  #database = null;

  /** Construct a valid instance, prefer this instead of the standard constructor */
  static async construct() {
    const instance = new Database();
    const databaseExists = await pathExist(DATABASE_PATH);
    if (!databaseExists) {
      await instance.open().catch(terminateApp);
      await instance.#createTables().catch(terminateApp);
      await instance.close().catch(terminateApp);
    }
    return instance;
  }

  async insertData(parsedFiles) {
    const releases = await Database.#normalizeParsedFiles(parsedFiles);
    await this.#insertReleases(releases).catch(log.warn);
    await Promise.all(
      map(
        (release) =>
          this.#insertTracks(release.tracks, {
            releaseTitle: release.title,
            releaseArtist: release.artist,
          }),
        releases
      )
    );
  }

  static delete() {
    return fsp.unlink(DATABASE_PATH);
  }

  /** Get all the releases stored in the database */
  getReleases() {
    return new Promise((resolve, reject) => {
      this.#database?.all(
        `select * from "${Database.#Table.RELEASE}"`,
        (error, result) => {
          if (error != null) reject(error);
          resolve(result);
        }
      );
    });
  }

  /** Get the corresponding release given an id */
  getRelease(id) {
    return new Promise((resolve, reject) => {
      this.#database?.get(
        `SELECT * FROM "${Database.#Table.RELEASE}" WHERE id = ?`,
        [id],
        (error, result) => {
          if (error != null) reject(error);
          resolve(result);
        }
      );
    });
  }

  /** Get the corresponding track given an id */
  getTrack(id) {
    return new Promise((resolve, reject) => {
      this.#database?.all(
        `SELECT * FROM "${Database.#Table.TRACK}" WHERE id = ?`,
        [id],
        (error, result) => {
          if (error != null) reject(error);
          resolve(head(result));
        }
      );
    });
  }

  /** Get all tracks associated to a given release */
  getTracks(releaseId) {
    return new Promise((resolve, reject) => {
      this.#database?.all(
        `SELECT * FROM "${Database.#Table.TRACK}" 
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

  /** Close the database connection, it does nothing if there is no connection */
  close() {
    return new Promise((resolve, reject) => {
      this.#database?.close((error) => {
        if (error != null) reject(error);
        resolve();
      });
    });
  }

  /** Open a database connection, it does nothing if one already exists */
  open() {
    return new Promise((resolve, reject) => {
      this.#database = new sqlite3.Database(DATABASE_PATH, (error) => {
        if (error != null) reject(error);
        resolve();
      });
    });
  }

  async #createTables() {
    await this.#createTable(Database.#Table.RELEASE);
    await this.#createTable(Database.#Table.TRACK);
  }

  static async #normalizeParsedFiles(parsedFiles) {
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

  /** Insert an array of releases on the database */
  #insertReleases(releases) {
    return Promise.all(
      map((release) => this.#insertRelease(release), releases)
    );
  }

  /** Create a table given a valid table name */
  #createTable(table) {
    const Query = {
      [Database.#Table.RELEASE]: `CREATE TABLE "${Database.#Table.RELEASE}" (
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
      [Database.#Table.TRACK]: `CREATE TABLE "${Database.#Table.TRACK}" (
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
              REFERENCES "${Database.#Table.RELEASE}" (id)
          )`,
    };

    return new Promise((resolve) => {
      this.#database?.run(Query[table], (error) => {
        if (error != null) throw error;
        resolve();
      });
    });
  }

  /** Insert a track given some release information */
  #insertTrack(track, { releaseTitle, releaseArtist }) {
    return new Promise((resolve, reject) => {
      this.#database?.run(
        `INSERT INTO "${Database.#Table.TRACK}"
          (title, artist, trackNumber, discNumber, duration, filePath,releaseId)
          values (?,?,?,
            ?,?,?,
            (SELECT id FROM "${Database.#Table.RELEASE}"
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

  /** Insert an array of tracks into the database given some release information */
  #insertTracks(tracks, { releaseTitle, releaseArtist }) {
    return Promise.all(
      map(
        (track) => this.#insertTrack(track, { releaseTitle, releaseArtist }),
        tracks
      )
    );
  }

  #insertRelease(release) {
    return new Promise((resolve, reject) => {
      this.#database?.run(
        `INSERT INTO "${Database.#Table.RELEASE}"
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
}

module.exports = Database;
