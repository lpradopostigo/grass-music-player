use super::db_entities::{DbArtist, DbArtistCredit, DbArtistCreditPart, DbRelease, DbTrack};
use super::parser::{Parser, ParserError, ParserTrack};
use crate::global::try_get_cover_art_dir_path;
use crate::services::tag_reader::CoverArtExtension;
use anyhow::{anyhow, Result};
use image::imageops::FilterType;
use rusqlite::Connection;
use serde::Serialize;
use std::fs::{create_dir, create_dir_all, read, remove_dir_all, File};
use std::io::{Cursor, Write};
use std::path::Path;
use tauri::{Window, Wry};
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

pub struct LibraryManager<'a> {
    db_connection: &'a Connection,
}

impl<'a> LibraryManager<'a> {
    pub fn new(db_connection: &'a Connection) -> Self {
        Self { db_connection }
    }

    pub fn setup(&self) -> Result<()> {
        self.db_connection
            .execute(include_str!("../../sql/artist.sql"), [])?;
        self.db_connection
            .execute(include_str!("../../sql/artist_credit.sql"), [])?;
        self.db_connection
            .execute(include_str!("../../sql/artist_credit_part.sql"), [])?;
        self.db_connection
            .execute(include_str!("../../sql/release.sql"), [])?;
        self.db_connection
            .execute(include_str!("../../sql/track.sql"), [])?;

        let cover_art_dir_path = try_get_cover_art_dir_path();

        if !cover_art_dir_path.exists() {
            create_dir_all(cover_art_dir_path)?;
        }
        Ok(())
    }

    pub fn clear_data(&self) -> Result<()> {
        self.db_connection.execute("DELETE FROM track", [])?;
        self.db_connection.execute("DELETE FROM release", [])?;
        self.db_connection
            .execute("DELETE FROM artist_credit_part", [])?;
        self.db_connection
            .execute("DELETE FROM artist_credit", [])?;
        self.db_connection.execute("DELETE FROM artist", [])?;

        let cover_art_dir_path = try_get_cover_art_dir_path();

        if cover_art_dir_path.exists() {
            remove_dir_all(&cover_art_dir_path)?;
            create_dir(cover_art_dir_path)?;
        }

        Ok(())
    }

    fn create_thumbnail(data: &[u8]) -> Result<Vec<u8>> {
        let original_image = image::load_from_memory(data)?;

        let resized_image =
            original_image.resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, FilterType::CatmullRom);

        let mut thumbnail_output = Cursor::new(Vec::new());

        resized_image.write_to(&mut thumbnail_output, image::ImageOutputFormat::WebP)?;

        let thumbnail = thumbnail_output.into_inner();

