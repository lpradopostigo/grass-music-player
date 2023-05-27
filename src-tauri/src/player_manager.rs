use serde::Serialize;
use souvlaki::{MediaControlEvent, MediaControls, MediaMetadata, MediaPlayback, PlatformConfig};
use std::ffi::c_void;
use std::{thread, time};
use tauri::{Window, Wry};
use time::Duration;
use ts_rs::TS;

pub struct PlayerManager;

impl PlayerManager {
    pub fn setup(window: Window<Wry>) -> Result<(), grass_audio_rs::Error> {
        grass_audio_rs::init(grass_audio_rs::SampleRate::Hz44100)?;

        let window_clone = window.clone();

        thread::spawn(move || loop {
            window_clone
                .emit("player:state", Self::get_state())
                .expect("Failed to emit player-state event");

            thread::sleep(Duration::from_millis(250));
        });

        thread::spawn(move || {
            let hwnd = Some(window.hwnd().unwrap().0 as *mut c_void);

            let config = PlatformConfig {
                dbus_name: "grass-music-player",
                display_name: "Grass Music Player",
                hwnd,
            };

            let mut controls = MediaControls::new(config).expect("Failed to create media controls");

            controls
                .attach(|event: MediaControlEvent| match event {
                    MediaControlEvent::Play => Self::play(),
                    MediaControlEvent::Pause => Self::pause(),
                    MediaControlEvent::Stop => Self::stop(),
                    MediaControlEvent::Next => Self::next(),
                    MediaControlEvent::Previous => Self::previous(),
                    _ => (),
                })
                .expect("Failed to attach event handler");

            loop {
                let playback_state = grass_audio_rs::get_playback_state();

                match playback_state {
                    grass_audio_rs::PlaybackState::Playing => {
                        controls
                            .set_playback(MediaPlayback::Playing { progress: None })
                            .expect("Failed to set playback state");
                    }
                    grass_audio_rs::PlaybackState::Paused => {
                        controls
                            .set_playback(MediaPlayback::Paused { progress: None })
                            .expect("Failed to set playback state");
                    }
                    grass_audio_rs::PlaybackState::Stopped => {
                        controls
                            .set_playback(MediaPlayback::Stopped)
                            .expect("Failed to set playback state");
                    }
                }

                thread::sleep(Duration::from_millis(100));
            }
        });

        Ok(())
    }

    pub fn get_state() -> PlayerState {
        PlayerState {
            playback_state: grass_audio_rs::get_playback_state().into(),
            path: grass_audio_rs::get_current_track_path(),
            total_time: grass_audio_rs::get_track_length(),
            position: grass_audio_rs::get_track_position(),
        }
    }

    pub fn play() {
        grass_audio_rs::play();
    }

    pub fn pause() {
        grass_audio_rs::pause();
    }

    pub fn stop() {
        grass_audio_rs::stop();
    }

    pub fn skip_to_track(index: i16) {
        grass_audio_rs::skip_to_track(index);
    }

    pub fn next() {
        grass_audio_rs::next();
    }

    pub fn previous() {
        grass_audio_rs::previous();
    }

    pub fn seek(seek_time: f64) {
        grass_audio_rs::seek(seek_time);
    }

    pub fn set_playlist(paths: &[String]) {
        grass_audio_rs::set_playlist(paths);
    }
}

#[derive(Serialize, Clone, TS, PartialEq)]
#[ts(export)]
#[serde(rename_all = "lowercase")]
pub enum PlaybackState {
    Playing,
    Paused,
    Stopped,
}

impl From<grass_audio_rs::PlaybackState> for PlaybackState {
    fn from(state: grass_audio_rs::PlaybackState) -> Self {
        match state {
            grass_audio_rs::PlaybackState::Playing => PlaybackState::Playing,
            grass_audio_rs::PlaybackState::Paused => PlaybackState::Paused,
            grass_audio_rs::PlaybackState::Stopped => PlaybackState::Stopped,
        }
    }
}

#[derive(Serialize, Clone, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct PlayerState {
    playback_state: PlaybackState,
    position: f64,
    total_time: f64,
    path: Option<String>,
}
