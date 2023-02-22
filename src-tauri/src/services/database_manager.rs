use rusqlite::{Connection, Error as RusqliteError};
use serde::Serialize;
use ts_rs::TS;

pub struct DatabaseManager<'a> {
    connection: &'a Connection,
}

impl<'a> DatabaseManager<'a> {
    pub fn new(connection: &'a Connection) -> Self {
        Self { connection }
    }

    pub fn create_track_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute(include_str!("../../sql/track.sql"), [])?;
        Ok(())
    }

    pub fn drop_track_table(&self) -> Result<(), RusqliteError> {
        self.connection.execute("DROP TABLE IF EXISTS track", [])?;
        Ok(())
    }

    pub fn create_artist_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute(include_str!("../../sql/artist.sql"), [])?;
        Ok(())
    }

    pub fn drop_artist_table(&self) -> Result<(), RusqliteError> {
        self.connection.execute("DROP TABLE IF EXISTS artist", [])?;
        Ok(())
    }

    pub fn create_artist_credit_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute(include_str!("../../sql/artist_credit.sql"), [])?;
        Ok(())
    }

    pub fn drop_artist_credit_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute("DROP TABLE IF EXISTS artist_credit", [])?;
        Ok(())
    }

    pub fn create_artist_credit_part_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute(include_str!("../../sql/artist_credit_part.sql"), [])?;
        Ok(())
    }

    pub fn drop_artist_credit_part_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute("DROP TABLE IF EXISTS artist_credit_part", [])?;
        Ok(())
    }

    pub fn create_release_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute(include_str!("../../sql/release.sql"), [])?;
        Ok(())
    }

    pub fn drop_release_table(&self) -> Result<(), RusqliteError> {
        self.connection
            .execute("DROP TABLE IF EXISTS release", [])?;
        Ok(())
    }

    pub fn begin_transaction(&self) -> Result<(), RusqliteError> {
        self.connection.execute("BEGIN TRANSACTION", [])?;
        Ok(())
    }

    pub fn commit_transaction(&self) -> Result<(), RusqliteError> {
        self.connection.execute("COMMIT TRANSACTION", [])?;
        Ok(())
    }

    pub fn insert_artist_credit(&self, artist_credit: &ArtistCredit) -> Result<(), RusqliteError> {
        self.connection.execute(
            "INSERT INTO artist_credit (id, name) VALUES (?1, ?2)",
            rusqlite::params![artist_credit.id, artist_credit.name],
        )?;
        Ok(())
    }

    pub fn insert_artist_credit_part(
        &self,
        artist_credit_part: &ArtistCreditPart,
    ) -> Result<(), RusqliteError> {
        self.connection.execute(
            "INSERT INTO artist_credit_part (artist_credit_id, artist_id) VALUES (?1, ?2)",
            rusqlite::params![
                artist_credit_part.artist_credit_id,
                artist_credit_part.artist_id
            ],
        )?;
        Ok(())
    }

    pub fn insert_artist(&self, artist: &Artist) -> Result<(), RusqliteError> {
        self.connection.execute(
            "INSERT INTO artist (id, name) VALUES (?1, ?2)",
            rusqlite::params![artist.id, artist.name],
        )?;
        Ok(())
    }

    pub fn insert_release(&self, release: &Release) -> Result<(), RusqliteError> {
        self.connection.execute(
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

    pub fn insert_track(&self, track: &Track) -> Result<(), RusqliteError> {
        self.connection.execute(
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

    pub fn select_release_by_id(&self, release_id: &str) -> Result<Release, RusqliteError> {
        let release = self.connection.query_row(
            "SELECT * FROM release WHERE id = ?1",
            [release_id],
            |row| {
                Ok(Release {
                    id: row.get(0)?,
                    artist_credit_id: row.get(1)?,
                    name: row.get(2)?,
                    date: row.get(3)?,
                    total_tracks: row.get(4)?,
                    total_discs: row.get(5)?,
                })
            },
        )?;

        Ok(release)
    }

    pub fn select_all_releases(&self) -> Result<Vec<Release>, RusqliteError> {
        let mut statement = self.connection.prepare("SELECT * FROM release")?;
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

    pub fn select_track_by_path(&self, path: &str) -> Result<Track, RusqliteError> {
        let track =
            self.connection
                .query_row("SELECT * FROM track WHERE path = ?1", [path], |row| {
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

    pub fn select_track_by_id(&self, track_id: &str) -> Result<Track, RusqliteError> {
        let track =
            self.connection
                .query_row("SELECT * FROM track WHERE id = ?1", [track_id], |row| {
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

    pub fn select_tracks_by_release_id(
        &self,
        release_id: &str,
    ) -> Result<Vec<Track>, RusqliteError> {
        let mut statement = self
            .connection
            .prepare("SELECT * FROM track WHERE release_id = ?1")?;
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

    pub fn select_artist_credit_by_id(
        &self,
        artist_credit_id: &str,
    ) -> Result<ArtistCredit, RusqliteError> {
        let artist_credit = self.connection.query_row(
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
