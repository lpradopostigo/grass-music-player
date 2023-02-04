use rusqlite::Connection;
use tokio::sync::{Mutex, OnceCell};

pub static DB_CONNECTION: OnceCell<Mutex<Option<Connection>>> = OnceCell::const_new();
pub static APP_DIR: OnceCell<String> = OnceCell::const_new();

pub fn cover_art_dir() -> String {
    format!("{}/cover_art", APP_DIR.get().unwrap())
}
