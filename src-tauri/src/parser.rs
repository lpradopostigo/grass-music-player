use super::music_brainz_manager::MusicBrainzManager;
use super::tag_reader::{CoverArt, TagReader};
use crate::tag_reader::CoverArtExtension;
use anyhow::Context;
use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use walkdir::{DirEntry, WalkDir};

pub static AUDIO_EXTENSIONS: [&str; 2] = ["mp3", "flac"];
pub static COVER_ART_EXTENSIONS: [CoverArtExtension; 2] =
    [CoverArtExtension::Jpeg, CoverArtExtension::Png];

pub struct Parser {
    music_brainz_manager: MusicBrainzManager,
    cover_art_dir: PathBuf,
}

impl Parser {
    pub fn new(music_brainz_manager: MusicBrainzManager, cover_art_dir: PathBuf) -> Self {
        Self {
            music_brainz_manager,
            cover_art_dir,
        }
    }

    pub async fn parse_file(&self, file_path: &Path) -> Result<ParserTrack, ParserError> {
        let tag = match TagReader::read(file_path) {
            Ok(tag) => tag,
            Err(_) => return Err(ParserError::TagReadingFailed(file_path.into())),
        };

        let artist_ids = tag.musicbrainz_artist_id;

        if artist_ids.is_empty() {
            return Err(ParserError::ParsingFailed(
                file_path.into(),
                ParserErrorField::Artists,
            ));
        }

        let artist_names = tag.artists;

        if artist_names.is_empty() {
            return Err(ParserError::ParsingFailed(
                file_path.into(),
                ParserErrorField::Artists,
            ));
        }

        let release_artist_ids = tag.musicbrainz_album_artist_id;

        if release_artist_ids.is_empty() {
            return Err(ParserError::ParsingFailed(
                file_path.into(),
                ParserErrorField::ReleaseArtists,
            ));
        }

        let artists: Vec<ParserArtist> = artist_ids
            .iter()
            .zip(artist_names.iter())
            .map(|(id, name)| ParserArtist {
                id: id.clone(),
                name: name.clone(),
            })
            .collect();

        let release_artist_credit_name = tag.album_artist.ok_or_else(|| {
            ParserError::ParsingFailed(file_path.into(), ParserErrorField::ReleaseArtists)
        })?;

        let release_id = tag.musicbrainz_album_id.ok_or_else(|| {
            ParserError::ParsingFailed(file_path.into(), ParserErrorField::ReleaseId)
        })?;

        let release_artists = {
            let release_artists: Vec<_> = artists
                .iter()
                .filter(|artist| release_artist_ids.contains(&artist.id))
                .cloned()
                .collect();

            if release_artist_ids.len() != release_artists.len() {
                match self.music_brainz_manager.get_release(&release_id).await {
                    Ok(release) => {
                        let release_artists: Vec<_> = release
                            .artist_credit
                            .iter()
                            .map(|artist_credit| ParserArtist {
                                id: artist_credit.artist.id.clone(),
                                name: artist_credit.artist.name.clone(),
                            })
                            .collect();

                        release_artists
                    }

                    Err(_) => {
                        println!(
                            "Failed to fetch release from MusicBrainz for {}",
                            release_id
                        );

                        vec![ParserArtist {
                            id: release_artist_ids[0].clone(),
                            name: release_artist_credit_name.clone(),
                        }]
                    }
                }
            } else {
                release_artists
            }
        };

        let parsed_track = ParserTrack {
            artists,
            release_artists,
            release_artist_credit_name,
            release_id,
            artist_credit_name: tag.artist.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::Artists)
            })?,
            disc_number: tag.disc_number.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::DiscNumber)
            })?,
            id: tag.musicbrainz_track_id.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::Id)
            })?,
            name: tag.title.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::Name)
            })?,
            track_number: tag.track_number.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::TrackNumber)
            })?,
            length: tag.duration,
            path: PathBuf::from(file_path),
            release_name: tag.album.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::ReleaseName)
            })?,
            cover_art: tag.cover_art,
            release_date: tag.date.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::Date)
            })?,

            release_total_discs: tag.total_discs.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::TotalDiscs)
            })?,
            release_total_tracks: tag.total_tracks.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.into(), ParserErrorField::TotalTracks)
            })?,
        };

        Ok(parsed_track)
    }

    fn is_audio_file(&self, x: &DirEntry) -> bool {
        x.file_type().is_file()
            && match x.path().extension().and_then(|x| x.to_str()) {
                Some(ext) => AUDIO_EXTENSIONS.contains(&ext),
                None => false,
            }
    }

    pub async fn parse_dir<F>(
        &self,
        dir_path: &Path,
        progress_callback: F,
    ) -> anyhow::Result<(Vec<ParserRelease>, Vec<ParserError>)>
    where
        F: Fn((usize, usize)),
    {
        let mut errors = Vec::new();
        let mut releases: HashMap<String, ParserRelease> = HashMap::new();

        let audio_files: Vec<DirEntry> = WalkDir::new(dir_path)
            .into_iter()
            .filter_map(|x| x.ok())
            .filter(|x| self.is_audio_file(x))
            .collect();

        let audio_files_count = audio_files.len();

        for (index, entry) in audio_files.into_iter().enumerate() {
            progress_callback((index + 1, audio_files_count));

            let parsed_track = match self.parse_file(entry.path()).await {
                Ok(parsed_track) => parsed_track,
                Err(err) => {
                    errors.push(err);
                    continue;
                }
            };

            match releases.entry(parsed_track.release_id.clone()) {
                Entry::Occupied(mut entry) => {
                    entry.get_mut().tracks.push(parsed_track.into());
                }
                Entry::Vacant(entry) => {
                    let release_path = &parsed_track
                        .path
                        .parent()
                        .context("Failed to get parent path")?;

                    let cover_art = 'a: {
                        for extension in &COVER_ART_EXTENSIONS {
                            let cover_art_path = release_path.join(format!("cover.{}", extension));
                            if let Ok(cover_art_file) = std::fs::read(cover_art_path) {
                                break 'a Some(CoverArt {
                                    data: cover_art_file,
                                    extension: extension.clone(),
                                });
                            }
                        }

                        parsed_track.cover_art.clone()
                    };

                    let parsed_release = ParserRelease {
                        cover_art,
                        tracks: vec![parsed_track.clone().into()],
                        id: parsed_track.release_id,
                        artists: parsed_track.release_artists,
                        name: parsed_track.release_name,
                        total_discs: parsed_track.release_total_discs,
                        date: parsed_track.release_date,
                        artist_credit_name: parsed_track.release_artist_credit_name,
                        total_tracks: parsed_track.release_total_tracks,
                    };

                    entry.insert(parsed_release);
                }
            }
        }

        Ok((releases.into_values().collect(), errors))
    }
}

