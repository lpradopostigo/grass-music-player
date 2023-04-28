use crate::global::try_get_settings_file_path;
use anyhow::Result;
use fs::File;
use serde::{Deserialize, Serialize};
use serde_json::{from_reader, to_writer};
use std::{fs};
use ts_rs::TS;

pub struct PreferencesManager;

impl PreferencesManager {
    pub fn setup() -> Result<()> {
        let settings_file_path = try_get_settings_file_path();

        if !settings_file_path.exists() {
            let settings = Preferences { library_path: None };

            let file = File::create(settings_file_path)?;
            to_writer(file, &settings).unwrap();
        }

        Ok(())
    }

    pub fn get() -> Result<Preferences> {
        let settings_file_path = try_get_settings_file_path();
        let file = File::open(settings_file_path)?;
        let settings: Preferences = from_reader(file)?;

        Ok(settings)
    }

    pub fn set(preferences: &Preferences) -> Result<()> {
        let settings_file_path = try_get_settings_file_path();
        let file = File::create(settings_file_path)?;
        to_writer(file, preferences)?;
        Ok(())
    }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct Preferences {
    pub library_path: Option<String>,
}
