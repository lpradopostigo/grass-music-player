use super::database::{Database, Settings as DatabaseSettings};

pub struct SettingsRepository;


impl SettingsRepository {
    pub async fn setup() {
        Database::create_settings_table().await.unwrap();
    }

    pub async fn find() -> Option<DatabaseSettings> {
        match Database::select_settings().await {
            Ok(settings) => Some(settings),
            Err(_) => None,
        }
    }

    pub async fn update(settings: &DatabaseSettings) -> Result<(), ()> {
        let entry_exists = Database::select_settings().await.is_ok();

        if entry_exists {
            match Database::update_settings(settings).await {
                Ok(_) => Ok(()),
                Err(_) => Err(()),
            }
        } else {
            match Database::insert_settings(settings).await {
                Ok(_) => Ok(()),
                Err(_) => Err(()),
            }
        }
    }
}
