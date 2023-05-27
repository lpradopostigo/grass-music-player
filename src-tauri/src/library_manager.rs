use super::database::Database;
use super::database::{DbArtist, DbArtistCredit, DbArtistCreditPart, DbRelease, DbTrack};
use super::tag_reader::CoverArtExtension;
use crate::scanner::ScannerRelease;
use anyhow::Context;
use image::imageops::FilterType;
use r2d2::PooledConnection;
use r2d2_sqlite::SqliteConnectionManager;
use serde::Serialize;
use std::fs::{create_dir, create_dir_all, remove_dir_all, File};
use std::io::{Cursor, Write};
use std::path::{Path, PathBuf};
use ts_rs::TS;

const THUMBNAIL_SIZE: u32 = 320;
static EXTENSIONS: [CoverArtExtension; 2] = [CoverArtExtension::Jpeg, CoverArtExtension::Png];

macro_rules! cover_art_filename {
    ($release_id:expr, $extension:expr) => {
        format!("{}.{}", $release_id, $extension)
    };
}

macro_rules! thumbnail_filename {
    ($release_id:expr) => {
        format!("{}_thumbnail.webp", $release_id)
    };
}

pub struct LibraryManager {
    db: Database,
    cover_art_dir: PathBuf,
}

impl LibraryManager {
    pub fn new(db: Database, cover_art_dir: &Path) -> anyhow::Result<Self> {
        if cover_art_dir.exists() {
            create_dir_all(cover_art_dir)?;
        }

        Ok(Self {
            db,
            cover_art_dir: cover_art_dir.into(),
        })
    }

    pub fn clear_data(&self) -> anyhow::Result<()> {
        let db_connection = self.db.get_connection()?;

        db_connection.execute("DELETE FROM track", [])?;
        db_connection.execute("DELETE FROM release", [])?;
        db_connection.execute("DELETE FROM artist_credit_part", [])?;
        db_connection.execute("DELETE FROM artist_credit", [])?;
        db_connection.execute("DELETE FROM artist", [])?;

        self.clear_cover_art_data()?;

        Ok(())
    }

    pub fn clear_cover_art_data(&self) -> anyhow::Result<()> {
        if self.cover_art_dir.exists() {
            remove_dir_all(&self.cover_art_dir)?;
            create_dir(&self.cover_art_dir)?;
        }
        Ok(())
    }

    fn create_thumbnail(data: &[u8]) -> anyhow::Result<Vec<u8>> {
        let original_image = image::load_from_memory(data)?;

        let resized_image =
            original_image.resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, FilterType::CatmullRom);

        let mut thumbnail_output = Cursor::new(Vec::new());

        resized_image.write_to(&mut thumbnail_output, image::ImageOutputFormat::WebP)?;

        let thumbnail = thumbnail_output.into_inner();

