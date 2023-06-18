#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod database;
mod library_manager;
mod music_brainz_manager;
mod parser;
mod player_manager;
mod preferences_manager;
mod scanner;
mod tag_reader;

use crate::database::Database;
use crate::library_manager::{
    Artist, ArtistOverview, LibraryManager, PlayerTrack, Release, ReleaseOverview, SearchResult,
};
use crate::player_manager::PlayerManager;
use crate::preferences_manager::{Preferences, PreferencesManager};
use crate::scanner::Scanner;
use anyhow::bail;
use serde::Serialize;
use std::fs::create_dir;
use std::path::Path;
use tauri::async_runtime::spawn_blocking;
use tauri::{
    command, generate_context, generate_handler, AppHandle, Builder, Manager, Runtime, State,
    Window, Wry,
};
use ts_rs::TS;
use window_shadows::set_shadow;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    Builder::default()
        .invoke_handler(generate_handler![
            library_get_release_overviews,
            library_get_release,
            library_get_artist_overviews,
            library_get_artist,
            library_get_player_track,
            library_search,
            library_scan,
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
            let main_window = app.get_window("main").unwrap();

            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&main_window, true).unwrap();

            let app_data_dir_path = app.path_resolver().app_data_dir().unwrap();

            if !app_data_dir_path.exists() {
                create_dir(&app_data_dir_path)?;
            }

            let preferences_path = app_data_dir_path.join("preferences.json");
            let cover_art_path = app_data_dir_path.join("cover-art");
            let db_path = app_data_dir_path.join("grass.db");

            let player_manager = PlayerManager::new(main_window)?;
            let preferences_manager = PreferencesManager::new(preferences_path)?;
            let scanner = Scanner::new(&cover_art_path);
            let database = Database::new(&db_path)?;
            let library_manager = LibraryManager::new(database, &cover_art_path)?;

            app.manage(library_manager);
            app.manage(preferences_manager);
            app.manage(scanner);
            app.manage(player_manager);

            Ok(())
        })
        .run(generate_context!())?;

    Ok(())
}

// player commands

#[command]
fn player_set_playlist(
    paths: Vec<String>,
    player_manager: State<PlayerManager>,
) -> CommandResult<()> {
    let paths = paths.iter().map(|s| s.as_str()).collect::<Vec<_>>();
    player_manager.set_playlist(&paths);
    Ok(())
}

#[command]
fn player_play(player_manager: State<PlayerManager>) {
    player_manager.play();
}

#[command]
fn player_pause(player_manager: State<PlayerManager>) {
    player_manager.pause();
}

#[command]
fn player_stop(player_manager: State<PlayerManager>) {
    player_manager.stop();
}

#[command]
fn player_seek(seek_time: f64, player_manager: State<PlayerManager>) {
    player_manager.seek(seek_time);
}

#[command]
fn player_skip_to_track(track_index: usize, player_manager: State<PlayerManager>) {
    player_manager.skip_to_track(track_index);
}

#[command]
fn player_next(player_manager: State<PlayerManager>) {
    player_manager.next();
}

#[command]
fn player_previous(player_manager: State<PlayerManager>) {
    player_manager.previous();
}

// preferences commands

#[command]
fn preferences_get(preferences_manager: State<PreferencesManager>) -> CommandResult<Preferences> {
    Ok(preferences_manager.get()?)
}

#[command]
fn preferences_set(
    preferences: Preferences,
    preferences_manager: State<PreferencesManager>,
) -> CommandResult<()> {
    Ok(preferences_manager.set(&preferences)?)
}

// library commands

#[command]
async fn library_get_release_overviews<R: Runtime>(
    app_handle: AppHandle<R>,
) -> CommandResult<Vec<ReleaseOverview>> {
    Ok(spawn_blocking(move || {
        let library_manager = app_handle.state::<LibraryManager>();
        library_manager.get_release_overviews()
    })
    .await??)
}

#[command]
async fn library_get_release<R: Runtime>(
    release_id: String,
    app_handle: AppHandle<R>,
) -> CommandResult<Release> {
    Ok(spawn_blocking(move || {
        let library_manager = app_handle.state::<LibraryManager>();
        library_manager.get_release(&release_id)
    })
    .await??)
}

#[command]
async fn library_get_artist_overviews<R: Runtime>(
    app_handle: AppHandle<R>,
) -> CommandResult<Vec<ArtistOverview>> {
    Ok(spawn_blocking(move || {
        let library_manager = app_handle.state::<LibraryManager>();
        library_manager.get_artist_overviews()
    })
    .await??)
}

#[command]
async fn library_get_artist<R: Runtime>(
    app_handle: AppHandle<R>,
    artist_id: String,
) -> CommandResult<Artist> {
    Ok(spawn_blocking(move || {
        let library_manager = app_handle.state::<LibraryManager>();
        library_manager.get_artist(&artist_id)
    })
    .await??)
}

#[command]
async fn library_get_player_track<R: Runtime>(
    app_handle: AppHandle<R>,
    track_path: String,
) -> CommandResult<PlayerTrack> {
    Ok(spawn_blocking(move || {
        let library_manager = app_handle.state::<LibraryManager>();
        library_manager.get_player_track(&track_path)
    })
    .await??)
}

#[command]
async fn library_search<R: Runtime>(
    app_handle: AppHandle<R>,
    query: String,
) -> CommandResult<SearchResult> {
    Ok(spawn_blocking(move || {
        let library_manager = app_handle.state::<LibraryManager>();
        library_manager.search(&query)
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
        let library_manager = app_handle.state::<LibraryManager>();
        let preferences_manager = app_handle.state::<PreferencesManager>();
        let scanner = app_handle.state::<Scanner>();

        if clear_data {
            library_manager.clear_data()?;
        }

        let preferences = preferences_manager.get()?;

        if let Some(library_path) = preferences.library_path {
            let (releases, _) = scanner
                .scan_dir(Path::new(&library_path), |progress| {
                    window
                        .emit(
                            "library:scan-state",
                            ScanState {
                                progress: Some(progress),
                                phase: ScanStatePhase::Parsing,
                            },
                        )
                        .expect("Failed to emit scan state")
                })
                .await?;

            library_manager.add_releases(&releases, |progress| {
                window
                    .emit(
                        "library:scan-state",
                        ScanState {
                            progress: Some(progress),
                            phase: ScanStatePhase::Indexing,
                        },
                    )
                    .expect("Failed to emit scan state")
            })?;

            window.emit(
                "library:scan-state",
                ScanState {
                    progress: None,
                    phase: ScanStatePhase::Idle,
                },
            )?;

            Ok(())
        } else {
            bail!("No library path set");
        }
    })
    .await?
    .await?;

    Ok(())
}

#[derive(Serialize, Clone, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
struct ScanState {
    progress: Option<(usize, usize)>,
    phase: ScanStatePhase,
}

#[derive(Serialize, Clone, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
enum ScanStatePhase {
    Parsing,
    Indexing,
    Idle,
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
