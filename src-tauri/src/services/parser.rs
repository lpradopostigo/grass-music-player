use super::tag_reader::{CoverArt, TagReader};
use std::error::Error;
use std::fmt::Display;
use walkdir::{DirEntry, WalkDir};

pub const AUDIO_EXTENSIONS: [&str; 2] = ["mp3", "flac"];

pub struct Parser;

impl Parser {
    pub fn parse_file(file_path: &str) -> Result<ParserTrack, ParserError> {
        let tag = match TagReader::read(file_path) {
            Ok(tag) => tag,
            Err(_) => return Err(ParserError::TagReadingFailed(file_path.to_string())),
        };

        let artist_ids = tag.musicbrainz_artist_id;

        if artist_ids.is_empty() {
            return Err(ParserError::ParsingFailed(
                file_path.to_string(),
                ParserErrorField::Artists,
            ));
        }

        let artist_names = tag.artists;

        if artist_names.is_empty() {
            return Err(ParserError::ParsingFailed(
                file_path.to_string(),
                ParserErrorField::Artists,
            ));
        }

        let release_artist_ids = tag.musicbrainz_album_artist_id;

        if release_artist_ids.is_empty() {
            return Err(ParserError::ParsingFailed(
                file_path.to_string(),
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
            ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::ReleaseArtists)
        })?;

        let release_artists = {
            let release_artists: Vec<_> = artists
                .iter()
                .filter(|artist| release_artist_ids.contains(&artist.id))
                .cloned()
                .collect();

            // is a shared artist like "Various Artists" or [unknown]
            if release_artists.is_empty() {
                vec![ParserArtist {
                    id: release_artist_ids[0].clone(),
                    name: release_artist_credit_name.clone(),
                }]
            } else {
                release_artists
            }
        };

        let parsed_track = ParserTrack {
            artists,
            release_artists,
            release_artist_credit_name,
            artist_credit_name: tag.artist.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::Artists)
            })?,
            disc_number: tag.disc_number.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::DiscNumber)
            })?,
            id: tag.musicbrainz_track_id.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::Id)
            })?,
            name: tag.title.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::Name)
            })?,
            track_number: tag.track_number.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::TrackNumber)
            })?,
            length: tag.duration,
            path: tag.path,
            release_name: tag.album.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::ReleaseName)
            })?,
            cover_art: tag.cover_art,
            release_date: tag.date.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::Date)
            })?,
            release_id: tag.musicbrainz_album_id.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::ReleaseId)
            })?,
            release_total_discs: tag.total_discs.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::TotalDiscs)
            })?,
            release_total_tracks: tag.total_tracks.ok_or_else(|| {
                ParserError::ParsingFailed(file_path.to_string(), ParserErrorField::TotalTracks)
            })?,
        };

        Ok(parsed_track)
    }

    pub fn parse_dir<F>(
        dir_path: &str,
        progress_callback: F,
    ) -> (Vec<ParserTrack>, Vec<ParserError>)
    where
        F: Fn((usize, usize)),
    {
        let mut parsed_tracks = Vec::new();
        let mut errors = Vec::new();

        let is_audio_file = |x: &DirEntry| {
            x.file_type().is_file()
                && match x.path().extension() {
                    Some(ext) => AUDIO_EXTENSIONS.contains(&ext.to_str().unwrap()),
                    None => false,
                }
        };

        let audio_files: Vec<DirEntry> = WalkDir::new(dir_path)
            .into_iter()
            .filter_map(|x| x.ok())
            .filter(is_audio_file)
            .collect();

        let audio_files_count = audio_files.len();

        for (index, entry) in audio_files.into_iter().enumerate() {
            progress_callback((index + 1, audio_files_count));
            let file_path = entry.path().to_str().unwrap();
            let parsed_track = match Self::parse_file(file_path) {
                Ok(parsed_track) => parsed_track,
                Err(err) => {
                    errors.push(err);
                    continue;
                }
            };

            parsed_tracks.push(parsed_track);
        }

        (parsed_tracks, errors)
    }
}

#[derive(Debug, Clone)]
pub struct ParserArtist {
    pub id: String,
    pub name: String,
}

#[derive(Debug)]
pub struct ParserTrack {
    pub artists: Vec<ParserArtist>,
    pub artist_credit_name: String,
    pub cover_art: Option<CoverArt>,
    pub disc_number: u16,
    pub id: String,
    pub length: f64,
    pub name: String,
    pub path: String,
    pub track_number: u16,
    pub release_artists: Vec<ParserArtist>,
    pub release_artist_credit_name: String,
    pub release_date: String,
    pub release_id: String,
    pub release_name: String,
    pub release_total_discs: u16,
    pub release_total_tracks: u16,
}

#[derive(Debug)]
pub enum ParserError {
    ParsingFailed(String, ParserErrorField),
    TagReadingFailed(String),
}

impl Error for ParserError {}

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

impl Display for ParserErrorField {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ParserErrorField::Artists => write!(f, "artists"),
            ParserErrorField::Date => write!(f, "date"),
            ParserErrorField::DiscNumber => write!(f, "disc number"),
            ParserErrorField::Id => write!(f, "id"),
            ParserErrorField::Name => write!(f, "name"),
            ParserErrorField::ReleaseArtists => write!(f, "release artists"),
            ParserErrorField::ReleaseId => write!(f, "release id"),
            ParserErrorField::ReleaseName => write!(f, "release name"),
            ParserErrorField::TotalDiscs => write!(f, "total discs"),
            ParserErrorField::TotalTracks => write!(f, "total tracks"),
            ParserErrorField::TrackNumber => write!(f, "track number"),
        }
    }
}

impl Display for ParserError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ParserError::ParsingFailed(path, missing_tag) => {
                write!(
                    f,
                    "Could not parse field {} from file {}",
                    missing_tag, path
                )
            }
            ParserError::TagReadingFailed(path) => {
                write!(f, "The file {} is not parsable", path)
            }
        }
    }
}
