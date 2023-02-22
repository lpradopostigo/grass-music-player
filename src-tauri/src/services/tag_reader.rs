use lofty::{read_from_path, Accessor, AudioFile, ItemKey, MimeType, TaggedFileExt};
use std::fmt::Display;

pub struct TagReader;

impl TagReader {
    pub fn read(path: &str) -> Result<Tag, Error> {
        let tagged_file = match read_from_path(path) {
            Ok(tagged_file) => tagged_file,
            Err(_) => return Err(Error::NotProcessable),
        };

        let file_properties = tagged_file.properties();

        let tag = tagged_file.primary_tag().unwrap();

        let album_artist = tag.get_string(&ItemKey::AlbumArtist).map(|s| s.to_string());

        let date = tag
            .get_string(&ItemKey::RecordingDate)
            .map(|s| s.to_string());

        let artists = tag
            .get_strings(&ItemKey::Unknown("ARTISTS".to_string()))
            .map(|x| x.to_string())
            .collect();

        let musicbrainz_track_id = tag
            .get_string(&ItemKey::Unknown("MUSICBRAINZ_TRACKID".to_string()))
            .map(|s| s.to_string());

        let musicbrainz_artist_id = tag
            .get_strings(&ItemKey::Unknown("MUSICBRAINZ_ARTISTID".to_string()))
            .map(|x| x.to_string())
            .collect();

        let musicbrainz_album_id = tag
            .get_string(&ItemKey::Unknown("MUSICBRAINZ_ALBUMID".to_string()))
            .map(|s| s.to_string());

        let musicbrainz_album_artist_id = tag
            .get_strings(&ItemKey::Unknown("MUSICBRAINZ_ALBUMARTISTID".to_string()))
            .map(|x| x.to_string())
            .collect();

        let cover_art = match tag.pictures().first() {
            Some(picture) => {
                let extension = match picture.mime_type() {
                    MimeType::Jpeg => CoverArtExtension::Jpeg,
                    MimeType::Png => CoverArtExtension::Png,
                    _ => return Err(Error::NotProcessable),
                };

                Some(CoverArt {
                    extension,
                    data: picture.data().to_vec(),
                })
            }
            None => None,
        };

        Ok(Tag {
            date,
            artists,
            musicbrainz_track_id,
            musicbrainz_artist_id,
            musicbrainz_album_id,
            musicbrainz_album_artist_id,
            cover_art,
            album_artist,
            total_tracks: tag.track_total().map(|s| s as u16),
            total_discs: tag.disk_total().map(|s| s as u16),
            title: tag.title().map(|s| s.into_owned()),
            artist: tag.artist().map(|s| s.into_owned()),
            track_number: tag.track().map(|s| s as u16),
            disc_number: tag.disk().map(|s| s as u16),
            duration: file_properties.duration().as_secs_f64(),
            album: tag.album().map(|s| s.into_owned()),
            year: tag.year().map(|s| s as u16),
            path: path.into(),
        })
    }
}

pub struct Tag {
    pub album: Option<String>,
    pub album_artist: Option<String>,
    pub artist: Option<String>,
    pub artists: Vec<String>,
    pub cover_art: Option<CoverArt>,
    pub date: Option<String>,
    pub disc_number: Option<u16>,
    pub duration: f64,
    pub musicbrainz_album_artist_id: Vec<String>,
    pub musicbrainz_album_id: Option<String>,
    pub musicbrainz_artist_id: Vec<String>,
    pub musicbrainz_track_id: Option<String>,
    pub path: String,
    pub title: Option<String>,
    pub total_discs: Option<u16>,
    pub total_tracks: Option<u16>,
    pub track_number: Option<u16>,
    pub year: Option<u16>,
}

pub struct CoverArt {
    pub data: Vec<u8>,
    pub extension: CoverArtExtension,
}

pub enum Error {
    NotProcessable,
    CorruptedFile,
}

pub enum CoverArtExtension {
    Jpeg,
    Png,
}

impl Display for CoverArtExtension {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CoverArtExtension::Jpeg => write!(f, "jpg"),
            CoverArtExtension::Png => write!(f, "png"),
        }
    }
}