        Ok(thumbnail)
    }

    fn cover_art_is_indexed(release_id: &str) -> bool {
        Self::get_cover_art_src(release_id).is_some()
            && Self::get_thumbnail_src(release_id).is_some()
    }

    fn index_cover_art(release_id: &str, data: &[u8], extension: &str) -> Result<()> {
        if Self::cover_art_is_indexed(release_id) {
            return Err(anyhow!("Cover art already indexed for {:?}", release_id));
        }

        let cover_art_dir_path = try_get_cover_art_dir_path();

        let cover_art_path = cover_art_dir_path.join(cover_art_filename!(release_id, extension));
        let thumbnail_path = cover_art_dir_path.join(thumbnail_filename!(release_id));

        let thumbnail = match Self::create_thumbnail(data) {
            Ok(thumbnail) => thumbnail,
            Err(_) => return Err(anyhow!("Failed to create thumbnail for {:?}", release_id)),
        };

        let mut picture_file = File::create(cover_art_path).unwrap();
        picture_file.write_all(data).unwrap();

        let mut thumbnail_file = File::create(thumbnail_path).unwrap();
        thumbnail_file.write_all(&thumbnail).unwrap();

        Ok(())
    }

    fn get_thumbnail_src(release_id: &str) -> Option<String> {
        let cover_art_dir_path = try_get_cover_art_dir_path();
        let thumbnail_path = cover_art_dir_path.join(thumbnail_filename!(&release_id));

        if thumbnail_path.exists() {
            Some(thumbnail_path.as_os_str().to_str().unwrap().to_string())
        } else {
            None
        }
    }

    fn get_cover_art_src(release_id: &str) -> Option<String> {
        let cover_art_dir_path = try_get_cover_art_dir_path();

        for extension in &EXTENSIONS {
            let file_path =
                cover_art_dir_path.join(cover_art_filename!(release_id, extension.to_string()));

            if file_path.exists() {
                return Some(file_path.as_os_str().to_str().unwrap().to_string());
            }
        }

        None
    }

    fn index_track(&self, track: &ParserTrack) {
        let new_track_artist_credit = DbArtistCredit {
            id: track.id.clone(),
            name: track.artist_credit_name.clone(),
        };

        if self
            .db_connection
            .execute(
                "INSERT INTO artist_credit (id, name) VALUES (?1, ?2)",
                (&new_track_artist_credit.id, &new_track_artist_credit.name),
            )
            .is_ok()
        {
            for artist in &track.artists {
                let new_artist = DbArtist {
                    id: artist.id.clone(),
                    name: artist.name.clone(),
                };
                self.db_connection
                    .execute(
                        "INSERT INTO artist (id, name) VALUES (?1, ?2)",
                        (&new_artist.id, &new_artist.name),
                    )
                    .ok();

                let new_artist_credit_part = DbArtistCreditPart {
                    artist_credit_id: new_track_artist_credit.id.clone(),
                    artist_id: new_artist.id.clone(),
                };

                self.db_connection.execute(
                    "INSERT INTO artist_credit_part (artist_credit_id, artist_id) VALUES (?1, ?2)",
                    (new_artist_credit_part.artist_credit_id, new_artist_credit_part.artist_id)
                ).ok();
            }
        }

        let new_release_artist_credit = DbArtistCredit {
            id: track.release_id.clone(),
            name: track.release_artist_credit_name.clone(),
        };

        if self
            .db_connection
            .execute(
                "INSERT INTO artist_credit (id, name) VALUES (?1, ?2)",
                (
                    &new_release_artist_credit.id,
                    &new_release_artist_credit.name,
                ),
            )
            .is_ok()
        {
            for artist in &track.release_artists {
                let new_release_artist = DbArtist {
                    id: artist.id.clone(),
                    name: artist.name.clone(),
                };

                self.db_connection
                    .execute(
                        "INSERT INTO artist (id, name) VALUES (?1, ?2)",
                        (&new_release_artist.id, &new_release_artist.name),
                    )
                    .ok();

                let new_release_artist_credit_part = DbArtistCreditPart {
                    artist_credit_id: new_release_artist_credit.id.clone(),
                    artist_id: artist.id.clone(),
                };

                self.db_connection.execute(
                    "INSERT INTO artist_credit_part (artist_credit_id, artist_id) VALUES (?1, ?2)",
                    (new_release_artist_credit_part.artist_credit_id, new_release_artist_credit_part.artist_id)
                ).ok();
            }

            let new_release = DbRelease {
                id: track.release_id.clone(),
                artist_credit_id: new_release_artist_credit.id,
                name: track.release_name.clone(),
                date: track.release_date.clone(),
                total_tracks: track.release_total_tracks,
                total_discs: track.release_total_discs,
            };

            self.db_connection.execute(
                "INSERT INTO release (id, artist_credit_id, name, date, total_tracks, total_discs) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
              (
                new_release.id,
                new_release.artist_credit_id,
                new_release.name,
                new_release.date,
                new_release.total_tracks,
                new_release.total_discs
              )
            ).ok();
        }

        let new_track = DbTrack {
            id: track.id.clone(),
            name: track.name.clone(),
            length: track.length,
            track_number: track.track_number,
            disc_number: track.disc_number,
            artist_credit_id: new_track_artist_credit.id.clone(),
            release_id: track.release_id.clone(),
            path: track.path.clone(),
        };

        self.db_connection.execute(
            "INSERT INTO track (id, release_id, artist_credit_id, name, length, track_number, disc_number, path) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
             (
                new_track.id,
                new_track.release_id,
                new_track.artist_credit_id,
                new_track.name,
                new_track.length,
                new_track.track_number,
                new_track.disc_number,
                new_track.path
             )
        ).ok();
    }

    pub fn add_file(&self, path: &str) -> Result<(), ParserError> {
        let parsed_track = Parser::parse_file(path)?;
        self.db_connection
            .execute("BEGIN TRANSACTION", [])
            .expect("Failed to begin transaction");
        self.index_track(&parsed_track);
        self.db_connection
            .execute("COMMIT", [])
            .expect("Failed to commit transaction");

        Ok(())
    }

    pub fn add_dir(&self, path: &str, window: Window<Wry>) -> Vec<ParserError> {
        let (parsed_tracks, parsing_errors) = Parser::parse_dir(path, |progress| {
            window
                .emit("library:scan-state", progress)
                .expect("Failed to emit scan state")
        });

        self.db_connection
            .execute("BEGIN TRANSACTION", [])
            .expect("Failed to begin transaction");

        for track in parsed_tracks.into_iter() {
            self.index_track(&track);
        }

        self.db_connection
            .execute("COMMIT", [])
            .expect("Failed to commit transaction");

        window
            .emit("library:scan-state", None::<()>)
            .expect("Failed to emit scan state");

        parsing_errors
    }

    pub fn scan_cover_art(&self) -> Result<()> {
        let mut release_ids_statement = self.db_connection.prepare("SELECT id FROM release")?;

        let release_ids = release_ids_statement
            .query_map([], |row| row.get(0))?
            .collect::<Result<Vec<String>, _>>()?;

        for id in release_ids {
            if LibraryManager::cover_art_is_indexed(&id) {
                continue;
            }

            let track_path: String = self.db_connection.query_row(
                "SELECT path FROM track WHERE release_id = ?1 LIMIT 1",
                [&id],
                |row| row.get(0),
            )?;

            let track_path = Path::new(&track_path);
            let release_path = track_path.parent().unwrap();

            for extension in &EXTENSIONS {
                let cover_art_path = release_path.join(format!("cover.{}", extension));
                if let Ok(cover_art) = read(cover_art_path) {
                    match LibraryManager::index_cover_art(&id, &cover_art, &extension.to_string()) {
                        Ok(_) => {}
                        Err(e) => println!("Failed to add cover art: {:?}", e),
                    };
                    break;
                }
            }
        }

        Ok(())
    }

    fn search_release_overviews(
        &self,
        query: Option<&str>,
        limit: bool,
    ) -> Result<Vec<ReleaseOverview>> {
        let sql = {
            let mut sql = String::from(
                "SELECT 'release'.id, 'release'.name, artist_credit.name FROM 'release' INNER JOIN artist_credit ON 'release'.artist_credit_id = artist_credit.id",
            );

            if let Some(query) = query {
                sql.push_str(&format!(" WHERE 'release'.name LIKE '{}'", query));
            }

            sql.push_str(" ORDER BY 'release'.name");

            if limit {
                sql.push_str(" LIMIT 10");
            }

            sql
        };

        let mut releases_statement = self.db_connection.prepare(&sql)?;

        let releases = releases_statement
            .query_map([], |row| {
                let release_id: String = row.get(0)?;
                let thumbnail_src = Self::get_thumbnail_src(&release_id);
                Ok(ReleaseOverview {
                    id: release_id,
                    name: row.get(1)?,
                    artist_credit_name: row.get(2)?,
                    thumbnail_src,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(releases)
    }

    fn search_artist_overviews(
        &self,
        query: Option<&str>,
        limit: bool,
    ) -> Result<Vec<ArtistOverview>> {
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

        let mut artists_statement = self.db_connection.prepare(&sql)?;

        let artists = artists_statement.query_map([], |row| {
            let artist_id: String = row.get(0)?;

            let thumbnail_srcs = {
                let mut release_ids_statement = self.db_connection.prepare(
                    "SELECT DISTINCT track.release_id FROM track INNER JOIN artist_credit_part ON artist_credit_part.artist_credit_id = track.artist_credit_id INNER JOIN artist ON artist.id = artist_credit_part.artist_id WHERE artist.id = ?1 UNION SELECT DISTINCT 'release'.id FROM 'release' INNER JOIN artist_credit_part ON artist_credit_part.artist_credit_id = 'release'.artist_credit_id INNER JOIN artist ON artist.id = artist_credit_part.artist_id WHERE artist.id = ?1 LIMIT 3",
                )?;

                let release_ids = release_ids_statement.query_map([&artist_id], |row| {
                    row.get(0)
                })?.collect::<Result<Vec<String>, _>>()?;

                let mut srcs = Vec::new();
                for release_id in release_ids {
                    let thumbnail_src = Self::get_thumbnail_src(&release_id);
                    if let Some(thumbnail_src) = thumbnail_src {
                        srcs.push(thumbnail_src);
                    }
                }
                srcs
            };

            Ok(ArtistOverview {
                id: artist_id,
                name: row.get(1)?,
                thumbnail_srcs,
            })
        })?.collect::<Result<Vec<_>, _>>()?;

        Ok(artists)
    }

    pub fn get_release_overviews(&self) -> Result<Vec<ReleaseOverview>> {
        self.search_release_overviews(None, false)
    }

    pub fn get_release(&self, release_id: &str) -> Result<Release> {
        let release = self.db_connection.query_row("SELECT 'release'.id, 'release'.artist_credit_id, artist_credit.name, 'release'.name, 'release'.date, 'release'.total_tracks, 'release'.total_discs FROM 'release' INNER JOIN artist_credit ON 'release'.artist_credit_id = artist_credit.id WHERE 'release'.id = ?1", [&release_id], |row|{
            let release_id: String = row.get(0)?;

            let mut statement = self.db_connection.prepare(
                "SELECT track.id, track.release_id, track.name, track.length, track.track_number, track.disc_number, track.path, artist_credit.name FROM track
                INNER JOIN artist_credit ON track.artist_credit_id = artist_credit.id
                WHERE track.release_id = ?1
                ORDER BY track.disc_number, track.track_number",
            )?;

            let track_iter = statement.query_map([&release_id], |row| {
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
            })?;

            let tracks = track_iter.collect::<Result<Vec<_>, _>>()?;

            let cover_art_src = Self::get_cover_art_src(&release_id);

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

    pub fn get_artists_overviews(&self) -> Result<Vec<ArtistOverview>> {
        self.search_artist_overviews(None, false)
    }

    pub fn get_artist(&self, artist_id: &str) -> Result<Artist> {
        let mut releases_statement = self.db_connection.prepare(
            "SELECT 'release'.id, 'release'.name, artist_credit.name FROM 'release' INNER JOIN artist_credit ON artist_credit.id = 'release'.artist_credit_id WHERE 'release'.id IN (SELECT DISTINCT track.release_id FROM track INNER JOIN artist_credit_part ON artist_credit_part.artist_credit_id = track.artist_credit_id INNER JOIN artist ON artist.id = artist_credit_part.artist_id WHERE artist.id = ?1)  OR 'release'.id IN (SELECT 'release'.id
                       FROM 'release'
                                INNER JOIN artist_credit_part
                                           ON artist_credit_part.artist_credit_id = 'release'.artist_credit_id
                                INNER JOIN artist ON artist.id = artist_credit_part.artist_id
                       WHERE artist.id = ?1)",
        )?;

        let mut background_src = None;

        let releases_iter = releases_statement.query_map([&artist_id], |row| {
            let release_id: String = row.get(0)?;
            let thumbnail_src = Self::get_thumbnail_src(&release_id);

            if background_src.is_none() && thumbnail_src.is_some() {
                background_src = Self::get_cover_art_src(&release_id);
            }

            Ok(ReleaseOverview {
                id: release_id,
                name: row.get(1)?,
                artist_credit_name: row.get(2)?,
                thumbnail_src,
            })
        })?;

        let releases = releases_iter.collect::<Result<Vec<_>, _>>()?;

        let mut artist_statement = self
            .db_connection
            .prepare("SELECT id, name FROM artist WHERE id = ?1")?;

        let artist = artist_statement.query_row([&artist_id], |row| {
            Ok(Artist {
                id: row.get(0)?,
                name: row.get(1)?,
                releases,
                background_src,
            })
        })?;

        Ok(artist)
    }

    pub fn get_player_track(&self, track_path: &str) -> Result<PlayerTrack> {
        let track = self.db_connection.query_row(
            "SELECT track.id, track.release_id, 'release'.name, track.name, artist_credit.name, artist_credit.id FROM track INNER JOIN artist_credit ON track.artist_credit_id = artist_credit.id INNER JOIN 'release' ON track.release_id = 'release'.id WHERE track.path = ?1",
            [&track_path],
            |row| {
                let release_id: String = row.get(1)?;
                let thumbnail_src = Self::get_thumbnail_src(&release_id);

                let artist_credit_id: String = row.get(5)?;

                let mut artists_statement = self.db_connection.prepare(
                    "SELECT artist.id, artist.name FROM artist INNER JOIN artist_credit_part ON artist_credit_part.artist_id = artist.id WHERE artist_credit_part.artist_credit_id = ?1",
                )?;

                let artists = artists_statement.query_map(
                    [&artist_credit_id],
                    |row| {
                        Ok(DbArtist {
                            id: row.get(0)?,
                            name: row.get(1)?,})
                    }
                )?.collect::<Result<Vec<_>, _>>()?;

                Ok(PlayerTrack {
                    release_id,
                    thumbnail_src,
                    id: row.get(0)?,
                    release_name: row.get(2)?,
                    name: row.get(3)?,
                    artist_credit_name: row.get(4)?,
                    artists,
                })
            },
        )?;

        Ok(track)
    }

    pub fn search(&self, query: &str) -> Result<SearchResult> {
        let query = format!("%{}%", query.trim());

        Ok(SearchResult {
            releases: self.search_release_overviews(Some(&query), true)?,
            artists: self.search_artist_overviews(Some(&query), true)?,
        })
    }

    pub fn get_preferred_cover_art_position(release_id: &str) -> Result<CoverArtPosition> {
        let picture_size = 120;
        let picture = Self::get_thumbnail_src(release_id)
            .ok_or_else(|| anyhow!("Thumbnail not found for {:?}", release_id))?;
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
