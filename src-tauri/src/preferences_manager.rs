use fs::File;
use serde::{Deserialize, Serialize};
use serde_json::{from_reader, to_writer};
use std::fs;
use std::path::PathBuf;
use ts_rs::TS;

pub struct PreferencesManager {
    file_path: PathBuf,
}

impl PreferencesManager {
    pub fn new(file_path: PathBuf) -> anyhow::Result<PreferencesManager> {
        if !file_path.exists() {
            let settings = Preferences { library_path: None };
            let file = File::create(&file_path)?;
            to_writer(file, &settings)?;
        }

        Ok(Self { file_path })
    }

    pub fn get(&self) -> anyhow::Result<Preferences> {
        let file = File::open(&self.file_path)?;
        let settings: Preferences = from_reader(file)?;

        Ok(settings)
    }

    pub fn set(&self, preferences: &Preferences) -> anyhow::Result<()> {
        let file = File::create(&self.file_path)?;
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
