mod cover_art_repository;
mod database;
mod parser;
mod tag_reader;

use cover_art_repository::CoverArtRepository;
use database::Database;
pub use database::{Artist, ArtistCredit, ArtistCreditPart, Release, Track};
use parser::{parse_dir, parse_file, Error as ParserError, Track as ParserTrack};
use std::fs::read;
use std::path::Path;

pub struct Library;

impl Library {
    async fn index_track(track: &ParserTrack) {
        let new_track_artist_credit = ArtistCredit {
            id: track.id.clone(),
            name: track.artist_credit_name.clone(),
        };

        if Database::add_artist_credit(&new_track_artist_credit)
            .await
            .is_ok()
        {
            for artist in &track.artists {
                let new_artist = Artist {
                    id: artist.id.clone(),
                    name: artist.name.clone(),
                };
                Database::add_artist(&new_artist).await.ok();

                let new_artist_credit_part = ArtistCreditPart {
                    artist_credit_id: new_track_artist_credit.id.clone(),
                    artist_id: new_artist.id.clone(),
                };
                Database::add_artist_credit_part(&new_artist_credit_part)
                    .await
                    .ok();
            }
        }

        let new_release_artist_credit = ArtistCredit {
            id: track.release_id.clone(),
            name: track.release_artist_credit_name.clone(),
        };

        if Database::add_artist_credit(&new_release_artist_credit)
            .await
            .is_ok()
        {
            for artist in &track.release_artists {
                let new_artist_credit_part = ArtistCreditPart {
                    artist_credit_id: new_release_artist_credit.id.clone(),
                    artist_id: artist.id.clone(),
                };
                Database::add_artist_credit_part(&new_artist_credit_part)
                    .await
                    .ok();
            }

            let new_release = Release {
                id: track.release_id.clone(),
                artist_credit_id: new_release_artist_credit.id.clone(),
                name: track.release_name.clone(),
                date: track.release_date.clone(),
                total_tracks: track.release_total_tracks,
                total_discs: track.release_total_discs,
            };
            Database::add_release(&new_release).await.ok();
        }

        let new_track = Track {
            id: track.id.clone(),
            name: track.name.clone(),
            length: track.length,
            track_number: track.track_number,
            disc_number: track.disc_number,
            artist_credit_id: new_track_artist_credit.id.clone(),
            release_id: track.release_id.clone(),
            path: track.path.clone(),
        };

        Database::add_track(&new_track).await.ok();
    }

    pub async fn setup() {
        let repository_dir = CoverArtRepository::cover_art_dir();
        if !repository_dir.exists() {
            std::fs::create_dir_all(repository_dir).unwrap();
        }

        Database::migrate().await.unwrap();
    }

    pub async fn index_cover_art() {
        let releases = Database::find_all_releases().await.unwrap();
        let release_ids: Vec<String> = releases.iter().map(|r| r.id.clone()).collect();

        for id in release_ids {
            let tracks = Database::find_tracks_by_release_id(&id).await.unwrap();
            match tracks.first() {
                Some(track) => {
                    if CoverArtRepository::cover_art_exists(&id) {
                        continue;
                    }

                    let track_path = Path::new(&track.path);
                    let release_path = track_path.parent().unwrap();
                    let cover_art_path = release_path.join("cover.jpg");
                    if let Ok(cover_art) = read(cover_art_path) {
                        CoverArtRepository::add_cover_art(&id, cover_art).unwrap();
                        continue;
                    }
                }
                None => continue,
            }
        }
    }

    pub async fn add_file(path: &str) -> Result<(), ParserError> {
        let parsed_track = parse_file(path)?;
        Database::begin_transaction().await.ok();
        Self::index_track(&parsed_track).await;
        Database::commit_transaction().await.ok();

        Ok(())
    }

    pub async fn add_dir(path: &str) -> Vec<ParserError> {
        let (parsed_tracks, parsing_errors) = parse_dir(path);

        Database::begin_transaction().await.ok();
        for track in parsed_tracks {
            Self::index_track(&track).await;
        }
        Database::commit_transaction().await.ok();

        parsing_errors
    }

    pub fn thumbnail_path(release_id: &str) -> String {
        CoverArtRepository::thumbnail_path(release_id)
            .to_str()
            .unwrap()
            .to_string()
    }

    pub fn picture_path(release_id: &str) -> String {
        CoverArtRepository::picture_path(release_id)
            .to_str()
            .unwrap()
            .to_string()
    }

    pub async fn find_release(release_id: &str) -> Option<Release> {
        match Database::find_release(release_id).await {
            Ok(release) => Some(release),
            Err(_) => None,
        }
    }

    pub async fn find_all_releases() -> Vec<Release> {
        match Database::find_all_releases().await {
            Ok(releases) => releases,
            Err(_) => vec![],
        }
    }

    pub async fn find_track(track_id: &str) -> Option<Track> {
        match Database::find_track(track_id).await {
            Ok(track) => Some(track),
            Err(_) => None,
        }
    }

    pub async fn find_track_by_path(path: &str) -> Option<Track> {
        match Database::find_track_by_path(path).await {
            Ok(track) => Some(track),
            Err(_) => None,
        }
    }

    pub async fn find_tracks_by_release_id(release_id: &str) -> Vec<Track> {
        match Database::find_tracks_by_release_id(release_id).await {
            Ok(tracks) => tracks,
            Err(_) => vec![],
        }
    }

    pub async fn find_artist_credit(artist_credit_id: &str) -> Option<ArtistCredit> {
        match Database::find_artist_credit(artist_credit_id).await {
            Ok(artist_credit) => Some(artist_credit),
            Err(_) => None,
        }
    }
}
