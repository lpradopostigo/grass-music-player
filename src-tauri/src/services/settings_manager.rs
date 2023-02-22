use crate::global::try_get_settings_file_path;
use fs::File;
use serde::{Deserialize, Serialize};
use serde_json::{from_reader, to_writer};
use std::{fs, io};
use ts_rs::TS;

pub struct SettingsManager;

impl SettingsManager {
    pub fn setup() -> io::Result<()> {
        let settings_file_path = try_get_settings_file_path();

        if !settings_file_path.exists() {
            let settings = Settings { library_path: None };

            let file = File::create(settings_file_path)?;
            to_writer(file, &settings).unwrap();
        }

        Ok(())
    }

    pub fn get() -> Settings {
        let settings_file_path = try_get_settings_file_path();
        let file = File::open(settings_file_path).unwrap();
        let settings: Settings = from_reader(file).unwrap();
        settings
    }

    pub fn set(settings: &Settings) -> io::Result<()> {
        let settings_file_path = try_get_settings_file_path();
        let file = File::create(settings_file_path)?;
        to_writer(file, settings).unwrap();
        Ok(())
    }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub library_path: Option<String>,
}
