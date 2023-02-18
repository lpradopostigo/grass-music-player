use audiotags::{Error as TagError, Tag};

pub struct Tags {
    pub album: Option<String>,
    pub album_artist: Option<String>,
    pub artist: Option<String>,
    pub artists: Option<Vec<String>>,
    pub cover_art: Option<Vec<u8>>,
    pub date: Option<String>,
    pub disc_number: Option<u16>,
    pub duration: f64,
    pub musicbrainz_album_artist_id: Option<Vec<String>>,
    pub musicbrainz_album_id: Option<String>,
    pub musicbrainz_artist_id: Option<Vec<String>>,
    pub musicbrainz_track_id: Option<String>,
    pub path: String,
    pub title: Option<String>,
    pub total_discs: Option<u16>,
    pub total_tracks: Option<u16>,
    pub track_number: Option<u16>,
    pub year: Option<u16>,
}

pub enum Error {
    CorruptedFile,
    NotProcessable,
}

pub struct TagReader {
    tag_reader: Tag,
}

impl TagReader {
    pub fn new() -> Self {
        Self {
            tag_reader: Tag::new(),
        }
    }

    pub fn read_tags(&self, path: &str) -> Result<Tags, Error> {
        let tag = match self.tag_reader.read_from_path(path) {
            Ok(tag) => tag,
            Err(
                TagError::UnknownFileExtension(_)
                | TagError::UnsupportedMimeType(_)
                | TagError::UnsupportedFormat(_),
            ) => return Err(Error::NotProcessable),
            Err(_) => return Err(Error::CorruptedFile),
        };

        let date = tag
            .get("date")
            .and_then(|xs| xs.first().map(|x| x.to_string()));

        let total_tracks = tag.total_tracks().or_else(|| {
            tag.get("TRACKTOTAL")
                .and_then(|xs| xs.first().and_then(|x| x.parse::<u16>().ok()))
        });

        let total_discs = tag.total_discs().or_else(|| {
            tag.get("DISCTOTAL")
                .and_then(|xs| xs.first().and_then(|x| x.parse::<u16>().ok()))
        });

        let artists = tag
            .get("ARTISTS")
            .map(|xs| xs.iter().map(|x| x.to_string()).collect());

        let musicbrainz_track_id = tag
            .get("MUSICBRAINZ_TRACKID")
            .and_then(|xs| xs.first().map(|x| x.to_string()));

        let musicbrainz_artist_id = tag
            .get("MUSICBRAINZ_ARTISTID")
            .map(|xs| xs.iter().map(|x| x.to_string()).collect());

        let musicbrainz_album_id = tag
            .get("MUSICBRAINZ_ALBUMID")
            .and_then(|xs| xs.first().map(|x| x.to_string()));

        let musicbrainz_album_artist_id = tag
            .get("MUSICBRAINZ_ALBUMARTISTID")
            .map(|xs| xs.iter().map(|x| x.to_string()).collect());

        Ok(Tags {
            date,
            artists,
            musicbrainz_track_id,
            musicbrainz_artist_id,
            musicbrainz_album_id,
            musicbrainz_album_artist_id,
            total_tracks,
            total_discs,
            title: tag.title().map(|s| s.to_string()),
            artist: tag.artist().map(|s| s.to_string()),
            track_number: tag.track_number(),
            disc_number: tag.disc_number(),
            duration: tag.duration().ok_or(Error::CorruptedFile)?,
            album: tag.album_title().map(|s| s.to_string()),
            album_artist: tag.album_artist().map(|s| s.to_string()),
            year: tag.year().map(|s| s as u16),
            cover_art: tag.album_cover().map(|s| s.data.to_vec()),
            path: path.to_string(),
        })
    }
}
