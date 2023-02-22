#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod global;
mod player_utils;
mod services;

use crate::global::{COVER_ART_DIR_PATH, SETTINGS_FILE_PATH};
use crate::player_utils::PlayerEventController;
use crate::services::{ArtistCredit, CoverArtManager, SettingsManager, Track};
use rusqlite::Connection;
use services::{LibraryManager, Release, Settings};
use std::fs::create_dir;
use tauri::{command, generate_context, generate_handler, Builder, Manager, State};
use tokio::sync::Mutex;
use window_shadows::set_shadow;

fn main() {
    grass_audio_rs::init(grass_audio_rs::SampleRate::Hz44100)
        .expect("Failed to initialize audio player");

    Builder::default()
        .invoke_handler(generate_handler![
            player_set_playlist,
            player_play,
            player_pause,
            player_stop,
            player_seek,
            player_skip_to_track,
            player_next,
            player_previous,
            library_scan,
            library_scan_cover_art,
            library_find_release,
            library_find_all_releases,
            library_find_track,
            library_find_track_by_path,
            library_find_tracks_by_release_id,
            library_find_thumbnail,
            library_find_picture,
            library_find_artist_credit,
            settings_get,
            settings_set,
        ])
        .setup(|app| {
            let app_data_dir_path = app.path_resolver().app_data_dir().unwrap();

            if !app_data_dir_path.exists() {
                create_dir(&app_data_dir_path).expect("Failed to create app data directory");
            }

            // setup global variables
            SETTINGS_FILE_PATH
                .set(app_data_dir_path.join("settings.json"))
                .unwrap();
            COVER_ART_DIR_PATH
                .set(app_data_dir_path.join("cover-art"))
                .unwrap();

            // setup services
            let db_path = app_data_dir_path.join("grass.db");
            let db_connection = Connection::open(db_path).expect("Failed to open database");
            SettingsManager::setup().expect("Failed to setup settings manager");
            CoverArtManager::setup().expect("Failed to setup cover art manager");
            LibraryManager::new(&db_connection)
                .setup()
                .expect("Failed to setup library manager");

            // setup tauri state
            app.manage(Mutex::new(db_connection));

            let main_window = app.get_window("main").unwrap();

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&main_window, true).unwrap();

            PlayerEventController::setup(main_window);

            Ok(())
        })
        .run(generate_context!())
        .expect("error while running tauri application");

    grass_audio_rs::terminate().expect("Failed to terminate audio player");
}

// player commands

#[command]
fn player_set_playlist(paths: Vec<String>) {
    grass_audio_rs::set_playlist(&paths);
}

#[command]
fn player_play() {
    grass_audio_rs::play();
}

#[command]
fn player_pause() {
    grass_audio_rs::pause();
}

#[command]
fn player_stop() {
    grass_audio_rs::stop();
}

#[command]
fn player_seek(seek_time: f64) {
    grass_audio_rs::seek(seek_time);
}

#[command]
fn player_skip_to_track(track_index: i16) {
    grass_audio_rs::skip_to_track(track_index);
}

#[command]
fn player_next() {
    grass_audio_rs::next();
}

#[command]
fn player_previous() {
    grass_audio_rs::previous();
}

// settings commands

#[command]
fn settings_get() -> Settings {
    SettingsManager::get()
}

#[command]
fn settings_set(settings: Settings) {
    SettingsManager::set(&settings).unwrap();
}

// library commands

#[command]
async fn library_scan(
    clear_data: bool,
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<(), ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    if clear_data {
        library_manager.clear_data();
    }

    let settings = SettingsManager::get();

    if let Some(library_path) = settings.library_path {
        let errors = library_manager.add_dir(&library_path);

        for error in errors {
            println!("Error: {}", error);
        }
        Ok(())
    } else {
        Err(())
    }
}

#[command]
async fn library_scan_cover_art(
    clear_data: bool,
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<(), ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    if clear_data {
        CoverArtManager::clear_data().map_err(|_| ())?;
    }

    library_manager.index_cover_art();
    Ok(())
}

#[command]
async fn library_find_release(
    release_id: String,
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<Release, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager.find_release(&release_id).ok_or(())
}

#[command]
async fn library_find_all_releases(
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<Vec<Release>, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    Ok(library_manager.find_all_releases())
}

#[command]
async fn library_find_track_by_path(
    path: String,
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<Track, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager.find_track_by_path(&path).ok_or(())
}

#[command]
async fn library_find_track(
    track_id: String,
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<Track, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager.find_track(&track_id).ok_or(())
}

#[command]
async fn library_find_tracks_by_release_id(
    release_id: String,
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<Vec<Track>, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    Ok(library_manager.find_tracks_by_release_id(&release_id))
}

#[command]
async fn library_find_artist_credit(
    artist_credit_id: String,
    db_connection: State<'_, Mutex<Connection>>,
) -> Result<ArtistCredit, ()> {
    let db_connection = db_connection.lock().await;
    let library_manager = LibraryManager::new(&db_connection);

    library_manager
        .find_artist_credit(&artist_credit_id)
        .ok_or(())
}

#[command]
fn library_find_thumbnail(release_id: String) -> Option<String> {
    CoverArtManager::find_thumbnail(&release_id)
        .map(|s| s.to_str().unwrap().to_string())
}

#[command]
fn library_find_picture(release_id: String) -> Option<String> {
    CoverArtManager::find_picture(&release_id)
        .map(|s| s.to_str().unwrap().to_string())
}
