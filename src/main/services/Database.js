const sqlite3 = require("sqlite3");
const { map } = require("ramda");
const log = require("loglevel");
const { pathExist } = require("../utils/file");
const { databasePath } = require("./constants");
const { terminateApp } = require("../utils/error");

class Database {
  static #Table = {
    RELEASE: "Release",
    TRACK: "Track",
  };

  #database = null;

  /** Construct a valid instance of Database
   * @return Database */
  static async construct() {
    const instance = new Database();
    const databaseExists = await pathExist(databasePath);
    if (!databaseExists) {
      await instance.open().catch(terminateApp);
      await instance.createTables().catch(terminateApp);
      await instance.close().catch(terminateApp);
    }
    return instance;
  }

  /** Create the tables on the database, useful on rescan or first launch
   * @return {Promise<void>} */
  async createTables() {
    await this.#createTable(Database.#Table.RELEASE);
    await this.#createTable(Database.#Table.TRACK);
  }

  /** Open a database connection, it does nothing if one already exists
   *  @return {Promise<void>} */
  open() {
    return new Promise((resolve, reject) => {
      this.#database = new sqlite3.Database(databasePath, (error) => {
        if (error != null) reject(error);
        resolve();
      });
    });
  }

  /** Populate the database tables given an array of release
   * @param {any[]} releases
   *  @return {Promise<void[]>} */
  async insertLibrary(releases) {
    await this.#insertReleases(releases).catch(log.warn);

    return Promise.all(
      map(
        (release) =>
          this.#insertTracks(release.tracks, {
            title: release.title,
            artist: release.artist,
          }),
        releases
      )
    );
  }

  /** Get all the releases on the database
   * @return {Promise<any[]>} */
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

  /** Get the corresponding release given the id
   * @param {number} id
   * @return {Promise<any>} */
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

  /** Get all tracks associated to a given release
   * @param {number} releaseId
   * @return {Promise<any[]>} */
  getTracks(releaseId) {
    return new Promise((resolve, reject) => {
      this.#database?.all(
        `SELECT * FROM "${Database.#Table.TRACK}" WHERE releaseId = ?`,
        [releaseId],
        (error, result) => {
          if (error != null) reject(error);
          resolve(result);
        }
      );
    });
  }

  /** Close the database connection, it does nothing if there is no connection
   * @return {Promise<void>} */
  close() {
    return new Promise((resolve, reject) => {
      this.#database?.close((error) => {
        if (error != null) reject(error);
        resolve();
      });
    });
  }

  /** Insert an array of releases on the database
   * @param {any[]} releases
   * @return {Promise<any[]>} */
  #insertReleases(releases) {
    return Promise.all(
      map((release) => this.#insertOneRelease(release), releases)
    );
  }

  /** Create a table given a valid table name
   * @param {string} table
   * @return {Promise<void>} */
  #createTable(table) {
    const Query = {
      [Database.#Table.RELEASE]: `CREATE TABLE "${Database.#Table.RELEASE}" (
            "id" INTEGER NOT NULL,
            "title" TEXT,
            "artist" TEXT,
            "year" INTEGER,
            "numberOfTracks" INTEGER,
            "numberOfDiscs" INTEGER,
            "picture" BLOB,
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

  /** Insert a track into the database, given some release information
   * @param {any} track
   * @param {{title: string, artist: string}} releaseInfo
   * @return {Promise<void>} */
  #insertOneTrack(track, releaseInfo) {
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
          releaseInfo.title,
          releaseInfo.artist,
        ],
        (error) => {
          if (error != null) reject(error);
          resolve();
        }
      );
    });
  }

  /** Insert an array of tracks into the database, given some release information
   *  @param {any[]} tracks
   *  @param {{title: string, artist: string}} releaseInfo
   *  @return {Promise<void[]>} */
  #insertTracks(tracks, releaseInfo) {
    return Promise.all(
      map((track) => this.#insertOneTrack(track, releaseInfo), tracks)
    );
  }

  /** Insert a release into the database
   *  @param {any} release
   *  @return {Promise<void>} */
  #insertOneRelease(release) {
    return new Promise((resolve, reject) => {
      this.#database?.run(
        `INSERT INTO "${Database.#Table.RELEASE}"
            (title, artist,year, picture,numberOfTracks, numberOfDiscs)
            values (?,?,?,?,?,?)`,
        [
          release.title,
          release.artist,
          release.year,
          release.picture,
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