#[derive(Debug, Clone)]
pub struct ParserArtist {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Clone)]
pub struct ParserTrack {
    pub id: String,
    pub artists: Vec<ParserArtist>,
    pub artist_credit_name: String,
    pub cover_art: Option<CoverArt>,
    pub disc_number: u16,
    pub length: f64,
    pub name: String,
    pub path: PathBuf,
    pub track_number: u16,
    pub release_artists: Vec<ParserArtist>,
    pub release_artist_credit_name: String,
    pub release_date: String,
    pub release_id: String,
    pub release_name: String,
    pub release_total_discs: u16,
    pub release_total_tracks: u16,
}

#[derive(Debug, Clone)]
pub struct ParserRelease {
    pub id: String,
    pub artists: Vec<ParserArtist>,
    pub artist_credit_name: String,
    pub cover_art: Option<CoverArt>,
    pub name: String,
    pub total_discs: u16,
    pub total_tracks: u16,
    pub tracks: Vec<ParserReleaseTrack>,
    pub date: String,
}

#[derive(Debug, Clone)]
pub struct ParserReleaseTrack {
    pub id: String,
    pub artists: Vec<ParserArtist>,
    pub artist_credit_name: String,
    pub disc_number: u16,
    pub track_number: u16,
    pub length: f64,
    pub name: String,
    pub path: PathBuf,
}

#[derive(Debug, thiserror::Error)]
pub enum ParserError {
    #[error("Parsing failed for file {0:?} at field {1:?}")]
    ParsingFailed(PathBuf, ParserErrorField),
    #[error("Reading tags failed for file {0:?}")]
    TagReadingFailed(PathBuf),
}

#[derive(Debug)]
pub enum ParserErrorField {
    Artists,
    Date,
    DiscNumber,
    Id,
    Name,
    ReleaseArtists,
    ReleaseId,
    ReleaseName,
    TotalDiscs,
    TotalTracks,
    TrackNumber,
}

impl From<ParserTrack> for ParserReleaseTrack {
    fn from(track: ParserTrack) -> Self {
        Self {
            id: track.id,
            artists: track.artists,
            artist_credit_name: track.artist_credit_name,
            disc_number: track.disc_number,
            track_number: track.track_number,
            length: track.length,
            name: track.name,
            path: track.path,
        }
    }
}
