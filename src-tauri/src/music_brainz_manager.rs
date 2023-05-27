use http_cache_reqwest::{Cache, CacheMode, HttpCache, MokaManager};
use reqwest::{header, Client};
use reqwest_middleware::ClientWithMiddleware;
use reqwest_middleware::{ClientBuilder, RequestBuilder};
use serde::Deserialize;

const BASE_URL: &str = "https://musicbrainz.org/ws/2";

pub struct MusicBrainzManager {
    http_client: ClientWithMiddleware,
}

impl MusicBrainzManager {
    pub fn new(user_agent: &str) -> Self {
        let user_agent = user_agent.to_string();

        let http_client = ClientBuilder::new(Client::new())
            .with(Cache(HttpCache {
                mode: CacheMode::ForceCache,
                manager: MokaManager::default(),
                options: None,
            }))
            .with_init(move |request_builder: RequestBuilder| {
                request_builder.header(header::USER_AGENT, &user_agent)
            })
            .build();

        Self { http_client }
    }

    pub async fn get_release(&self, release_id: &str) -> anyhow::Result<MusicBrainzRelease> {
        let url = format!(
            "{}/release/{}?inc=artist-credits recordings&fmt=json",
            BASE_URL, release_id
        );
        let request = self.http_client.get(url).build()?;
        let response = self.http_client.execute(request).await?;
        let release: MusicBrainzRelease = response.json().await?;
        Ok(release)
    }
}

#[derive(Deserialize)]
pub struct MusicBrainzRelease {
    pub id: String,
    #[serde(rename = "title")]
    pub name: String,
    #[serde(rename = "artist-credit")]
    pub artist_credit: Vec<MusicBrainzArtistCredit>,
    pub media: Vec<MusicBrainzMedia>,
}

#[derive(Deserialize)]
pub struct MusicBrainzArtistCredit {
    pub joinphrase: String,
    pub name: String,
    pub artist: MusicBrainzArtist,
}

#[derive(Deserialize)]
pub struct MusicBrainzMedia {
    pub tracks: Vec<MusicBrainzTrack>,
}

#[derive(Deserialize)]
pub struct MusicBrainzArtist {
    pub id: String,
    pub name: String,
}

#[derive(Deserialize)]
pub struct MusicBrainzTrack {
    pub id: String,
    #[serde(rename = "title")]
    pub name: String,
    #[serde(rename = "artist-credit")]
    pub artist_credit: Vec<MusicBrainzArtistCredit>,
}
