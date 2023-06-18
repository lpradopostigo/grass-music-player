use std::ffi::{c_char, c_int, c_void};

pub const BASS_SYNC_MIXTIME: u32 = 0x40000000;
pub const BASS_SYNC_END: u32 = 2;
pub const BASS_SYNC_THREAD: u32 = 0x20000000;
pub const BASS_STREAM_AUTOFREE: u32 = 0x40000;
pub const BASS_STREAM_DECODE: u32 = 0x200000;
pub const BASS_SAMPLE_FLOAT: u32 = 256;
pub const BASS_UNICODE: u32 = 0x80000000;
pub const BASS_POS_BYTE: u32 = 0;
pub const BASS_ACTIVE_STOPPED: u32 = 0;
pub const BASS_ACTIVE_PLAYING: u32 = 1;
pub const BASS_ACTIVE_STALLED: u32 = 2;
pub const BASS_ACTIVE_PAUSED: u32 = 3;
pub const BASS_ACTIVE_PAUSED_DEVICE: u32 = 4;
pub const BASS_ATTRIB_VOL: u32 = 2;

// Error codes returned by BASS_ErrorGetCode
pub const BASS_OK: c_int = 0; // all is OK
pub const BASS_ERROR_MEM: c_int = 1; // memory error
pub const BASS_ERROR_FILEOPEN: c_int = 2; // can't open the file
pub const BASS_ERROR_DRIVER: c_int = 3; // can't find a free/valid driver
pub const BASS_ERROR_BUFLOST: c_int = 4; // the sample buffer was lost
pub const BASS_ERROR_HANDLE: c_int = 5; // invalid handle
pub const BASS_ERROR_FORMAT: c_int = 6; // unsupported sample format
pub const BASS_ERROR_POSITION: c_int = 7; // invalid position
pub const BASS_ERROR_INIT: c_int = 8; // BASS_Init has not been successfully called
pub const BASS_ERROR_START: c_int = 9; // BASS_Start has not been successfully called
pub const BASS_ERROR_SSL: c_int = 10; // SSL/HTTPS support isn't available
pub const BASS_ERROR_REINIT: c_int = 11; // device needs to be reinitialized
pub const BASS_ERROR_ALREADY: c_int = 14; // already initialized/paused/whatever
pub const BASS_ERROR_NOTAUDIO: c_int = 17; // file does not contain audio
pub const BASS_ERROR_NOCHAN: c_int = 18; // can't get a free channel
pub const BASS_ERROR_ILLTYPE: c_int = 19; // an illegal type was specified
pub const BASS_ERROR_ILLPARAM: c_int = 20; // an illegal parameter was specified
pub const BASS_ERROR_NO3D: c_int = 21; // no 3D support
pub const BASS_ERROR_NOEAX: c_int = 22; // no EAX support
pub const BASS_ERROR_DEVICE: c_int = 23; // illegal device number
pub const BASS_ERROR_NOPLAY: c_int = 24; // not playing
pub const BASS_ERROR_FREQ: c_int = 25; // illegal sample rate
pub const BASS_ERROR_NOTFILE: c_int = 27; // the stream is not a file stream
pub const BASS_ERROR_NOHW: c_int = 29; // no hardware voices available
pub const BASS_ERROR_EMPTY: c_int = 31; // the MOD music has no sequence data
pub const BASS_ERROR_NONET: c_int = 32; // no internet connection could be opened
pub const BASS_ERROR_CREATE: c_int = 33; // couldn't create the file
pub const BASS_ERROR_NOFX: c_int = 34; // effects are not available
pub const BASS_ERROR_NOTAVAIL: c_int = 37; // requested data/action is not available
pub const BASS_ERROR_DECODE: c_int = 38; // the channel is/isn't a "decoding channel"
pub const BASS_ERROR_DX: c_int = 39; // a sufficient DirectX version is not installed
pub const BASS_ERROR_TIMEOUT: c_int = 40; // connection timedout
pub const BASS_ERROR_FILEFORM: c_int = 41; // unsupported file format
pub const BASS_ERROR_SPEAKER: c_int = 42; // unavailable speaker
pub const BASS_ERROR_VERSION: c_int = 43; // invalid BASS version (used by add-ons)
pub const BASS_ERROR_CODEC: c_int = 44; // codec is not available/supported
pub const BASS_ERROR_ENDED: c_int = 45; // the channel/file has ended
pub const BASS_ERROR_BUSY: c_int = 46; // the device is busy
pub const BASS_ERROR_UNSTREAMABLE: c_int = 47; // unstreamable file
pub const BASS_ERROR_PROTOCOL: c_int = 48; // unsupported protocol
pub const BASS_ERROR_UNKNOWN: c_int = -1; // some other mystery problem

#[repr(C)]
pub struct BassDeviceInfo {
    pub name: *mut c_char,
    pub driver: *mut c_char,
    pub flags: u32,
}

extern "C" {
    pub fn BASS_Init(
        device: c_int,
        frequency: u32,
        flags: u32,
        window: *mut c_void,
        dsguid: *mut c_void,
    ) -> i32;

    pub fn BASS_PluginLoad(file: *mut c_char, flags: u32) -> u32;
    pub fn BASS_PluginFree(handle: u32) -> i32;
    pub fn BASS_Free() -> i32;
    pub fn BASS_GetDeviceInfo(device: u32, info: *mut BassDeviceInfo) -> i32;
    pub fn BASS_ErrorGetCode() -> c_int;

    pub fn BASS_StreamFree(handle: u32) -> i32;
    pub fn BASS_ChannelSetSync(
        handle: u32,
        sync_type: u32,
        parameter: u64,
        proc: *mut extern "C" fn(_: u32, _: u32, _: u32, _: *mut c_void),
        user: *mut c_void,
    ) -> u32;

    pub fn BASS_StreamCreateFile(
        memory: i32,
        file: *const c_void,
        offset: u64,
        length: u64,
        flags: u32,
    ) -> u32;

    pub fn BASS_ChannelPlay(handle: u32, restart: i32) -> i32;
    pub fn BASS_ChannelPause(handle: u32) -> i32;
    pub fn BASS_ChannelSeconds2Bytes(handle: u32, position: f64) -> u64;
    pub fn BASS_ChannelSetPosition(handle: u32, position: u64, mode: u32) -> i32;

    pub fn BASS_ChannelIsActive(handle: u32) -> u32;

    pub fn BASS_ChannelGetPosition(handle: u32, mode: u32) -> u64;
    pub fn BASS_ChannelBytes2Seconds(handle: u32, position: u64) -> f64;
    pub fn BASS_ChannelGetLength(handle: u32, mode: u32) -> u64;
    pub fn BASS_ChannelGetAttribute(handle: u32, attribute: u32, value: *mut f32) -> i32;
    pub fn BASS_ChannelSetAttribute(handle: u32, attribute: u32, value: f32) -> i32;

}
