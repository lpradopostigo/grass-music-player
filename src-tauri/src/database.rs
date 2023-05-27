use r2d2::{Pool, PooledConnection};
use r2d2_sqlite::SqliteConnectionManager;
use serde::Serialize;
use std::path::PathBuf;
use ts_rs::TS;

pub struct Database {
    pool: Pool<SqliteConnectionManager>,
}

impl Database {
    pub fn new(path: &PathBuf) -> anyhow::Result<Database> {
        let manager = SqliteConnectionManager::file(path).with_init(|connection| {
            connection.set_prepared_statement_cache_capacity(20);
            Ok(())
        });

        let pool = Pool::builder()
            .max_size(5)
            .min_idle(Some(1))
            .build(manager)?;

        let db = Database { pool };
        db.migrate_up()?;

        Ok(db)
    }

    fn migrate_up(&self) -> anyhow::Result<()> {
        let db_connection = self.pool.get()?;

        db_connection.execute(include_str!("../migrations/artist/up.sql"), [])?;
        db_connection.execute(include_str!("../migrations/artist_credit/up.sql"), [])?;
        db_connection.execute(include_str!("../migrations/artist_credit_part/up.sql"), [])?;
        db_connection.execute(include_str!("../migrations/release/up.sql"), [])?;
        db_connection.execute(include_str!("../migrations/track/up.sql"), [])?;

        Ok(())
    }

    fn migrate_down(&self) -> anyhow::Result<()> {
        let db_connection = self.pool.get()?;

        db_connection.execute(include_str!("../migrations/track/down.sql"), [])?;
        db_connection.execute(include_str!("../migrations/release/down.sql"), [])?;
        db_connection.execute(
            include_str!("../migrations/artist_credit_part/down.sql"),
            [],
        )?;
        db_connection.execute(include_str!("../migrations/artist_credit/down.sql"), [])?;
        db_connection.execute(include_str!("../migrations/artist/down.sql"), [])?;

        Ok(())
    }

    pub fn get_connection(&self) -> anyhow::Result<PooledConnection<SqliteConnectionManager>> {
        Ok(self.pool.get()?)
    }
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbArtist {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbArtistCredit {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbArtistCreditPart {
    pub artist_credit_id: String,
    pub artist_id: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbRelease {
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
pub struct DbTrack {
    pub id: String,
    pub release_id: String,
    pub artist_credit_id: String,
    pub name: String,
    pub length: f64,
    pub track_number: u16,
    pub disc_number: u16,
    pub path: String,
}