        Ok(thumbnail)
    }

    fn cover_art_is_indexed(&self, release_id: &str) -> anyhow::Result<bool> {
        Ok(self.get_cover_art_src(release_id)?.is_some()
            && self.get_thumbnail_src(release_id)?.is_some())
    }

    fn index_cover_art(
        &self,
        release_id: &str,
        data: &[u8],
        extension: &str,
    ) -> anyhow::Result<()> {
        if self.cover_art_is_indexed(release_id)? {
            anyhow::bail!("Cover art already indexed for {:?}", release_id)
        }

        let cover_art_path = &self
            .cover_art_dir
            .join(cover_art_filename!(release_id, extension));
        let thumbnail_path = &self.cover_art_dir.join(thumbnail_filename!(release_id));

        let thumbnail = Self::create_thumbnail(data)?;

        let mut picture_file = File::create(cover_art_path)?;
        picture_file.write_all(data)?;

        let mut thumbnail_file = File::create(thumbnail_path)?;
        thumbnail_file.write_all(&thumbnail)?;

        Ok(())
    }

    fn get_thumbnail_src(&self, release_id: &str) -> anyhow::Result<Option<String>> {
        let thumbnail_path = self.cover_art_dir.join(thumbnail_filename!(&release_id));

        if thumbnail_path.exists() {
            Ok(Some(
                thumbnail_path
                    .as_os_str()
                    .to_str()
                    .context("Failed to convert path to string")?
                    .to_string(),
            ))
        } else {
            Ok(None)
        }
    }

    fn get_cover_art_src(&self, release_id: &str) -> anyhow::Result<Option<String>> {
        for extension in &EXTENSIONS {
            let file_path = self
                .cover_art_dir
                .join(cover_art_filename!(release_id, extension.to_string()));

            if file_path.exists() {
                return Ok(Some(
                    file_path
                        .as_os_str()
                        .to_str()
                        .context("Failed to convert path to string")?
                        .to_string(),
                ));
            }
        }

        Ok(None)
    }

    fn index_release(
        &self,
        db_connection: &PooledConnection<SqliteConnectionManager>,
        release: &ScannerRelease,
    ) -> anyhow::Result<()> {
        let mut insert_artist_credit_stmt =
            db_connection.prepare_cached("INSERT INTO artist_credit (id, name) VALUES (?1, ?2)")?;

        let mut insert_artist_stmt =
            db_connection.prepare_cached("INSERT INTO artist (id, name) VALUES (?1, ?2)")?;

        let mut insert_artist_credit_part_stmt = db_connection.prepare_cached(
            "INSERT INTO artist_credit_part (artist_credit_id, artist_id) VALUES (?1, ?2)",
        )?;

        let mut insert_release_stmt =db_connection.prepare_cached("INSERT INTO release (id, artist_credit_id, name, date, total_tracks, total_discs) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")?;

        let mut insert_track_stmt =db_connection.prepare_cached("INSERT INTO track (id, release_id, artist_credit_id, name, length, track_number, disc_number, path) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)")?;

        let new_release_artist_credit = DbArtistCredit {
            id: release.id.clone(),
            name: release.artist_credit_name.clone(),
        };

        if insert_artist_credit_stmt
            .execute((
                &new_release_artist_credit.id,
                &new_release_artist_credit.name,
            ))
            .is_ok()
        {
            for artist in &release.artists {
                let new_release_artist = DbArtist {
                    id: artist.id.clone(),
                    name: artist.name.clone(),
                };

                insert_artist_stmt
                    .execute((&new_release_artist.id, &new_release_artist.name))
                    .ok();

                let new_release_artist_credit_part = DbArtistCreditPart {
                    artist_credit_id: new_release_artist_credit.id.clone(),
                    artist_id: artist.id.clone(),
                };

                insert_artist_credit_part_stmt
                    .execute((
                        new_release_artist_credit_part.artist_credit_id,
                        new_release_artist_credit_part.artist_id,
                    ))
                    .ok();
            }

            let new_release = DbRelease {
                id: release.id.clone(),
                artist_credit_id: new_release_artist_credit.id,
                name: release.name.clone(),
                date: release.date.clone(),
                total_tracks: release.total_tracks,
                total_discs: release.total_discs,
            };

            insert_release_stmt
                .execute((
                    new_release.id,
                    new_release.artist_credit_id,
                    new_release.name,
                    new_release.date,
                    new_release.total_tracks,
                    new_release.total_discs,
                ))
                .ok();
        }

        if let Some(cover_art) = &release.cover_art {
            self.index_cover_art(
                &release.id,
                &cover_art.data,
                &cover_art.extension.to_string(),
            )
            .ok();
        }

        for track in release.tracks.iter() {
            let new_track_artist_credit = DbArtistCredit {
                id: track.id.clone(),
                name: track.artist_credit_name.clone(),
            };

            if insert_artist_credit_stmt
                .execute((&new_track_artist_credit.id, &new_track_artist_credit.name))
                .is_ok()
            {
                for artist in &track.artists {
                    let new_artist = DbArtist {
                        id: artist.id.clone(),
                        name: artist.name.clone(),
                    };

                    insert_artist_stmt
                        .execute((&new_artist.id, &new_artist.name))
                        .ok();

                    let new_artist_credit_part = DbArtistCreditPart {
                        artist_credit_id: new_track_artist_credit.id.clone(),
                        artist_id: new_artist.id.clone(),
                    };

                    insert_artist_credit_part_stmt
                        .execute((
                            new_artist_credit_part.artist_credit_id,
                            new_artist_credit_part.artist_id,
                        ))
                        .ok();
                }
            }

            let new_track = DbTrack {
                id: track.id.clone(),
                name: track.name.clone(),
                length: track.length,
                track_number: track.track_number,
                disc_number: track.disc_number,
                artist_credit_id: new_track_artist_credit.id,
                release_id: release.id.clone(),
                path: track
                    .path
                    .to_str()
                    .context("Failed to convert path to string")?
                    .to_string(),
            };

            insert_track_stmt
                .execute((
                    new_track.id,
                    new_track.release_id,
                    new_track.artist_credit_id,
                    new_track.name,
                    new_track.length,
                    new_track.track_number,
                    new_track.disc_number,
                    new_track.path,
                ))
                .ok();
        }

        Ok(())
    }

    pub fn add_releases<F>(
        &self,
        releases: &[ScannerRelease],
        progress_callback: F,
    ) -> anyhow::Result<()>
    where
        F: Fn((usize, usize)),
    {
        let db_connection = self.db.get_connection()?;

        db_connection.execute("BEGIN TRANSACTION", [])?;

        for (index, release) in releases.iter().enumerate() {
            progress_callback((index + 1, releases.len()));
            self.index_release(&db_connection, release)?;
        }

        db_connection.execute("COMMIT", [])?;

        Ok(())
    }

    fn search_release_overviews(
        &self,
        query: Option<&str>,
        limit: bool,
    ) -> anyhow::Result<Vec<ReleaseOverview>> {
        let sql = {
            let mut sql = String::from("SELECT 'release'.id, 'release'.name, artist_credit.name FROM 'release' INNER JOIN artist_credit ON 'release'.artist_credit_id = artist_credit.id",);

            if let Some(query) = query {
                sql.push_str(&format!(" WHERE 'release'.name LIKE '{}'", query));
            }

            sql.push_str(" ORDER BY 'release'.name");

            if limit {
                sql.push_str(" LIMIT 10");
            }

            sql
        };

        let db_connection = self.db.get_connection()?;

        let mut select_releases_stmt = db_connection.prepare_cached(&sql)?;
        let mut rows = select_releases_stmt.query([])?;
        let mut releases = Vec::new();

        while let Some(row) = rows.next()? {
            let release_id: String = row.get(0)?;
            let thumbnail_src = self.get_thumbnail_src(&release_id)?;
            releases.push(ReleaseOverview {
                id: release_id,
                name: row.get(1)?,
                artist_credit_name: row.get(2)?,
                thumbnail_src,
            });
        }

        Ok(releases)
    }

    fn search_artist_overviews(
        &self,
        query: Option<&str>,
        limit: bool,
    ) -> anyhow::Result<Vec<ArtistOverview>> {
        let sql = {
            let mut sql = String::from("SELECT id, name FROM artist");

            if let Some(query) = query {
                sql.push_str(&format!(" WHERE artist.name LIKE '{}'", query));
            }

            sql.push_str(" ORDER BY artist.name");

            if limit {
                sql.push_str(" LIMIT 10");
            }

            sql
        };

        let db_connection = self.db.get_connection()?;

        let mut select_artists_stmt = db_connection.prepare_cached(&sql)?;
        let mut select_artist_release_ids_stmt = db_connection.prepare_cached("SELECT DISTINCT track.release_id FROM track INNER JOIN artist_credit_part ON artist_credit_part.artist_credit_id = track.artist_credit_id INNER JOIN artist ON artist.id = artist_credit_part.artist_id WHERE artist.id = ?1 UNION SELECT DISTINCT 'release'.id FROM 'release' INNER JOIN artist_credit_part ON artist_credit_part.artist_credit_id = 'release'.artist_credit_id INNER JOIN artist ON artist.id = artist_credit_part.artist_id WHERE artist.id = ?1 LIMIT 3")?;

        let artists = select_artists_stmt
            .query_map([], |row| {
                let artist_id: String = row.get(0)?;

                let mut thumbnail_srcs = vec![];

                let release_ids = select_artist_release_ids_stmt
                    .query_map([&artist_id], |row| row.get(0))?
                    .collect::<Result<Vec<String>, _>>()?;

                for release_id in release_ids {
                    let thumbnail_src = self.get_thumbnail_src(&release_id).unwrap();
                    if let Some(thumbnail_src) = thumbnail_src {
                        thumbnail_srcs.push(thumbnail_src);
                    }
                }

                Ok(ArtistOverview {
                    id: artist_id,
                    name: row.get(1)?,
                    thumbnail_srcs,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(artists)
    }

    pub fn get_release_overviews(&self) -> anyhow::Result<Vec<ReleaseOverview>> {
        self.search_release_overviews(None, false)
    }

    pub fn get_release(&self, release_id: &str) -> anyhow::Result<Release> {
        let db_connection = self.db.get_connection()?;

        let mut select_release_stmt = db_connection.prepare_cached("SELECT 'release'.id, 'release'.artist_credit_id, artist_credit.name, 'release'.name, 'release'.date, 'release'.total_tracks, 'release'.total_discs FROM 'release' INNER JOIN artist_credit ON 'release'.artist_credit_id = artist_credit.id WHERE 'release'.id = ?1")?;

        let mut select_release_tracks_smt = db_connection.prepare_cached("SELECT track.id, track.release_id, track.name, track.length, track.track_number, track.disc_number, track.path, artist_credit.name FROM track INNER JOIN artist_credit ON track.artist_credit_id = artist_credit.id WHERE track.release_id = ?1 ORDER BY track.disc_number, track.track_number")?;

        let release = select_release_stmt.query_row([&release_id], |row| {
            let release_id: String = row.get(0)?;

            let tracks = select_release_tracks_smt
                .query_map([&release_id], |row| {
                    Ok(ReleaseTrack {
                        id: row.get(0)?,
                        release_id: row.get(1)?,
                        name: row.get(2)?,
                        length: row.get(3)?,
                        track_number: row.get(4)?,
                        disc_number: row.get(5)?,
                        path: row.get(6)?,
                        artist_credit_name: row.get(7)?,
                    })
                })?
                .collect::<Result<Vec<_>, _>>()?;

            let cover_art_src = self.get_cover_art_src(&release_id).unwrap();

            Ok(Release {
                id: release_id,
                artist_credit_id: row.get(1)?,
                artist_credit_name: row.get(2)?,
                name: row.get(3)?,
                date: row.get(4)?,
                total_tracks: row.get(5)?,
                total_discs: row.get(6)?,
                tracks,
                cover_art_src,
            })
        })?;

        Ok(release)
    }

    pub fn get_artist_overviews(&self) -> anyhow::Result<Vec<ArtistOverview>> {
        self.search_artist_overviews(None, false)
    }

    pub fn get_artist(&self, artist_id: &str) -> anyhow::Result<Artist> {
        let db_connection = self.db.get_connection()?;

        let mut select_artist_releases_stmt = db_connection.prepare_cached("SELECT 'release'.id, 'release'.name, artist_credit.name FROM 'release' INNER JOIN artist_credit ON artist_credit.id = 'release'.artist_credit_id WHERE 'release'.id IN (SELECT DISTINCT track.release_id FROM track INNER JOIN artist_credit_part ON artist_credit_part.artist_credit_id = track.artist_credit_id INNER JOIN artist ON artist.id = artist_credit_part.artist_id WHERE artist.id = ?1)  OR 'release'.id IN (SELECT 'release'.id FROM 'release' INNER JOIN artist_credit_part ON artist_credit_part.artist_credit_id = 'release'.artist_credit_id INNER JOIN artist ON artist.id = artist_credit_part.artist_id WHERE artist.id = ?1)",)?;

        let mut select_artist_stmt =
            db_connection.prepare_cached("SELECT id, name FROM artist WHERE id = ?1")?;

        let mut background_src = None;

        let releases = select_artist_releases_stmt
            .query_map([&artist_id], |row| {
                let release_id: String = row.get(0)?;
                let thumbnail_src = self.get_thumbnail_src(&release_id).unwrap();

                if background_src.is_none() && thumbnail_src.is_some() {
                    background_src = self.get_cover_art_src(&release_id).unwrap();
                }

                Ok(ReleaseOverview {
                    id: release_id,
                    name: row.get(1)?,
                    artist_credit_name: row.get(2)?,
                    thumbnail_src,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        let artist = select_artist_stmt.query_row([&artist_id], |row| {
            Ok(Artist {
                id: row.get(0)?,
                name: row.get(1)?,
                releases,
                background_src,
            })
        })?;

        Ok(artist)
    }

    pub fn get_player_track(&self, track_path: &str) -> anyhow::Result<PlayerTrack> {
        let db_connection = self.db.get_connection()?;

        let mut select_track_stmt = db_connection.prepare_cached("SELECT track.id, track.release_id, 'release'.name, track.name, artist_credit.name, artist_credit.id FROM track INNER JOIN artist_credit ON track.artist_credit_id = artist_credit.id INNER JOIN 'release' ON track.release_id = 'release'.id WHERE track.path = ?1")?;

        let mut select_track_artists_stmt = db_connection.prepare_cached("SELECT artist.id, artist.name FROM artist INNER JOIN artist_credit_part ON artist_credit_part.artist_id = artist.id WHERE artist_credit_part.artist_credit_id = ?1",)?;

        let track = select_track_stmt.query_row([&track_path], |row| {
            let release_id: String = row.get(1)?;
            let thumbnail_src = self.get_thumbnail_src(&release_id).unwrap();

            let artist_credit_id: String = row.get(5)?;

            let artists = select_track_artists_stmt
                .query_map([&artist_credit_id], |row| {
                    Ok(DbArtist {
                        id: row.get(0)?,
                        name: row.get(1)?,
                    })
                })?
                .collect::<Result<Vec<_>, _>>()?;

            Ok(PlayerTrack {
                release_id,
                thumbnail_src,
                id: row.get(0)?,
                release_name: row.get(2)?,
                name: row.get(3)?,
                artist_credit_name: row.get(4)?,
                artists,
            })
        })?;

        Ok(track)
    }

    pub fn search(&self, query: &str) -> anyhow::Result<SearchResult> {
        let query = format!("%{}%", query.trim());

        Ok(SearchResult {
            releases: self.search_release_overviews(Some(&query), true)?,
            artists: self.search_artist_overviews(Some(&query), true)?,
        })
    }

    pub fn get_preferred_cover_art_position(
        &self,
        release_id: &str,
    ) -> anyhow::Result<CoverArtPosition> {
        let picture_size = 120;
        let picture = self
            .get_thumbnail_src(release_id)?
            .context("No thumbnail found")?;
        let picture = image::open(picture)?;
        let picture = picture.resize_exact(picture_size, picture_size, FilterType::Nearest);

        let pixels = picture.to_rgb8();

        let luminance = |pixel: &image::Rgb<u8>| {
            let r = pixel[0] as f64;
            let g = pixel[1] as f64;
            let b = pixel[2] as f64;
            (0.299 * r + 0.587 * g + 0.115 * b).floor() as u8
        };

        let pixel_count = picture_size * picture_size;
        let partition_pixel_count = pixel_count / 3;

        let entropy = |partition: &[Vec<u8>]| {
            let mut entropy = 0f64;
            let mut histogram = [0u32; 256];

            let p_x = |n: u32| (n as f64) / (partition_pixel_count as f64);

            for row in partition {
                for luminance in row {
                    histogram[*luminance as usize] += 1;
                }
            }

            for count in histogram {
                if count > 0 {
                    let p_count = p_x(count);
                    entropy += p_count * p_count.log2();
                }
            }

            -entropy
        };

        let rows: Vec<Vec<u8>> = pixels
            .enumerate_rows()
            .map(|(_, pixels)| pixels.map(|(_, _, pixel)| luminance(pixel)).collect())
            .collect();

        let partitions = rows.chunks((picture_size / 3) as usize).collect::<Vec<_>>();

        let entropies = partitions.iter().map(|partition| entropy(partition));

        let max_value_index = entropies
            .enumerate()
            .max_by(|(_, a), (_, b)| a.partial_cmp(b).expect("Unexpected value"))
            .map(|(i, _)| i);

        match max_value_index {
            Some(0) => Ok(CoverArtPosition::Top),
            Some(1) => Ok(CoverArtPosition::Center),
            Some(2) => Ok(CoverArtPosition::Bottom),
            _ => panic!("Unexpected value"),
        }
    }
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseOverview {
    pub id: String,
    pub name: String,
    pub artist_credit_name: String,
    pub thumbnail_src: Option<String>,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseTrack {
    pub id: String,
    pub release_id: String,
    pub name: String,
    pub artist_credit_name: String,
    pub length: f64,
    pub track_number: u16,
    pub disc_number: u16,
    pub path: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Release {
    pub id: String,
    pub artist_credit_id: String,
    pub artist_credit_name: String,
    pub name: String,
    pub date: String,
    pub total_tracks: u16,
    pub total_discs: u16,
    pub tracks: Vec<ReleaseTrack>,
    pub cover_art_src: Option<String>,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct ArtistOverview {
    pub id: String,
    pub name: String,
    pub thumbnail_srcs: Vec<String>,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Artist {
    pub id: String,
    pub name: String,
    pub releases: Vec<ReleaseOverview>,
    pub background_src: Option<String>,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct PlayerTrack {
    pub id: String,
    pub release_id: String,
    pub release_name: String,
    pub name: String,
    pub artist_credit_name: String,
    pub artists: Vec<DbArtist>,
    pub thumbnail_src: Option<String>,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub enum CoverArtPosition {
    Top,
    Center,
    Bottom,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    releases: Vec<ReleaseOverview>,
    artists: Vec<ArtistOverview>,
}
