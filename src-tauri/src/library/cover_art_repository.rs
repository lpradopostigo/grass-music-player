use crate::global::APP_DIR;
use std::fs::File;
use std::io::{Cursor, Write};
use std::path::{Path, PathBuf};

static THUMBNAIL_SIZE: u32 = 320;
static DIR_NAME: &str = "cover_art";

pub struct CoverArtRepository;

impl CoverArtRepository {
    fn picture_filename(release_id: &str) -> String {
        format!("{}.webp", release_id)
    }

    fn thumbnail_filename(release_id: &str) -> String {
        format!("{}_thumbnail.webp", release_id)
    }

    pub fn thumbnail_path(release_id: &str) -> PathBuf {
        Self::cover_art_dir().join(Self::thumbnail_filename(release_id))
    }

    pub fn picture_path(release_id: &str) -> PathBuf {
        Self::cover_art_dir().join(Self::picture_filename(release_id))
    }

    fn process_cover_art(image: &[u8]) -> Result<(Vec<u8>, Vec<u8>), ()> {
        let original_image = match image::load_from_memory(image) {
            Ok(image) => image,
            Err(_) => return Err(()),
        };

        let resized_image = original_image.thumbnail(THUMBNAIL_SIZE, THUMBNAIL_SIZE);

        let mut picture_output = Cursor::new(Vec::new());
        let mut thumbnail_output = Cursor::new(Vec::new());

        original_image
            .write_to(&mut picture_output, image::ImageOutputFormat::WebP)
            .unwrap();

        resized_image
            .write_to(&mut thumbnail_output, image::ImageOutputFormat::WebP)
            .unwrap();

        let picture = picture_output.into_inner();
        let thumbnail = thumbnail_output.into_inner();

        Ok((picture, thumbnail))
    }

    pub fn cover_art_dir() -> PathBuf {
        let app_dir_path = Path::new(APP_DIR.get().unwrap());
        app_dir_path.join(DIR_NAME)
    }

    pub fn cover_art_exists(release_id: &str) -> bool {
        let picture_path = Self::picture_path(release_id);
        let thumbnail_path = Self::thumbnail_path(release_id);
        picture_path.exists() && thumbnail_path.exists()
    }

    pub fn add_cover_art(release_id: &str, data: Vec<u8>) -> Result<(), ()> {
        if Self::cover_art_exists(release_id) {
            return Err(());
        }

        let picture_path = Self::picture_path(release_id);
        let thumbnail_path = Self::thumbnail_path(release_id);

        let (picture, thumbnail) = match Self::process_cover_art(&data) {
            Ok((picture, thumbnail)) => (picture, thumbnail),
            Err(_) => return Err(()),
        };
        let mut picture_file = File::create(picture_path).unwrap();
        picture_file.write_all(&picture).unwrap();

        let mut thumbnail_file = File::create(thumbnail_path).unwrap();
        thumbnail_file.write_all(&thumbnail).unwrap();

        Ok(())
    }
}
