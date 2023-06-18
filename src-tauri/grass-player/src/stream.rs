use bass_sys::*;
use std::ffi::OsStr;
use std::os::windows::ffi::OsStrExt;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("failed to open file {0}")]
    FailedToOpenFile(String),
    #[error("unsupported file format {0}")]
    UnsupportedFileFormat(String),
    #[error("invalid position {0}")]
    InvalidPosition(f64),
    #[error("internal error")]
    Internal,
}

type Result<T> = std::result::Result<T, Error>;

pub struct Stream {
    handle: u32,
}

impl Stream {
    pub fn new(path: &str) -> Result<Self> {
        let mut c_str: Vec<u16> = OsStr::new(path).encode_wide().collect();
        c_str.push('\0' as u16);

        unsafe {
            let stream_handle = BASS_StreamCreateFile(
                0,
                c_str.as_ptr() as _,
                0,
                0,
                BASS_STREAM_DECODE | BASS_SAMPLE_FLOAT | BASS_UNICODE,
            );

            if stream_handle == 0 {
                match BASS_ErrorGetCode() {
                    BASS_ERROR_FILEOPEN => Err(Error::FailedToOpenFile(path.to_string())),
                    BASS_ERROR_FILEFORM | BASS_ERROR_NOTAUDIO | BASS_ERROR_CODEC
                    | BASS_ERROR_FORMAT => Err(Error::UnsupportedFileFormat(path.to_string())),
                    _ => Err(Error::Internal),
                }
            } else {
                Ok(Self {
                    handle: stream_handle,
                })
            }
        }
    }

    pub fn handle(&self) -> u32 {
        self.handle
    }

    pub fn position(&self) -> f64 {
        unsafe {
            BASS_ChannelBytes2Seconds(
                self.handle,
                BASS_ChannelGetPosition(self.handle, BASS_POS_BYTE),
            )
        }
    }

    pub fn set_position(&mut self, position: f64) -> Result<()> {
        unsafe {
            let result = BASS_ChannelSetPosition(
                self.handle,
                BASS_ChannelSeconds2Bytes(self.handle, position),
                BASS_POS_BYTE,
            );

            if result == 0 {
                match BASS_ErrorGetCode() {
                    BASS_ERROR_POSITION => Err(Error::InvalidPosition(position)),
                    _ => Err(Error::Internal),
                }
            } else {
                Ok(())
            }
        }
    }

    pub fn duration(&self) -> f64 {
        unsafe {
            BASS_ChannelBytes2Seconds(
                self.handle,
                BASS_ChannelGetLength(self.handle, BASS_POS_BYTE),
            )
        }
    }
}

impl Drop for Stream {
    fn drop(&mut self) {
        unsafe {
            BASS_StreamFree(self.handle);
        }
    }
}
