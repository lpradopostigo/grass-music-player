const sqlite3 = require("sqlite3");
const { map } = require("ramda");

const { pathExist } = require("./file");

const { databasePath } = require("./constants");

/** @typedef Release
 * @property {number} id
 * @property {string | null } title
 * @property {string | null } artist
 * @property {number | null } year
 * @property {Uint8Array | null } picture
 * */

/** @typedef Track
 * @property {number} id
 * @property {string | null } title
 * @property {string | null } artist
 * @property {number} releaseId
 * */

const Table = {
  RELEASE: "Release",
  TRACK: "Track",
};

class Database {
  #database = null;

  /** @return {Promise<Database>} */
  static async construct() {
    const instance = new Database();
    const databaseExists = await pathExist(databasePath);
    if (!databaseExists) {
      await instance.open();
      await instance.createTables();
      await instance.close();
    }
    return instance;
  }

  /** @return {Promise<void>} */
  async createTables() {
    await this.#createTable(Table.RELEASE);
    await this.#createTable(Table.TRACK);
  }

  /** @return {Promise<void>} */
  open() {
    return new Promise((resolve, reject) => {
      this.#database = new sqlite3.Database(databasePath, (error) => {
        if (error != null) {
          reject(error);
        }
        resolve();
      });
    });
  }

  /** @param {import("./scanner").Release[]} releases
   *  @return {Promise<void[]>} */
  async insertLibrary(releases) {
    await this.#insertReleases(releases);

    return Promise.all(
      map((release) =>
        this.#insertTracks(release.tracks, {
          title: release.title,
          artist: release.artist,
        })
      )(releases)
    );
  }

  /** @return {Promise<Release[]>} */
  getReleases() {
    return new Promise((resolve, reject) => {
      this.#database?.all(
        `select * from "${Table.RELEASE}"`,
        (error, result) => {
          if (error != null) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  }

  /** @param {number} releaseId
   * @return {Promise<Track[]>} */
  getTracks(releaseId) {
    return new Promise((resolve, reject) => {
      this.#database?.all(
        `SELECT * FROM "${Table.TRACK}" WHERE releaseId = ?`,
        [releaseId],
        (error, result) => {
          if (error != null) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  }

  /** @return {Promise<void>} */
  close() {
    return new Promise((resolve, reject) => {
      this.#database?.close((error) => {
        if (error != null) {
          reject(error);
        }
        resolve();
      });
    });
  }

  /** @param {import("./scanner").Release[]} releases
   * @return {Promise<void[]>} */
  #insertReleases(releases) {
    return Promise.all(map(this.#insertOneRelease.bind(this))(releases));
  }

  /** @return {Promise<void>} */
  #createTable(table) {
    const Query = {
      [Table.RELEASE]: `CREATE TABLE "${Table.RELEASE}" (
            "id" INTEGER NOT NULL,
            "title" TEXT,
            "artist" TEXT,
            "year" INTEGER,
            "picture" BLOB,
            PRIMARY KEY("id" AUTOINCREMENT)
          )`,
      [Table.TRACK]: `CREATE TABLE "${Table.TRACK}" (
            "id" INTEGER NOT NULL,
            "title" TEXT,
            "artist" TEXT,
            "releaseId" INTEGER NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
            FOREIGN KEY (releaseId)
              REFERENCES "${Table.RELEASE}" (id)
          )`,
    };

    return new Promise((resolve, reject) => {
      this.#database?.run(Query[table], (runError) => {
        if (runError != null) {
          reject(runError);
        }
        resolve();
      });
    });
  }

  /** @param {import("./scanner").Track} track
   * @param {{title?: string, artist?: string}} releaseInfo
   * @return {Promise<void>} */
  #insertOneTrack(track, releaseInfo) {
    return new Promise((resolve, reject) => {
      this.#database?.run(
        `INSERT INTO "${Table.TRACK}" (title, artist, releaseId)
          values (?,?,
            (SELECT id FROM "${Table.RELEASE}"
              WHERE title = ? AND artist = ?))`,
        [track.title, track.artist, releaseInfo.title, releaseInfo.artist],
        (error) => {
          if (error != null) {
            reject(error);
          }
          resolve();
        }
      );
    });
  }

  /** @param {import("./scanner").Track[]} tracks
   * @param {{title?: string, artist?: string}} releaseInfo
   * @return {Promise<void[]>} */
  #insertTracks(tracks, releaseInfo) {
    return Promise.all(
      map((track) => this.#insertOneTrack(track, releaseInfo))(tracks)
    );
  }

  /** @return {Promise<void>} */
  #insertOneRelease(release) {
    return new Promise((resolve, reject) => {
      this.#database?.run(
        `INSERT INTO "${Table.RELEASE}"(title, artist,year, picture)
            values (?,?,?,?)`,
        [release.title, release.artist, release.year, release.picture],
        (error) => {
          if (error != null) {
            reject(error);
          }
          resolve();
        }
      );
    });
  }
}

module.exports = Database;
