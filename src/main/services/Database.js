const sqlite3 = require("sqlite3");
const { map } = require("ramda");
const { pathExist } = require("../utils/file");
const { databasePath } = require("./constants");
const { terminateApp } = require("../utils/error");

class Database {
  static #Table = {
    RELEASE: "Release",
    TRACK: "Track",
  };

  #database = null;

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

  async createTables() {
    await this.#createTable(Database.#Table.RELEASE);
    await this.#createTable(Database.#Table.TRACK);
  }

  open() {
    return new Promise((resolve, reject) => {
      this.#database = new sqlite3.Database(databasePath, (error) => {
        if (error != null) reject(error);
        resolve();
      });
    });
  }

  async insertLibrary(releases) {
    await this.#insertReleases(releases).catch((error) => console.log(error));

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

  close() {
    return new Promise((resolve, reject) => {
      this.#database?.close((error) => {
        if (error != null) reject(error);
        resolve();
      });
    });
  }

  #insertReleases(releases) {
    return Promise.all(
      map((release) => this.#insertOneRelease(release), releases)
    );
  }

  #createTable(table) {
    const Query = {
      [Database.#Table.RELEASE]: `CREATE TABLE "${Database.#Table.RELEASE}" (
            "id" INTEGER NOT NULL,
            "title" TEXT,
            "artist" TEXT,
            "year" INTEGER,
            "picture" BLOB,
            PRIMARY KEY("id" AUTOINCREMENT)
          )`,
      [Database.#Table.TRACK]: `CREATE TABLE "${Database.#Table.TRACK}" (
            "id" INTEGER NOT NULL,
            "title" TEXT,
            "artist" TEXT,
            "releaseId" INTEGER NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
            FOREIGN KEY (releaseId)
              REFERENCES "${Database.#Table.RELEASE}" (id)
          )`,
    };

    return new Promise((resolve, reject) => {
      this.#database?.run(Query[table], (error) => {
        if (error != null) throw error;
        resolve();
      });
    });
  }

  #insertOneTrack(track, releaseInfo) {
    return new Promise((resolve, reject) => {
      this.#database?.run(
        `INSERT INTO "${Database.#Table.TRACK}" (title, artist, releaseId)
          values (?,?,
            (SELECT id FROM "${Database.#Table.RELEASE}"
              WHERE title = ? AND artist = ?))`,
        [track.title, track.artist, releaseInfo.title, releaseInfo.artist],
        (error) => {
          if (error != null) reject(error);
          resolve();
        }
      );
    });
  }

  #insertTracks(tracks, releaseInfo) {
    return Promise.all(
      map((track) => this.#insertOneTrack(track, releaseInfo), tracks)
    );
  }

  #insertOneRelease(release) {
    return new Promise((resolve, reject) => {
      this.#database?.run(
        `INSERT INTO "${Database.#Table.RELEASE}"(title, artist,year, picture)
            values (?,?,?,?)`,
        [release.title, release.artist, release.year, release.picture],
        (error) => {
          if (error != null) reject(error);
          resolve();
        }
      );
    });
  }
}

module.exports = Database;
