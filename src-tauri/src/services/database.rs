use crate::global::DB_CONNECTION;
use rusqlite::Error as RusqliteError;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

const SETTINGS_ROW_ID: i8 = 1;

const TRACK_SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS track (
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
)
";

const ARTIST_SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS artist (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (id)
)
";

const ARTIST_CREDIT_SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS artist_credit (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (id)
)
";

const ARTIST_CREDIT_PART_SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS artist_credit_part (
    artist_credit_id TEXT NOT NULL,
    artist_id TEXT NOT NULL,
    PRIMARY KEY (artist_credit_id, artist_id),
    FOREIGN KEY (artist_credit_id) REFERENCES artist_credit(id),
    FOREIGN KEY (artist_id) REFERENCES artist(id)
)
";

const RELEASE_SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS release (
    id TEXT NOT NULL,
    artist_credit_id TEXT NOT NULL,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    total_tracks INTEGER NOT NULL,
    total_discs INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (artist_credit_id) REFERENCES artist_credit(id)
)
";

const SETTINGS_SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER NOT NULL,
    library_path TEXT NOT NULL,
    PRIMARY KEY (id)
)
";

pub struct Database;

impl Database {
    pub async fn migrate() -> Result<(), RusqliteError> {
        Database::create_artist_table().await?;
        Database::create_artist_credit_table().await?;
        Database::create_artist_credit_part_table().await?;
        Database::create_release_table().await?;
        Database::create_track_table().await?;
        Database::create_settings_table().await?;

        Ok(())
    }

    pub async fn rollback() -> Result<(), RusqliteError> {
        Database::drop_track_table().await?;
        Database::drop_release_table().await?;
        Database::drop_artist_credit_part_table().await?;
        Database::drop_artist_credit_table().await?;
        Database::drop_artist_table().await?;
        Database::drop_settings_table().await?;

        Ok(())
    }

    pub async fn create_track_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(TRACK_SCHEMA, [])?;

        Ok(())
    }

    pub async fn drop_track_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("DROP TABLE IF EXISTS track", [])?;

        Ok(())
    }

    pub async fn create_artist_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(ARTIST_SCHEMA, [])?;

        Ok(())
    }

    pub async fn drop_artist_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("DROP TABLE IF EXISTS artist", [])?;

        Ok(())
    }

    pub async fn create_artist_credit_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(ARTIST_CREDIT_SCHEMA, [])?;

        Ok(())
    }

    pub async fn drop_artist_credit_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("DROP TABLE IF EXISTS artist_credit", [])?;

        Ok(())
    }

    pub async fn create_artist_credit_part_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(ARTIST_CREDIT_PART_SCHEMA, [])?;

        Ok(())
    }

    pub async fn drop_artist_credit_part_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("DROP TABLE IF EXISTS artist_credit_part", [])?;

        Ok(())
    }

    pub async fn create_release_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(RELEASE_SCHEMA, [])?;

        Ok(())
    }

    pub async fn drop_release_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("DROP TABLE IF EXISTS release", [])?;

        Ok(())
    }

    pub async fn create_settings_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(SETTINGS_SCHEMA, [])?;

        Ok(())
    }

    pub async fn drop_settings_table() -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute("DROP TABLE IF EXISTS settings", [])?;

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

    pub async fn insert_artist_credit(artist_credit: &ArtistCredit) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(
            "INSERT INTO artist_credit (id, name) VALUES (?1, ?2)",
            rusqlite::params![artist_credit.id, artist_credit.name],
        )?;

        Ok(())
    }

    pub async fn insert_artist_credit_part(
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

    pub async fn insert_artist(artist: &Artist) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        connection.execute(
            "INSERT INTO artist (id, name) VALUES (?1, ?2)",
            rusqlite::params![artist.id, artist.name],
        )?;

        Ok(())
    }

    pub async fn insert_release(release: &Release) -> Result<(), RusqliteError> {
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

    pub async fn insert_track(track: &Track) -> Result<(), RusqliteError> {
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

    pub async fn select_release_by_id(release_id: &str) -> Result<Release, RusqliteError> {
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

    pub async fn select_all_releases() -> Result<Vec<Release>, RusqliteError> {
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

    pub async fn select_track_by_path(path: &str) -> Result<Track, RusqliteError> {
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

    pub async fn select_track_by_id(track_id: &str) -> Result<Track, RusqliteError> {
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

    pub async fn select_tracks_by_release_id(release_id: &str) -> Result<Vec<Track>, RusqliteError> {
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

    pub async fn select_artist_credit_by_id(artist_credit_id: &str) -> Result<ArtistCredit, RusqliteError> {
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

    pub async fn select_settings() -> Result<Settings, RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let settings = connection.query_row("SELECT * FROM settings WHERE id = ?1", [SETTINGS_ROW_ID], |row| {
            Ok(Settings {
                library_path: row.get(1)?,
            })
        })?;

        Ok(settings)
    }

    pub async fn update_settings(settings: &Settings) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let mut statement = connection.prepare("UPDATE settings SET library_path = ?1 WHERE id = ?2")?;
        statement.execute((&settings.library_path, SETTINGS_ROW_ID))?;

        Ok(())
    }

    pub async fn insert_settings(settings: &Settings) -> Result<(), RusqliteError> {
        let connection = DB_CONNECTION.get().unwrap().lock().await;
        let connection = connection.as_ref().unwrap();

        let mut statement = connection.prepare("INSERT INTO settings (id, library_path) VALUES (?1, ?2)")?;
        statement.execute((SETTINGS_ROW_ID, &settings.library_path))?;

        Ok(())
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

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub library_path: String,
}