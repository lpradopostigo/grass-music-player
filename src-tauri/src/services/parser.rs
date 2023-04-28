use super::tag_reader::{CoverArt, Error as TagReaderError, TagReader};
use std::fmt::Display;
use walkdir::{DirEntry, WalkDir};

pub const AUDIO_EXTENSIONS: [&str; 2] = ["mp3", "flac"];

pub struct Artist {
    pub id: String,
    pub name: String,
}

pub struct Track {
    pub artists: Vec<Artist>,
    pub artist_credit_name: String,
    pub cover_art: Option<CoverArt>,
    pub disc_number: u16,
    pub id: String,
    pub length: f64,
    pub name: String,
    pub path: String,
    pub track_number: u16,
    pub release_artists: Vec<Artist>,
    pub release_artist_credit_name: String,
    pub release_date: String,
    pub release_id: String,
    pub release_name: String,
    pub release_total_discs: u16,
    pub release_total_tracks: u16,
}

pub enum Error {
    ParsingFailed(String, Field),
    CorruptedFile(String),
    NotProcessable(String),
}

pub enum Field {
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

impl Display for Field {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Field::Artists => write!(f, "artists"),
            Field::Date => write!(f, "date"),
            Field::DiscNumber => write!(f, "disc number"),
            Field::Id => write!(f, "id"),
            Field::Name => write!(f, "name"),
            Field::ReleaseArtists => write!(f, "release artists"),
            Field::ReleaseId => write!(f, "release id"),
            Field::ReleaseName => write!(f, "release name"),
            Field::TotalDiscs => write!(f, "total discs"),
            Field::TotalTracks => write!(f, "total tracks"),
            Field::TrackNumber => write!(f, "track number"),
        }
    }
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::ParsingFailed(path, missing_tag) => {
                write!(
                    f,
                    "Could not parse field {} from file {}",
                    missing_tag, path
                )
            }
            Error::CorruptedFile(path) => {
                write!(f, "The file {} is corrupted", path)
            }
            Error::NotProcessable(path) => {
                write!(f, "The file {} is not parsable", path)
            }
        }
    }
}

pub fn parse_file(file_path: &str) -> Result<Track, Error> {
    let tag = match TagReader::read(file_path) {
        Ok(tag) => tag,
        Err(TagReaderError::CorruptedFile) => {
            return Err(Error::CorruptedFile(file_path.to_string()))
        }
        Err(TagReaderError::NotProcessable) => {
            return Err(Error::NotProcessable(file_path.to_string()))
        }
    };

    let artist_ids = tag.musicbrainz_artist_id;

    if artist_ids.is_empty() {
        return Err(Error::ParsingFailed(file_path.to_string(), Field::Artists));
    }

    let artist_names = tag.artists;

    if artist_names.is_empty() {
        return Err(Error::ParsingFailed(file_path.to_string(), Field::Artists));
    }

    let release_artist_ids = tag.musicbrainz_album_artist_id;

    if release_artist_ids.is_empty() {
        return Err(Error::ParsingFailed(
            file_path.to_string(),
            Field::ReleaseArtists,
        ));
    }

    let artists = artist_ids
        .iter()
        .zip(artist_names.iter())
        .map(|(id, name)| Artist {
            id: id.clone(),
            name: name.clone(),
        })
        .collect();

    let release_artists = release_artist_ids
        .iter()
        .zip(artist_names.iter())
        .map(|(id, name)| Artist {
            id: id.clone(),
            name: name.clone(),
        })
        .collect();

    let parsed_track = Track {
        artists,
        release_artists,
        artist_credit_name: tag
            .artist
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::Artists))?,
        release_artist_credit_name: tag
            .album_artist
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::ReleaseArtists))?,
        disc_number: tag
            .disc_number
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::DiscNumber))?,
        id: tag
            .musicbrainz_track_id
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::Id))?,
        name: tag
            .title
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::Name))?,
        track_number: tag
            .track_number
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::TrackNumber))?,
        length: tag.duration,
        path: tag.path,
        release_name: tag
            .album
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::ReleaseName))?,
        cover_art: tag.cover_art,
        release_date: tag
            .date
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::Date))?,
        release_id: tag
            .musicbrainz_album_id
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::ReleaseId))?,
        release_total_discs: tag
            .total_discs
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::TotalDiscs))?,
        release_total_tracks: tag
            .total_tracks
            .ok_or_else(|| Error::ParsingFailed(file_path.to_string(), Field::TotalTracks))?,
    };

    Ok(parsed_track)
}

pub fn parse_dir<F>(dir_path: &str, progress_callback: F) -> (Vec<Track>, Vec<Error>)
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
        let parsed_track = match parse_file(file_path) {
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
