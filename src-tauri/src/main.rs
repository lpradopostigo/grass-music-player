#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod global;
mod library;
mod player_utils;

use crate::library::{ArtistCredit, Track};
use crate::player_utils::PlayerEventController;
use global::{APP_DIR, DB_CONNECTION};
use library::{Library, Release};
use rusqlite::Connection;
use std::time;
use tauri::{async_runtime, command, generate_context, generate_handler, Builder, Manager};
use tokio::sync::Mutex;

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
            library_thumbnail_path,
            library_picture_path,
            library_find_artist_credit
        ])
        .setup(|app| {
            let db_path = env!("CARGO_MANIFEST_DIR").to_owned() + "/database.sqlite";
            let connection = Connection::open(db_path).unwrap();
            DB_CONNECTION.set(Mutex::new(Some(connection))).unwrap();

            let app_dir = app
                .path_resolver()
                .app_data_dir()
                .unwrap()
                .to_str()
                .unwrap()
                .to_owned();

            APP_DIR.set(app_dir).unwrap();

            async_runtime::block_on(async {
                Library::setup().await;
            });

            let main_window = app.get_window("main").unwrap();

            PlayerEventController::setup(main_window);

            Ok(())
        })
        .run(generate_context!())
        .expect("error while running tauri application");

    grass_audio_rs::terminate().expect("Failed to terminate audio player");
}

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

#[command]
async fn library_scan() -> Result<(), ()> {
    let errors = Library::add_dir("D:\\test-music").await;

    for error in errors {
        println!("Error: {}", error);
    }

    Ok(())
}

#[command]
async fn library_scan_cover_art() -> Result<(), ()> {
    Library::index_cover_art().await;
    Ok(())
}

#[command]
async fn library_find_release(release_id: String) -> Result<Release, ()> {
    match Library::find_release(&release_id).await {
        Some(release) => Ok(release),
        None => Err(()),
    }
}

#[command]
async fn library_find_all_releases() -> Result<Vec<Release>, ()> {
    let releases = Library::find_all_releases().await;
    Ok(releases)
}

#[command]
async fn library_find_track_by_path(path: String) -> Result<Track, ()> {
    match Library::find_track_by_path(&path).await {
        Some(track) => Ok(track),
        None => Err(()),
    }
}

#[command]
async fn library_find_track(track_id: String) -> Result<Track, ()> {
    match Library::find_track(&track_id).await {
        Some(track) => Ok(track),
        None => Err(()),
    }
}

#[command]
async fn library_find_tracks_by_release_id(release_id: String) -> Result<Vec<Track>, ()> {
    let tracks = Library::find_tracks_by_release_id(&release_id).await;
    Ok(tracks)
}

#[command]
async fn library_find_artist_credit(artist_credit_id: String) -> Result<ArtistCredit, ()> {
    match Library::find_artist_credit(&artist_credit_id).await {
        Some(artist_credit) => Ok(artist_credit),
        None => Err(()),
    }
}

#[command]
fn library_thumbnail_path(release_id: String) -> String {
    Library::thumbnail_path(&release_id)
}

#[command]
fn library_picture_path(release_id: String) -> String {
    Library::picture_path(&release_id)
}
