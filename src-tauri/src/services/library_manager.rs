use super::{
    cover_art_manager::CoverArtManager,
    database_manager::{Artist, ArtistCredit, ArtistCreditPart, DatabaseManager, Release, Track},
    parser::{parse_dir, parse_file, Error as ParserError, Track as ParserTrack},
};
use crate::services::tag_reader::CoverArtExtension;
use rusqlite::Connection;
use std::path::PathBuf;
use std::{fs::read, path::Path};

pub struct LibraryManager<'a> {
    db_manager: DatabaseManager<'a>,
}

impl<'a> LibraryManager<'a> {
    pub fn new(db_connection: &'a Connection) -> Self {
        Self {
            db_manager: DatabaseManager::new(db_connection),
        }
    }

    fn index_track(&self, track: &ParserTrack) {
        let new_track_artist_credit = ArtistCredit {
            id: track.id.clone(),
            name: track.artist_credit_name.clone(),
        };

        if self
            .db_manager
            .insert_artist_credit(&new_track_artist_credit)
            .is_ok()
        {
            for artist in &track.artists {
                let new_artist = Artist {
                    id: artist.id.clone(),
                    name: artist.name.clone(),
                };
                self.db_manager.insert_artist(&new_artist).ok();

                let new_artist_credit_part = ArtistCreditPart {
                    artist_credit_id: new_track_artist_credit.id.clone(),
                    artist_id: new_artist.id.clone(),
                };
                self.db_manager
                    .insert_artist_credit_part(&new_artist_credit_part)
                    .ok();
            }
        }

        let new_release_artist_credit = ArtistCredit {
            id: track.release_id.clone(),
            name: track.release_artist_credit_name.clone(),
        };

        if self
            .db_manager
            .insert_artist_credit(&new_release_artist_credit)
            .is_ok()
        {
            for artist in &track.release_artists {
                let new_artist_credit_part = ArtistCreditPart {
                    artist_credit_id: new_release_artist_credit.id.clone(),
                    artist_id: artist.id.clone(),
                };
                self.db_manager
                    .insert_artist_credit_part(&new_artist_credit_part)
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
            self.db_manager.insert_release(&new_release).ok();
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

        self.db_manager.insert_track(&new_track).ok();
    }

    pub fn setup(&self) -> rusqlite::Result<()> {
        self.create_tables()?;
        Ok(())
    }

    fn create_tables(&self) -> rusqlite::Result<()> {
        self.db_manager.create_artist_table()?;
        self.db_manager.create_artist_credit_table()?;
        self.db_manager.create_artist_credit_part_table()?;
        self.db_manager.create_release_table()?;
        self.db_manager.create_track_table()?;

        Ok(())
    }

    fn drop_tables(&self) {
        self.db_manager.drop_track_table().unwrap();
        self.db_manager.drop_release_table().unwrap();
        self.db_manager.drop_artist_credit_part_table().unwrap();
        self.db_manager.drop_artist_credit_table().unwrap();
        self.db_manager.drop_artist_table().unwrap();
    }

    pub fn clear_data(&self) {
        self.drop_tables();
        self.create_tables();
        CoverArtManager::clear_data().expect("Failed to clear cover art data");
    }

    pub fn index_cover_art(&self) {
        let releases = self.db_manager.select_all_releases().unwrap();
        let release_ids: Vec<String> = releases.iter().map(|r| r.id.clone()).collect();

        for id in release_ids {
            let tracks = self.db_manager.select_tracks_by_release_id(&id).unwrap();
            match tracks.first() {
                Some(track) => {
                    if CoverArtManager::cover_art_exists(&id) {
                        continue;
                    }

                    let track_path = Path::new(&track.path);
                    let release_path = track_path.parent().unwrap();

                    let extensions = vec![CoverArtExtension::Jpeg, CoverArtExtension::Png];

                    for extension in extensions {
                        let cover_art_path = release_path.join(format!("cover.{}", extension));
                        if let Ok(cover_art) = read(cover_art_path) {
                            CoverArtManager::add(&id, &cover_art, &extension.to_string()).unwrap();
                            break;
                        }
                    }
                }
                None => continue,
            }
        }
    }

    pub fn add_file(&self, path: &str) -> Result<(), ParserError> {
        let parsed_track = parse_file(path)?;
        self.db_manager.begin_transaction().ok();
        self.index_track(&parsed_track);
        self.db_manager.commit_transaction().ok();

        Ok(())
    }

    pub fn add_dir(&self, path: &str) -> Vec<ParserError> {
        let (parsed_tracks, parsing_errors) = parse_dir(path);

        self.db_manager.begin_transaction().ok();
        for track in parsed_tracks {
            self.index_track(&track);
        }
        self.db_manager.commit_transaction().ok();

        parsing_errors
    }

    pub fn find_thumbnail(&self, release_id: &str) -> Option<PathBuf> {
        CoverArtManager::find_thumbnail(release_id)
    }

    pub fn find_picture(&self, release_id: &str) -> Option<PathBuf> {
        CoverArtManager::find_picture(release_id)
    }

    pub fn find_release(&self, release_id: &str) -> Option<Release> {
        match self.db_manager.select_release_by_id(release_id) {
            Ok(release) => Some(release),
            Err(_) => None,
        }
    }

    pub fn find_all_releases(&self) -> Vec<Release> {
        match self.db_manager.select_all_releases() {
            Ok(releases) => releases,
            Err(_) => vec![],
        }
    }

    pub fn find_track(&self, track_id: &str) -> Option<Track> {
        match self.db_manager.select_track_by_id(track_id) {
            Ok(track) => Some(track),
            Err(_) => None,
        }
    }

    pub fn find_track_by_path(&self, path: &str) -> Option<Track> {
        match self.db_manager.select_track_by_path(path) {
            Ok(track) => Some(track),
            Err(_) => None,
        }
    }

    pub fn find_tracks_by_release_id(&self, release_id: &str) -> Vec<Track> {
        match self.db_manager.select_tracks_by_release_id(release_id) {
            Ok(tracks) => tracks,
            Err(_) => vec![],
        }
    }

    pub fn find_artist_credit(&self, artist_credit_id: &str) -> Option<ArtistCredit> {
        match self.db_manager.select_artist_credit_by_id(artist_credit_id) {
            Ok(artist_credit) => Some(artist_credit),
            Err(_) => None,
        }
    }
}
