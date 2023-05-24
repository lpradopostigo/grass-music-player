#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod global;
mod services;

use crate::global::{COVER_ART_DIR_PATH, SETTINGS_FILE_PATH};
use crate::services::{
    Artist, ArtistOverview, LibraryManager, PlayerManager, PlayerTrack, PreferencesManager,
    Release, ReleaseOverview, SearchResult,
};
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use services::Preferences;
use std::fs::create_dir;
use tauri::async_runtime::spawn_blocking;
use tauri::{command, generate_context, generate_handler, Builder, Manager, State, Window, Wry};
use window_shadows::set_shadow;

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![
            library_get_release_overviews,
            library_get_release,
            library_get_artist_overviews,
            library_get_artist,
            library_get_player_track,
            library_search,
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
            let db_manager = SqliteConnectionManager::file(db_path).with_init(|connection| {
                connection.set_prepared_statement_cache_capacity(20);
                Ok(())
            });
            let db_pool = Pool::builder()
                .max_lifetime(None)
                .max_size(5)
                .min_idle(Some(1))
                .build(db_manager)
                .unwrap();

            PreferencesManager::setup().expect("Failed to setup settings manager");
            LibraryManager::new(db_pool.get().unwrap())
                .setup()
                .expect("Failed to setup library manager");

            let main_window = app.get_window("main").unwrap();

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&main_window, true).unwrap();
            PlayerManager::setup(main_window).expect("Failed to setup player manager");

            // setup tauri state
            app.manage(db_pool);

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
async fn library_get_release_overviews(
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
) -> Result<Vec<ReleaseOverview>, ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    library_manager.get_release_overviews().map_err(|_| ())
}

#[command]
async fn library_get_release(
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
    release_id: String,
) -> Result<Release, ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    library_manager.get_release(&release_id).map_err(|_| ())
}

#[command]
async fn library_get_artist_overviews(
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
) -> Result<Vec<ArtistOverview>, ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    library_manager.get_artists_overviews().map_err(|_| ())
}

#[command]
async fn library_get_artist(
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
    artist_id: String,
) -> Result<Artist, ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    library_manager.get_artist(&artist_id).map_err(|_| ())
}

#[command]
async fn library_get_player_track(
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
    track_path: String,
) -> Result<PlayerTrack, ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    library_manager
        .get_player_track(&track_path)
        .map_err(|_| ())
}

#[command]
async fn library_search(
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
    query: String,
) -> Result<SearchResult, ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    library_manager.search(&query).map_err(|_| ())
}

#[command]
async fn library_scan(
    clear_data: bool,
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
    window: Window<Wry>,
) -> Result<(), ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    if clear_data {
        library_manager
            .clear_data()
            .expect("Failed to clear library data")
    }

    let preferences = PreferencesManager::get().expect("Failed to get preferences");

    if let Some(library_path) = preferences.library_path {
        spawn_blocking(move || {
            let errors = library_manager.scan_dir(&library_path, window);

            for error in errors {
                println!("Error: {}", error);
            }
        })
        .await
        .unwrap();

        Ok(())
    } else {
        Err(())
    }
}

#[command]
async fn library_scan_cover_art(
    clear_data: bool,
    db_pool: State<'_, Pool<SqliteConnectionManager>>,
    window: Window<Wry>,
) -> Result<(), ()> {
    let db_connection = db_pool.get().unwrap();
    let library_manager = LibraryManager::new(db_connection);

    if clear_data {
        library_manager
            .clear_cover_art_data()
            .expect("Failed to clear cover art data")
    }

    library_manager
        .scan_cover_art(window)
        .expect("Failed to scan cover art");
    Ok(())
}
