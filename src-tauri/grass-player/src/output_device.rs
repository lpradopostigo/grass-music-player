use bass_sys::*;
use std::ffi::CString;
use std::sync::Mutex;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("already initialized")]
    AlreadyInitialized,
    #[error("failed to load plugins")]
    FailedToLoadPlugins,
    #[error("failed to open device")]
    FailedToOpenDevice,
    #[error("internal error")]
    Internal,
}

pub type Result<T> = std::result::Result<T, Error>;

pub struct Device {
    pub name: String,
}

struct Plugin {
    handle: u32,
    path: &'static str,
}

static PLUGINS: Mutex<[Plugin; 1]> = Mutex::new([Plugin {
    handle: 0,
    path: "./bassflac.dll",
}]);

static IS_INITIALIZED: Mutex<bool> = Mutex::new(false);

pub struct OutputDevice;

impl OutputDevice {
    pub fn new(sample_rate: u32) -> Result<Self> {
        let mut is_initialized = IS_INITIALIZED.lock().map_err(|_| Error::Internal)?;

        if *is_initialized {
            return Err(Error::AlreadyInitialized);
        }

        let mut plugins = PLUGINS.lock().map_err(|_| Error::Internal)?;

        for plugin in plugins.iter_mut() {
            let c_path = CString::new(plugin.path).map_err(|_| Error::Internal)?;
            let handle = unsafe { BASS_PluginLoad(c_path.into_raw(), 0) };

            if handle == 0 {
                for plugin in plugins.iter().take_while(|p| p.handle != 0) {
                    unsafe {
                        BASS_PluginFree(plugin.handle);
                    }
                }

                return Err(Error::FailedToLoadPlugins);
            } else {
                plugin.handle = handle;
            }
        }

        unsafe {
            if BASS_Init(
                -1,
                sample_rate,
                0,
                std::ptr::null_mut(),
                std::ptr::null_mut(),
            ) == 0
            {
                return Err(Error::FailedToOpenDevice);
            }
        };

        *is_initialized = true;

        Ok(Self)
    }

    pub fn devices() -> Vec<Device> {
        let mut devices = Vec::new();
        let mut info = BassDeviceInfo {
            name: std::ptr::null_mut(),
            driver: std::ptr::null_mut(),
            flags: 0,
        };
        let mut i = 0;

        while unsafe { BASS_GetDeviceInfo(i, &mut info) } != 0 {
            let name = unsafe { std::ffi::CStr::from_ptr(info.name) }
                .to_string_lossy()
                .into_owned();

            devices.push(Device { name });

            i += 1;
        }

        devices
    }
}

impl Drop for OutputDevice {
    fn drop(&mut self) {
        let mut is_initialized = IS_INITIALIZED.lock().expect("internal error");

        if unsafe { BASS_Free() } == 0 {
            panic!("failed to close device");
        }

        let mut plugins = PLUGINS.lock().expect("internal error");

        for plugin in plugins.iter_mut() {
            if plugin.handle != 0 {
                unsafe {
                    if BASS_PluginFree(plugin.handle) == 0 {
                        panic!("failed to unload plugin");
                    }
                    plugin.handle = 0;
                }
            }
        }

        *is_initialized = false;
    }
}
