use grass_audio_rs::{
    get_current_track_path, get_playback_state, get_track_length, get_track_position, PlaybackState,
};
use serde::Serialize;
use std::{thread, time};
use tauri::{Window, Wry};
use time::Duration;
use ts_rs::TS;

#[derive(Serialize, Clone, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct PlayerState {
    playback_state: String,
    current_track_path: Option<String>,
    current_track_duration: f64,
    current_track_position: f64,
}

pub struct PlayerEventController;

impl PlayerEventController {
    fn get_state() -> PlayerState {
        PlayerState {
            playback_state: match get_playback_state() {
                PlaybackState::Playing => "playing".to_string(),
                PlaybackState::Paused => "paused".to_string(),
                PlaybackState::Stopped => "stopped".to_string(),
            },
            current_track_path: get_current_track_path(),
            current_track_duration: get_track_length(),
            current_track_position: get_track_position(),
        }
    }

    fn setup_state_event(window: Window<Wry>) {
        thread::spawn(move || loop {
            thread::sleep(Duration::from_millis(100));
            window.emit("player-state", Self::get_state()).unwrap();
        });
    }

    pub fn setup(window: Window<Wry>) {
        Self::setup_state_event(window);
    }
}
