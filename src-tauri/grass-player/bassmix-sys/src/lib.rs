pub const BASS_MIXER_END: u32 = 0x10000;
pub const BASS_MIXER_CHAN_NORAMPIN: u32 = 0x800000;
pub const BASS_MIXER_NORAMPIN: u32 = BASS_MIXER_CHAN_NORAMPIN;
pub const BASS_POS_MIXER_RESET: u32 = 0x10000;

extern "C" {
    pub fn BASS_Mixer_StreamCreate(freq: u32, chans: u32, flags: u32) -> u32;

    pub fn BASS_Mixer_StreamAddChannel(handle: u32, channel: u32, flags: u32) -> i32;

    pub fn BASS_Mixer_ChannelSetPosition(handle: u32, pos: u64, mode: u32) -> i32;

    pub fn BASS_Mixer_StreamGetChannels(
        handle: u32,
        channels: *mut u32,
        count: u32,
    ) -> u32;
}
