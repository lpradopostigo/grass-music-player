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
    #[error("invalid handle")]
    InvalidHandle,
    #[error("internal error")]
    Internal,
}

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Stream(pub u32);

impl Stream {
    pub fn new(path: &str) -> Result<Self> {
        unsafe {
            let mut c_str: Vec<u16> = OsStr::new(path).encode_wide().collect();
            c_str.push('\0' as u16);

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
                Ok(Self(stream_handle))
            }
        }
    }

    pub fn position(&self) -> Result<f64> {
        unsafe {
            let position = BASS_ChannelGetPosition(self.0, BASS_POS_BYTE);

            match BASS_ErrorGetCode() {
                BASS_OK => Ok(self.bytes_to_seconds(position)?),
                BASS_ERROR_HANDLE => Err(Error::InvalidHandle),
                _ => Err(Error::Internal),
            }
        }
    }

    pub fn set_position(&mut self, position: f64) -> Result<()> {
        unsafe {
            let bytes = self.seconds_to_bytes(position)?;
            let result = BASS_ChannelSetPosition(self.0, bytes, BASS_POS_BYTE);

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

    pub fn duration(&self) -> Result<f64> {
        unsafe {
            let length = BASS_ChannelGetLength(self.0, BASS_POS_BYTE);

            match BASS_ErrorGetCode() {
                BASS_OK => Ok(self.bytes_to_seconds(length)?),
                BASS_ERROR_HANDLE => Err(Error::InvalidHandle),
                _ => Err(Error::Internal),
            }
        }
    }

    fn bytes_to_seconds(&self, bytes: u64) -> Result<f64> {
        unsafe {
            let seconds = BASS_ChannelBytes2Seconds(self.0, bytes);

            match BASS_ErrorGetCode() {
                BASS_OK => Ok(seconds),
                BASS_ERROR_HANDLE => Err(Error::InvalidHandle),
                _ => unreachable!("unexpected error code"),
            }
        }
    }

    fn seconds_to_bytes(&self, seconds: f64) -> Result<u64> {
        unsafe {
            let bytes = BASS_ChannelSeconds2Bytes(self.0, seconds);

            match BASS_ErrorGetCode() {
                BASS_OK => Ok(bytes),
                BASS_ERROR_HANDLE => Err(Error::InvalidHandle),
                _ => unreachable!("unexpected error code"),
            }
        }
    }
}

impl Drop for Stream {
    fn drop(&mut self) {
        unsafe {
            BASS_StreamFree(self.0);
        }
    }
}
