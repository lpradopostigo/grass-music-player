use grass_player::Player;
use serde::Serialize;
use souvlaki::{MediaControlEvent, MediaControls, MediaMetadata, MediaPlayback, PlatformConfig};
use std::sync::Arc;
use std::{thread, time};
use tauri::{Window, Wry};
use time::Duration;
use ts_rs::TS;

#[derive(Clone)]
pub struct PlayerManager {
    player: Arc<Player>,
}

impl PlayerManager {
    pub fn new(window: Window<Wry>) -> anyhow::Result<Self> {
        let player_manager = Self {
            player: Arc::new(Player::new(44100)?),
        };

        let window_clone = window.clone();
        let player_manager_clone = player_manager.clone();

        thread::spawn(move || loop {
            window_clone
                .emit("player:state", player_manager_clone.state().unwrap())
                .expect("Failed to emit player-state event");

            thread::sleep(Duration::from_millis(250));
        });

        let player_manager_clone = player_manager.clone();
        let player_manager_clone2 = player_manager.clone();

        thread::spawn(move || {
            let hwnd = Some(window.hwnd().unwrap().0 as *mut std::ffi::c_void);

            let config = PlatformConfig {
                dbus_name: "grass-music-player",
                display_name: "Grass Music Player",
                hwnd,
            };

            let mut controls = MediaControls::new(config).expect("Failed to create media controls");

            controls
                .attach(move |event: MediaControlEvent| match event {
                    MediaControlEvent::Play => player_manager_clone.play(),
                    MediaControlEvent::Pause => player_manager_clone.pause(),
                    MediaControlEvent::Stop => player_manager_clone.stop(),
                    MediaControlEvent::Next => player_manager_clone.next(),
                    MediaControlEvent::Previous => player_manager_clone.previous(),
                    _ => (),
                })
                .expect("Failed to attach event handler");

            loop {
                match &player_manager_clone2.playback_state() {
                    PlaybackState::Playing => {
                        controls
                            .set_playback(MediaPlayback::Playing { progress: None })
                            .expect("Failed to set playback state");
                    }
                    PlaybackState::Paused => {
                        controls
                            .set_playback(MediaPlayback::Paused { progress: None })
                            .expect("Failed to set playback state");
                    }
                    PlaybackState::Stopped => {
                        controls
                            .set_playback(MediaPlayback::Stopped)
                            .expect("Failed to set playback state");
                    }
                }

                thread::sleep(Duration::from_millis(100));
            }
        });

        Ok(player_manager)
    }

    pub fn state(&self) -> anyhow::Result<PlayerState> {
        Ok(PlayerState {
            playback_state: self.playback_state(),
            path: self.player.source(),
            total_time: self.player.source_duration(),
            position: self.player.source_position(),
        })
    }

    fn playback_state(&self) -> PlaybackState {
        self.player.playback_state().into()
    }

    pub fn play(&self) {
        self.player.play();
    }

    pub fn pause(&self) {
        self.player.pause();
    }

    pub fn stop(&self) {
        self.player.stop();
    }

    pub fn previous(&self) {
        let source_index = self.player.source_index();
        if source_index > 0 {
            self.player.skip_to(source_index - 1);
        } else {
            self.player.skip_to(self.player.sources_count() - 1);
        }
    }
    pub fn next(&self) {
        let source_index = self.player.source_index();
        if source_index < self.player.sources_count() - 1 {
            self.player.skip_to(source_index + 1);
        } else {
            self.player.skip_to(0);
        }
    }

    pub fn skip_to_track(&self, index: usize) {
        self.player.skip_to(index);
    }

    pub fn seek(&self, seek_time: f64) {
        self.player.seek(seek_time);
    }

    pub fn set_playlist(&self, paths: &[&str]) {
        self.player.set_sources(paths);
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

impl From<grass_player::PlaybackState> for PlaybackState {
    fn from(state: grass_player::PlaybackState) -> Self {
        match state {
            grass_player::PlaybackState::Playing => PlaybackState::Playing,
            grass_player::PlaybackState::Paused => PlaybackState::Paused,
            grass_player::PlaybackState::Stopped => PlaybackState::Stopped,
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
