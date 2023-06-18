use crate::stream::Stream;
use bass_sys::*;
use bassmix_sys::*;
use std::ffi::c_void;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("output device not initialized")]
    OutputDeviceNotInitialized,
    #[error("stream already added")]
    StreamAlreadyAdded,
    #[error("internal error")]
    Internal,
}

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PlaybackState {
    Playing,
    Paused,
    Stopped,
}

pub struct Mixer {
    handle: u32,
    closures: Vec<*mut (dyn FnMut() + Send + Sync)>,
}

unsafe impl Send for Mixer {}
unsafe impl Sync for Mixer {}

impl Mixer {
    pub fn new(sample_rate: u32, channels: u32) -> Result<Self> {
        unsafe {
            let handle = BASS_Mixer_StreamCreate(sample_rate, channels, BASS_MIXER_END);

            if handle == 0 {
                match BASS_ErrorGetCode() {
                    BASS_ERROR_INIT => Err(Error::OutputDeviceNotInitialized),
                    _ => Err(Error::Internal),
                }
            } else {
                Ok(Self {
                    handle,
                    closures: Vec::new(),
                })
            }
        }
    }

    pub fn handle(&self) -> u32 {
        self.handle
    }

    pub fn add_stream(&self, stream: &Stream) -> Result<()> {
        unsafe {
            let result =
                BASS_Mixer_StreamAddChannel(self.handle, stream.handle(), BASS_MIXER_NORAMPIN);
            if result == 0 {
                match BASS_ErrorGetCode() {
                    BASS_ERROR_ALREADY => Err(Error::StreamAlreadyAdded),
                    _ => Err(Error::Internal),
                }
            } else {
                Ok(())
            }
        }
    }

    pub fn play(&mut self) -> Result<()> {
        let result = unsafe { BASS_ChannelPlay(self.handle, 0) };
        if result == 0 {
            Err(Error::Internal)
        } else {
            Ok(())
        }
    }
    pub fn pause(&self) -> Result<()> {
        let result = unsafe { BASS_ChannelPause(self.handle) };
        if result == 0 {
            Err(Error::Internal)
        } else {
            Ok(())
        }
    }
    pub fn playback_state(&self) -> PlaybackState {
        let state = unsafe { BASS_ChannelIsActive(self.handle) };

        match state {
            BASS_ACTIVE_PLAYING => PlaybackState::Playing,
            BASS_ACTIVE_PAUSED => PlaybackState::Paused,
            _ => PlaybackState::Stopped,
        }
    }

    pub fn reset_position(&self) -> Result<()> {
        let result = unsafe { BASS_ChannelSetPosition(self.handle, 0, 0) };

        if result == 0 {
            Err(Error::Internal)
        } else {
            Ok(())
        }
    }

    pub fn volume(&self) -> f32 {
        let mut volume = 0.0;

        unsafe {
            BASS_ChannelGetAttribute(self.handle, BASS_ATTRIB_VOL, &mut volume);
        }

        volume
    }

    pub fn set_volume(&self, volume: f32) {
        unsafe {
            BASS_ChannelSetAttribute(self.handle, BASS_ATTRIB_VOL, volume);
        }
    }

    pub fn on_end<T>(&mut self, callback: T) -> Result<()>
    where
        T: FnMut() + Send + Sync + 'static,
    {
        let callback = Box::new(callback);
        let callback = Box::into_raw(callback);

        self.closures.push(callback);

        let result = unsafe {
            BASS_ChannelSetSync(
                self.handle,
                BASS_SYNC_END | BASS_SYNC_MIXTIME | BASS_SYNC_THREAD,
                0,
                Self::sync_handler::<T> as _,
                callback as _,
            )
        };

        if result == 0 {
            Err(Error::Internal)
        } else {
            Ok(())
        }
    }

    unsafe fn sync_handler<F>(_: u32, _: u32, _: u32, user_data: *mut c_void)
    where
        F: FnMut() + Send + Sync,
    {
        let closure = &mut *(user_data as *mut F);
        closure();
    }
}

impl Drop for Mixer {
    fn drop(&mut self) {
        unsafe { BASS_StreamFree(self.handle) };
        for closure in self.closures.drain(..) {
            unsafe { drop(Box::from_raw(closure)) };
        }
    }
}
