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
use anyhow::bail;
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use services::Preferences;
use std::fs::create_dir;
use tauri::async_runtime::spawn_blocking;
use tauri::{
    command, generate_context, generate_handler, AppHandle, Builder, Manager, Runtime, Window, Wry,
};
use window_shadows::set_shadow;

fn main() -> anyhow::Result<()> {
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
                create_dir(&app_data_dir_path)?;
            }

            // setup global variables
            SETTINGS_FILE_PATH.set(app_data_dir_path.join("preferences.json"))?;
            COVER_ART_DIR_PATH.set(app_data_dir_path.join("cover-art"))?;

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
                .build(db_manager)?;

            PreferencesManager::setup()?;
            LibraryManager::setup(db_pool.get()?)?;

            let main_window = app.get_window("main").unwrap();

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&main_window, true).unwrap();
            PlayerManager::setup(main_window).expect("Failed to setup player manager");

            // setup tauri state
            app.manage(db_pool);

            Ok(())
        })
        .run(generate_context!())?;

    grass_audio_rs::terminate().expect("Failed to terminate audio player");

    Ok(())
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
fn preferences_get() -> CommandResult<Preferences> {
    Ok(PreferencesManager::get()?)
}

#[command]
fn preferences_set(preferences: Preferences) -> CommandResult<()> {
    Ok(PreferencesManager::set(&preferences)?)
}

// library commands

#[command]
async fn library_get_release_overviews<R: Runtime>(
    app_handle: AppHandle<R>,
) -> CommandResult<Vec<ReleaseOverview>> {
    Ok(spawn_blocking(move || {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;
        LibraryManager::get_release_overviews(db_connection)
    })
    .await??)
}

#[command]
async fn library_get_release<R: Runtime>(
    release_id: String,
    app_handle: AppHandle<R>,
) -> CommandResult<Release> {
    Ok(spawn_blocking(move || {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;
        LibraryManager::get_release(db_connection, &release_id)
    })
    .await??)
}

#[command]
async fn library_get_artist_overviews<R: Runtime>(
    app_handle: AppHandle<R>,
) -> CommandResult<Vec<ArtistOverview>> {
    Ok(spawn_blocking(move || {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;
        LibraryManager::get_artists_overviews(db_connection)
    })
    .await??)
}

#[command]
async fn library_get_artist<R: Runtime>(
    app_handle: AppHandle<R>,
    artist_id: String,
) -> CommandResult<Artist> {
    Ok(spawn_blocking(move || {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;
        LibraryManager::get_artist(db_connection, &artist_id)
    })
    .await??)
}

#[command]
async fn library_get_player_track<R: Runtime>(
    app_handle: AppHandle<R>,
    track_path: String,
) -> CommandResult<PlayerTrack> {
    Ok(spawn_blocking(move || {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;
        LibraryManager::get_player_track(db_connection, &track_path)
    })
    .await??)
}

#[command]
async fn library_search<R: Runtime>(
    app_handle: AppHandle<R>,
    query: String,
) -> CommandResult<SearchResult> {
    Ok(spawn_blocking(move || {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;
        LibraryManager::search(db_connection, &query)
    })
    .await??)
}

#[command]
async fn library_scan<R: Runtime>(
    clear_data: bool,
    app_handle: AppHandle<R>,
    window: Window<Wry>,
) -> CommandResult<()> {
    spawn_blocking(move || async move {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;

        if clear_data {
            LibraryManager::clear_data(db_connection)?;
        }

        let preferences = PreferencesManager::get()?;

        if let Some(library_path) = preferences.library_path {
            let db_connection = db_pool.get()?;
            let errors = LibraryManager::scan_dir(db_connection, &library_path, window).await;
            for error in errors {
                println!("Error: {}", error);
            }

            Ok(())
        } else {
            bail!("No library path set");
        }
    })
    .await?
    .await?;

    Ok(())
}

#[command]
async fn library_scan_cover_art<R: Runtime>(
    clear_data: bool,
    app_handle: AppHandle<R>,
    window: Window<Wry>,
) -> CommandResult<()> {
    if clear_data {
        LibraryManager::clear_cover_art_data()?;
    }

    spawn_blocking(move || {
        let db_pool = app_handle.state::<Pool<SqliteConnectionManager>>();
        let db_connection = db_pool.get()?;

        LibraryManager::scan_cover_art(db_connection, window)
    })
    .await??;

    Ok(())
}

#[derive(Debug, thiserror::Error)]
enum CommandError {
    #[error(transparent)]
    AnyhowError(#[from] anyhow::Error),
    #[error(transparent)]
    TauriError(#[from] tauri::Error),
}

impl serde::Serialize for CommandError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

type CommandResult<T, E = CommandError> = anyhow::Result<T, E>;
