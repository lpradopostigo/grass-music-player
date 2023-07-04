mod mixer;
mod output_device;
mod stream;

use crate::mixer::Mixer;
pub use crate::mixer::PlaybackState;
use crate::stream::Stream;
use crossbeam::channel;
use output_device::OutputDevice;
use std::mem::ManuallyDrop;
use std::ops::{Deref, DerefMut};
use std::sync::{Arc, RwLock};
use std::thread;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error(transparent)]
    OutputDeviceError(#[from] output_device::Error),
    #[error(transparent)]
    MixerError(#[from] mixer::Error),
    #[error(transparent)]
    StreamError(#[from] stream::Error),
    #[error("internal error")]
    Internal,
}

pub type Result<T> = std::result::Result<T, Error>;

struct InnerState {
    stream: ManuallyDrop<Option<Stream>>,
    mixer: Mixer,
    sources: Vec<String>,
    source_index: usize,
    sample_rate: u32,
}

enum Signal {
    Play,
    Pause,
    Stop,
    Seek(f64),
    SkipTo(usize),
    SetSources(Vec<String>),
    SetVolume(f32),
}

pub struct Player {
    _output_device: OutputDevice,
    tx: channel::Sender<Signal>,
    inner_state: Arc<RwLock<InnerState>>,
}

impl Player {
    pub fn new(sample_rate: u32) -> Result<Self> {
        let output_device = OutputDevice::new(sample_rate)?;

        let (tx, rx) = channel::unbounded::<Signal>();

        let player = Self {
            tx: tx.clone(),
            _output_device: output_device,
            inner_state: Arc::new(RwLock::new(InnerState {
                sample_rate,
                stream: ManuallyDrop::new(None),
                mixer: Mixer::new(sample_rate, 2)?,
                sources: Vec::new(),
                source_index: 0,
            })),
        };

        let inner_state = player.inner_state.clone();
        thread::spawn(move || loop {
            if let Ok(signal) = rx.recv() {
                Self::handle_signal(&tx, signal, &inner_state).unwrap();
            }
        });

        Ok(player)
    }

    fn handle_signal(
        tx: &channel::Sender<Signal>,
        signal: Signal,
        inner_state: &Arc<RwLock<InnerState>>,
    ) -> Result<()> {
        match signal {
            Signal::Play => {
                let mut inner_state = inner_state.write().map_err(|_| Error::Internal)?;

                if inner_state.stream.is_none() {
                    let stream = Stream::new(&inner_state.sources[inner_state.source_index])?;
                    inner_state.mixer.add_stream(stream.clone())?;
                    inner_state.stream = ManuallyDrop::new(Some(stream));
                }

                inner_state.mixer.play().map_err(|_| Error::Internal)?;
            }
            Signal::SetSources(sources) => {
                let inner_state_clone = inner_state.clone();
                let mut inner_state = inner_state.write().map_err(|_| Error::Internal)?;

                inner_state.mixer = Mixer::new(inner_state.sample_rate, 2)?;
                inner_state.sources = sources;
                inner_state.source_index = 0;

                inner_state.mixer.on_end(move || {
                    Self::handle_end(inner_state_clone.clone()).unwrap();
                })?;
            }
            Signal::SkipTo(source_index) => {
                let inner_state_clone = inner_state.clone();
                let mut inner_state = inner_state.write().map_err(|_| Error::Internal)?;

                if inner_state.sources.is_empty() || source_index >= inner_state.sources.len() {
                    return Err(Error::Internal);
                }

                let last_playback_state = inner_state.mixer.playback_state();

                inner_state.mixer =
                    Mixer::new(inner_state.sample_rate, 2).map_err(|_| Error::Internal)?;
                inner_state.source_index = source_index;
                inner_state.stream = ManuallyDrop::new(None);

                inner_state
                    .mixer
                    .on_end(move || {
                        Self::handle_end(inner_state_clone.clone()).unwrap();
                    })
                    .map_err(|_| Error::Internal)?;

                match last_playback_state {
                    PlaybackState::Playing => {
                        tx.send(Signal::Play).map_err(|_| Error::Internal)?;
                    }
                    PlaybackState::Paused => {
                        tx.send(Signal::Pause).map_err(|_| Error::Internal)?;
                    }
                    _ => {}
                }
            }

            Signal::Pause => {
                let inner_state = inner_state.read().map_err(|_| Error::Internal)?;
                inner_state.mixer.pause().ok();
            }

            Signal::Stop => {
                let mut inner_state = inner_state.write().map_err(|_| Error::Internal)?;
                inner_state.mixer =
                    Mixer::new(inner_state.sample_rate, 2).map_err(|_| Error::Internal)?;
                inner_state.source_index = 0;
                inner_state.stream = ManuallyDrop::new(None);
            }

            Signal::Seek(seconds) => {
                let mut inner_state = inner_state.write().map_err(|_| Error::Internal)?;

                if let Some(stream) = inner_state.stream.deref_mut() {
                    stream.set_position(seconds).map_err(|_| Error::Internal)?;
                }
            }

            Signal::SetVolume(volume) => {
                let inner_state = inner_state.read().map_err(|_| Error::Internal)?;
                inner_state.mixer.set_volume(volume);
            }
        }

        Ok(())
    }

    fn handle_end(inner_state: Arc<RwLock<InnerState>>) -> Result<()> {
        let mut inner_state = inner_state.write().map_err(|_| Error::Internal)?;

        if inner_state.source_index == inner_state.sources.len() - 1 {
            inner_state.source_index = 0;
            inner_state.stream = ManuallyDrop::new(None);
        } else {
            let new_source_index = inner_state.source_index + 1;

            let stream =
                Stream::new(&inner_state.sources[new_source_index]).map_err(|_| Error::Internal)?;

            inner_state
                .mixer
                .add_stream(stream.clone())
                .map_err(|_| Error::Internal)?;
            inner_state.stream = ManuallyDrop::new(Some(stream));
            inner_state.mixer.reset_position().ok();
            inner_state.source_index = new_source_index;
        }

        Ok(())
    }

    pub fn play(&self) {
        self.tx.send(Signal::Play).ok();
    }

    pub fn pause(&self) {
        self.tx.send(Signal::Pause).ok();
    }

    pub fn stop(&self) {
        self.tx.send(Signal::Stop).ok();
    }

    pub fn set_sources(&self, sources: &[&str]) {
        let sources = sources.iter().map(|s| s.to_string()).collect();
        self.tx.send(Signal::SetSources(sources)).ok();
    }

    pub fn seek(&self, seconds: f64) {
        self.tx.send(Signal::Seek(seconds)).ok();
    }

    pub fn skip_to(&self, source_index: usize) {
        self.tx.send(Signal::SkipTo(source_index)).ok();
    }

    pub fn playback_state(&self) -> PlaybackState {
        if let Ok(inner_state) = self.inner_state.read() {
            inner_state.mixer.playback_state()
        } else {
            PlaybackState::Stopped
        }
    }

    pub fn source_position(&self) -> f64 {
        if let Ok(inner_state) = self.inner_state.read() {
            if let Some(stream) = inner_state.stream.deref() {
                stream.position().unwrap_or(0.0)
            } else {
                0.0
            }
        } else {
            0.0
        }
    }

    pub fn source_duration(&self) -> f64 {
        if let Ok(inner_state) = self.inner_state.read() {
            if let Some(stream) = inner_state.stream.deref() {
                stream.duration().unwrap_or(0.0)
            } else {
                0.0
            }
        } else {
            0.0
        }
    }

    pub fn source_index(&self) -> usize {
        if let Ok(inner_state) = self.inner_state.read() {
            inner_state.source_index
        } else {
            0
        }
    }

    pub fn source(&self) -> Option<String> {
        if let Ok(inner_state) = self.inner_state.read() {
            if inner_state.sources.is_empty() {
                None
            } else {
                Some(inner_state.sources[inner_state.source_index].clone())
            }
        } else {
            None
        }
    }

    pub fn sources_count(&self) -> usize {
        if let Ok(inner_state) = self.inner_state.read() {
            inner_state.sources.len()
        } else {
            0
        }
    }

    pub fn volume(&self) -> f32 {
        if let Ok(inner_state) = self.inner_state.read() {
            inner_state.mixer.volume()
        } else {
            0.0
        }
    }

    pub fn set_volume(&self, volume: f32) {
        self.tx.send(Signal::SetVolume(volume)).ok();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Duration;

    macro_rules! source_path {
        ($filename:expr) => {
            concat!(env!("CARGO_MANIFEST_DIR"), "/sample-files/", $filename)
        };
    }

    const SOURCES: [&str; 3] = [
        source_path!("01_Ghosts_I.flac"),
        source_path!("24_Ghosts_III.flac"),
        source_path!("25_Ghosts_III.flac"),
    ];

    #[test]
    fn init() -> Result<()> {
        let player = Player::new(44100)?;
        drop(player);

        let player = Player::new(44100)?;
        drop(player);

        Ok(())
    }

    #[test]
    fn play_pause() -> Result<()> {
        let player = Player::new(44100)?;

        player.set_sources(&SOURCES);

        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        player.pause();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.playback_state(), PlaybackState::Paused);

        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        Ok(())
    }

    #[test]
    fn stop() -> Result<()> {
        let player = Player::new(44100)?;

        player.set_sources(&SOURCES);

        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        player.stop();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.playback_state(), PlaybackState::Stopped);
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.source_position(), 0.0);

        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        Ok(())
    }

    #[test]
    fn skip_to() -> Result<()> {
        let player = Player::new(44100)?;

        player.set_sources(&SOURCES);

        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        player.skip_to(1);
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 1);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        Ok(())
    }

    #[test]
    fn last_source() -> Result<()> {
        let player = Player::new(44100)?;

        player.set_sources(&SOURCES);

        player.play();
        player.skip_to(2);
        thread::sleep(Duration::from_secs(5));
        player.seek(110.);

        thread::sleep(Duration::from_secs(20));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Stopped);

        println!("before play");
        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        println!("deadlock test");
        Ok(())
    }

    #[test]
    fn seek() -> Result<()> {
        let player = Player::new(44100)?;

        player.set_sources(&SOURCES);

        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        player.seek(60.0);
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        Ok(())
    }

    #[test]
    fn volume() -> Result<()> {
        let player = Player::new(44100)?;

        player.set_sources(&SOURCES);

        player.play();
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        player.set_volume(0.5);
        thread::sleep(Duration::from_secs(5));
        assert_eq!(player.source_index(), 0);
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        Ok(())
    }

    #[test]
    fn sequential_playback() -> Result<()> {
        let player = Player::new(44100)?;

        player.set_sources(&SOURCES);

        player.play();
        thread::sleep(Duration::from_secs(1));

        // seek to last seconds of first source
        player.seek(160.0);
        thread::sleep(Duration::from_secs(10));

        // seek to last seconds of second source
        player.seek(155.);
        thread::sleep(Duration::from_secs(20));

        // third source must be playing now
        assert_eq!(player.playback_state(), PlaybackState::Playing);

        Ok(())
    }
}
