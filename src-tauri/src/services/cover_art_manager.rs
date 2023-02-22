use crate::global::try_get_cover_art_dir_path;
use crate::services::tag_reader::CoverArtExtension;
use image::imageops::FilterType;
use std::fs::{create_dir, create_dir_all, remove_dir_all, File};
use std::io;
use std::io::{Cursor, Write};
use std::path::PathBuf;

const THUMBNAIL_SIZE: u32 = 320;

macro_rules! picture_filename {
    ($release_id:expr, $extension:expr) => {
        format!("{}.{}", $release_id, $extension)
    };
}

macro_rules! thumbnail_filename {
    ($release_id:expr) => {
        format!("{}_thumbnail.webp", $release_id)
    };
}

static EXTENSIONS: [CoverArtExtension; 2] = [CoverArtExtension::Jpeg, CoverArtExtension::Png];

pub struct CoverArtManager;

impl CoverArtManager {
    fn create_thumbnail(data: &[u8]) -> Result<Vec<u8>, ()> {
        let original_image = match image::load_from_memory(data) {
            Ok(image) => image,
            Err(_) => return Err(()),
        };

        let resized_image =
            original_image.resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, FilterType::CatmullRom);

        let mut thumbnail_output = Cursor::new(Vec::new());

        resized_image
            .write_to(&mut thumbnail_output, image::ImageOutputFormat::WebP)
            .unwrap();

        let thumbnail = thumbnail_output.into_inner();

        Ok(thumbnail)
    }

    pub fn cover_art_exists(release_id: &str) -> bool {
        let picture = Self::find_picture(release_id);
        let thumbnail = Self::find_thumbnail(release_id);

        picture.is_some() && thumbnail.is_some()
    }

    pub fn add(release_id: &str, data: &[u8], extension: &str) -> Result<(), ()> {
        if Self::cover_art_exists(release_id) {
            return Err(());
        }

        let cover_art_dir_path = try_get_cover_art_dir_path();

        let picture_path = cover_art_dir_path.join(picture_filename!(release_id, extension));
        let thumbnail_path = cover_art_dir_path.join(thumbnail_filename!(release_id));

        let thumbnail = match Self::create_thumbnail(data) {
            Ok(thumbnail) => thumbnail,
            Err(_) => return Err(()),
        };

        let mut picture_file = File::create(picture_path).unwrap();
        picture_file.write_all(data).unwrap();

        let mut thumbnail_file = File::create(thumbnail_path).unwrap();
        thumbnail_file.write_all(&thumbnail).unwrap();

        Ok(())
    }

    pub fn find_picture(release_id: &str) -> Option<PathBuf> {
        let cover_art_dir_path = try_get_cover_art_dir_path();

        for extension in &EXTENSIONS {
            let file_path =
                cover_art_dir_path.join(picture_filename!(release_id, extension.to_string()));

            if file_path.exists() {
                return Some(file_path);
            }
        }

        None
    }

    pub fn find_thumbnail(release_id: &str) -> Option<PathBuf> {
        let cover_art_dir_path = try_get_cover_art_dir_path();

        let thumbnail_path = cover_art_dir_path.join(thumbnail_filename!(release_id));

        if thumbnail_path.exists() {
            Some(thumbnail_path)
        } else {
            None
        }
    }

    pub fn setup() -> io::Result<()> {
        let cover_art_dir_path = try_get_cover_art_dir_path();

        if !cover_art_dir_path.exists() {
            create_dir_all(cover_art_dir_path)?;
        }
        Ok(())
    }

    pub fn clear_data() -> io::Result<()> {
        let cover_art_dir_path = try_get_cover_art_dir_path();

        if cover_art_dir_path.exists() {
            remove_dir_all(&cover_art_dir_path)?;
            create_dir(cover_art_dir_path)?;
        }

        Ok(())
    }
}
