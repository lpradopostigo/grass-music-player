use grass_audio_rs::{GrassAudio, PlaybackState as GrassAudioPlaybackState, SampleRate};
use serde::Serialize;
use souvlaki::{MediaControlEvent, MediaControls, MediaMetadata, MediaPlayback, PlatformConfig};
use std::ffi::c_void;
use std::{thread, time};
use tauri::{Window, Wry};
use time::Duration;
use ts_rs::TS;

pub struct PlayerManager;

impl PlayerManager {
    pub fn setup(window: Window<Wry>) -> anyhow::Result<()> {
        GrassAudio::init(SampleRate::Hz44100)?;

        let window_clone = window.clone();

        thread::spawn(move || loop {
            window_clone
                .emit(
                    "player:state",
                    Self::get_state().expect("Failed to get player state"),
                )
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
                let playback_state =
                    GrassAudio::get_playback_state().expect("Failed to get playback state");

                match playback_state {
                    GrassAudioPlaybackState::Playing => {
                        controls
                            .set_playback(MediaPlayback::Playing { progress: None })
                            .expect("Failed to set playback state");
                    }
                    GrassAudioPlaybackState::Paused => {
                        controls
                            .set_playback(MediaPlayback::Paused { progress: None })
                            .expect("Failed to set playback state");
                    }
                    GrassAudioPlaybackState::Stopped => {
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

    pub fn get_state() -> anyhow::Result<PlayerState> {
        Ok(PlayerState {
            playback_state: GrassAudio::get_playback_state()?.into(),
            path: GrassAudio::get_playlist_path()?,
            total_time: GrassAudio::get_length()?,
            position: GrassAudio::get_position()?,
        })
    }

    pub fn play() {
        GrassAudio::play();
    }

    pub fn pause() {
        GrassAudio::pause();
    }

    pub fn stop() {
        GrassAudio::stop();
    }

    pub fn skip_to_track(index: i16) {
        GrassAudio::skip_to(index);
    }

    pub fn next() {
        GrassAudio::next();
    }

    pub fn previous() {
        GrassAudio::previous();
    }

    pub fn seek(seek_time: f64) {
        GrassAudio::seek(seek_time);
    }

    pub fn set_playlist(paths: &[String]) {
        GrassAudio::set_playlist(paths);
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

impl From<GrassAudioPlaybackState> for PlaybackState {
    fn from(state: GrassAudioPlaybackState) -> Self {
        match state {
            GrassAudioPlaybackState::Playing => PlaybackState::Playing,
            GrassAudioPlaybackState::Paused => PlaybackState::Paused,
            GrassAudioPlaybackState::Stopped => PlaybackState::Stopped,
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
