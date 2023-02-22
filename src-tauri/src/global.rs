use std::path::PathBuf;
use tokio::sync::OnceCell;

pub static SETTINGS_FILE_PATH: OnceCell<PathBuf> = OnceCell::const_new();
pub static COVER_ART_DIR_PATH: OnceCell<PathBuf> = OnceCell::const_new();

pub fn try_get_settings_file_path() -> PathBuf {
    SETTINGS_FILE_PATH
        .get()
        .expect("SETTINGS_FILE_PATH not set")
        .clone()
}

pub fn try_get_cover_art_dir_path() -> PathBuf {
    COVER_ART_DIR_PATH
        .get()
        .expect("COVER_ART_DIR_PATH not set")
        .clone()
}
