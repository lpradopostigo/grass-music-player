#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod entities;
mod global;
mod services;

use crate::global::{COVER_ART_DIR_PATH, SETTINGS_FILE_PATH};
use crate::services::{
    LibraryArtist, LibraryArtistsItem, LibraryManager, LibraryRelease, LibraryReleasesItem,
    PlayerManager, PlayerTrack, PreferencesManager,
};
use rusqlite::Connection;
use services::Preferences;
use std::fs::create_dir;
use tauri::{command, generate_context, generate_handler, Builder, Manager, State, Window, Wry};
use tokio::sync::Mutex;
use window_shadows::set_shadow;

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![
            library_get_library_releases,
            library_get_library_release,
            library_get_library_artists,
            library_get_library_artist,
            library_get_player_track,
            library_scan,
            library_scan_cover_art,
            player_set_playlist,
            player_play,
            player_pause,
            player_stop,
            player_seek,
            player_skip_to_track,
            player_next,
            player_previous,
            preferences_get,
            preferences_set,
        ])
        .setup(|app| {
            let app_data_dir_path = app.path_resolver().app_data_dir().unwrap();

            if !app_data_dir_path.exists() {
                create_dir(&app_data_dir_path).expect("Failed to create app data directory");
            }

            // setup global variables
            SETTINGS_FILE_PATH
                .set(app_data_dir_path.join("preferences.json"))
                .unwrap();
            COVER_ART_DIR_PATH
                .set(app_data_dir_path.join("cover-art"))
                .unwrap();

            // setup services
            let db_path = app_data_dir_path.join("grass.db");
            let db_connection = Connection::open(db_path).expect("Failed to open database");
            PreferencesManager::setup().expect("Failed to setup settings manager");
            LibraryManager::new(&db_connection)
                .setup()
                .expect("Failed to setup library manager");

            let main_window = app.get_window("main").unwrap();

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&main_window, true).unwrap();
            PlayerManager::setup(main_window).expect("Failed to setup player manager");

            // setup tauri state
            app.manage(Mutex::new(db_connection));

            Ok(())
        })
        .run(generate_context!())
        .expect("error while running tauri application");

    grass_audio_rs::terminate().expect("Failed to terminate audio player");
}

// player commands

#[command]
fn player_set_playlist(paths: Vec<String>) {
    PlayerManager::set_playlist(&paths);
}

#[command]
fn player_play() {
    PlayerManager::play();
}

#[command]
fn player_pause() {
    PlayerManager::pause();
}

#[command]
fn player_stop() {
    PlayerManager::stop();
}

#[command]
fn player_seek(seek_time: f64) {
    PlayerManager::seek(seek_time);
}

#[command]
fn player_skip_to_track(track_index: i16) {
    PlayerManager::skip_to_track(track_index);
}

#[command]
fn player_next() {
    PlayerManager::next();
}

#[command]
fn player_previous() {
    PlayerManager::previous();
}

// preferences commands

#[command]
fn preferences_get() -> Result<Preferences, ()> {
    PreferencesManager::get().map_err(|_| ())
}

#[command]
fn preferences_set(preferences: Preferences) -> Result<(), ()> {
    PreferencesManager::set(&preferences).map_err(|_| ())
}

// library commands

#[command]
async fn library_get_library_releases(
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<Vec<LibraryReleasesItem>, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager.get_library_releases().map_err(|_| ())
}

#[command]
async fn library_get_library_release(
    db_connection: State<'_, Mutex<Connection>>,
    release_id: String,
) -> Result<LibraryRelease, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager
        .get_library_release(&release_id)
        .map_err(|_| ())
}

#[command]
async fn library_get_library_artists(
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<Vec<LibraryArtistsItem>, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager.get_library_artists().map_err(|_| ())
}

#[command]
async fn library_get_library_artist(
    db_connection: State<'_, Mutex<Connection>>,
    artist_id: String,
) -> Result<LibraryArtist, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager
        .get_library_artist(&artist_id)
        .map_err(|_| ())
}

#[command]
async fn library_get_player_track(
    db_connection: State<'_, Mutex<Connection>>,
    track_path: String,
) -> Result<PlayerTrack, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager
        .get_player_track(&track_path)
        .map_err(|_| ())
}

#[command]
async fn library_scan(
    clear_data: bool,
    db_connection: State<'_, Mutex<Connection>>,
    window: Window<Wry>,
) -> Result<(), ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    if clear_data {
        library_manager
            .clear_data()
            .expect("Failed to clear library data")
    }

    let preferences = PreferencesManager::get().expect("Failed to get preferences");

    if let Some(library_path) = preferences.library_path {
        let errors = library_manager.add_dir(&library_path, window);

        for error in errors {
            println!("Error: {}", error);
        }
        Ok(())
    } else {
        Err(())
    }
}

#[command]
async fn library_scan_cover_art(db_connection: State<'_, Mutex<Connection>>) -> Result<(), ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);
    library_manager
        .scan_cover_art()
        .expect("Failed to scan cover art");
    Ok(())
}

// #[command]
// fn library_get_preferred_cover_art_position(release_id: String) -> Option<CoverArtPosition> {
//     match CoverArtManager::get_preferred_cover_art_position(&release_id) {
//         Ok(position) => Some(position),
//         Err(_) => None,
//     }
// }
