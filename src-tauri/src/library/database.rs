use crate::global::DB_CONNECTION;
use rusqlite::Error as RusqliteError;
use serde::Serialize;
use ts_rs::TS;

pub struct Database;

impl Database {
    pub async fn migrate() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let artist_schema = "CREATE TABLE IF NOT EXISTS artist (
            id TEXT NOT NULL,
            name TEXT NOT NULL,
            PRIMARY KEY (id)
        )";

        let artist_credit_schema = "CREATE TABLE IF NOT EXISTS artist_credit (
            id TEXT NOT NULL,
            name TEXT NOT NULL,
            PRIMARY KEY (id)
        )";

        let artist_credit_part_schema = "CREATE TABLE IF NOT EXISTS artist_credit_part (
            artist_credit_id TEXT NOT NULL,
            artist_id TEXT NOT NULL,
            PRIMARY KEY (artist_credit_id, artist_id),
            FOREIGN KEY (artist_credit_id) REFERENCES artist_credit(id),
            FOREIGN KEY (artist_id) REFERENCES artist(id)
        )";

        let release_schema = "CREATE TABLE IF NOT EXISTS release (
                id TEXT NOT NULL,
                artist_credit_id TEXT NOT NULL,
                name TEXT NOT NULL,
                date TEXT NOT NULL,
                total_tracks INTEGER NOT NULL,
                total_discs INTEGER NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (artist_credit_id) REFERENCES artist_credit(id)
        )";

        let track_schema = "CREATE TABLE IF NOT EXISTS track (
                id TEXT NOT NULL,
                release_id TEXT NOT NULL,
                artist_credit_id TEXT NOT NULL,
                name TEXT NOT NULL,
                length REAL NOT NULL,
                track_number INTEGER NOT NULL,
                disc_number INTEGER NOT NULL,
                path TEXT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (release_id) REFERENCES release(id),
                FOREIGN KEY (artist_credit_id) REFERENCES artist_credit(id)
        )";

        connection.execute(artist_schema, [])?;
        connection.execute(artist_credit_schema, [])?;
        connection.execute(artist_credit_part_schema, [])?;
        connection.execute(release_schema, [])?;
        connection.execute(track_schema, [])?;

        Ok(())
    }

    pub async fn rollback() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("DROP TABLE IF EXISTS track", [])?;
        connection.execute("DROP TABLE IF EXISTS release", [])?;
        connection.execute("DROP TABLE IF EXISTS artist_credit_part", [])?;
        connection.execute("DROP TABLE IF EXISTS artist_credit", [])?;
        connection.execute("DROP TABLE IF EXISTS artist", [])?;

        Ok(())
    }

    pub async fn begin_transaction() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("BEGIN TRANSACTION", [])?;

        Ok(())
    }

    pub async fn commit_transaction() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("COMMIT TRANSACTION", [])?;

        Ok(())
    }

    pub async fn add_artist_credit(artist_credit: &ArtistCredit) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(
            "INSERT INTO artist_credit (id, name) VALUES (?1, ?2)",
            rusqlite::params![artist_credit.id, artist_credit.name],
        )?;

        Ok(())
    }

    pub async fn add_artist_credit_part(
        artist_credit_part: &ArtistCreditPart,
    ) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(
            "INSERT INTO artist_credit_part (artist_credit_id, artist_id) VALUES (?1, ?2)",
            rusqlite::params![
                artist_credit_part.artist_credit_id,
                artist_credit_part.artist_id
            ],
        )?;

        Ok(())
    }

    pub async fn add_artist(artist: &Artist) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(
            "INSERT INTO artist (id, name) VALUES (?1, ?2)",
            rusqlite::params![artist.id, artist.name],
        )?;

        Ok(())
    }

    pub async fn add_release(release: &Release) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(
            "INSERT INTO release (id, artist_credit_id, name, date, total_tracks, total_discs) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![
                release.id,
                release.artist_credit_id,
                release.name,
                release.date,
                release.total_tracks,
                release.total_discs
            ],
        )?;

        Ok(())
    }

    pub async fn add_track(track: &Track) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(
            "INSERT INTO track (id, release_id, artist_credit_id, name, length, track_number, disc_number, path) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            rusqlite::params![
                track.id,
                track.release_id,
                track.artist_credit_id,
                track.name,
                track.length,
                track.track_number,
                track.disc_number,
                track.path
            ],
        )?;

        Ok(())
    }

    pub async fn find_release(release_id: &str) -> Result<Release, RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let release =
            connection.query_row("SELECT * FROM release WHERE id = ?1", [release_id], |row| {
                Ok(Release {
                    id: row.get(0)?,
                    artist_credit_id: row.get(1)?,
                    name: row.get(2)?,
                    date: row.get(3)?,
                    total_tracks: row.get(4)?,
                    total_discs: row.get(5)?,
                })
            })?;

        Ok(release)
    }

    pub async fn find_all_releases() -> Result<Vec<Release>, RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let mut statement = connection.prepare("SELECT * FROM release")?;
        let releases_iter = statement.query_map([], |row| {
            Ok(Release {
                id: row.get(0)?,
                artist_credit_id: row.get(1)?,
                name: row.get(2)?,
                date: row.get(3)?,
                total_tracks: row.get(4)?,
                total_discs: row.get(5)?,
            })
        })?;

        let mut releases = Vec::new();

        for release in releases_iter {
            releases.push(release?);
        }

        Ok(releases)
    }

    pub async fn find_track_by_path(path: &str) -> Result<Track, RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let track = connection.query_row("SELECT * FROM track WHERE path = ?1", [path], |row| {
            Ok(Track {
                id: row.get(0)?,
                release_id: row.get(1)?,
                artist_credit_id: row.get(2)?,
                name: row.get(3)?,
                length: row.get(4)?,
                track_number: row.get(5)?,
                disc_number: row.get(6)?,
                path: row.get(7)?,
            })
        })?;

        Ok(track)
    }

    pub async fn find_track(track_id: &str) -> Result<Track, RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let track =
            connection.query_row("SELECT * FROM track WHERE id = ?1", [track_id], |row| {
                Ok(Track {
                    id: row.get(0)?,
                    release_id: row.get(1)?,
                    artist_credit_id: row.get(2)?,
                    name: row.get(3)?,
                    length: row.get(4)?,
                    track_number: row.get(5)?,
                    disc_number: row.get(6)?,
                    path: row.get(7)?,
                })
            })?;

        Ok(track)
    }

    pub async fn find_tracks_by_release_id(release_id: &str) -> Result<Vec<Track>, RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let mut statement = connection.prepare("SELECT * FROM track WHERE release_id = ?1")?;
        let tracks_iter = statement.query_map([release_id], |row| {
            Ok(Track {
                id: row.get(0)?,
                release_id: row.get(1)?,
                artist_credit_id: row.get(2)?,
                name: row.get(3)?,
                length: row.get(4)?,
                track_number: row.get(5)?,
                disc_number: row.get(6)?,
                path: row.get(7)?,
            })
        })?;

        let mut tracks = Vec::new();

        for track in tracks_iter {
            tracks.push(track?);
        }

        Ok(tracks)
    }

    pub async fn find_artist_credit(artist_credit_id: &str) -> Result<ArtistCredit, RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let artist_credit = connection.query_row(
            "SELECT * FROM artist_credit WHERE id = ?1",
            [artist_credit_id],
            |row| {
                Ok(ArtistCredit {
                    id: row.get(0)?,
                    name: row.get(1)?,
                })
            },
        )?;

        Ok(artist_credit)
    }
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Artist {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ArtistCredit {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ArtistCreditPart {
    pub artist_credit_id: String,
    pub artist_id: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Release {
    pub id: String,
    pub artist_credit_id: String,
    pub name: String,
    pub date: String,
    pub total_tracks: u16,
    pub total_discs: u16,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Track {
    pub id: String,
    pub release_id: String,
    pub artist_credit_id: String,
    pub name: String,
    pub length: f64,
    pub track_number: u16,
    pub disc_number: u16,
    pub path: String,
}
