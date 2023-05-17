use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbArtist {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbArtistCredit {
    pub id: String,
    pub name: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbArtistCreditPart {
    pub artist_credit_id: String,
    pub artist_id: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbRelease {
    pub id: String,
    pub artist_credit_id: String,
    pub name: String,
    pub date: String,
    pub total_tracks: u16,
    pub total_discs: u16,
}

#[derive(Serialize, TS)]
#[ts(export)]
#[serde(rename_all = "camelCase")]
pub struct DbTrack {
    pub id: String,
    pub release_id: String,
    pub artist_credit_id: String,
    pub name: String,
    pub length: f64,
    pub track_number: u16,
    pub disc_number: u16,
    pub path: String,
}
