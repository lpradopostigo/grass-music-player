use crate::music_brainz_manager::MusicBrainzManager;
use crate::parser::{Parser, ParserError, ParserRelease, ParserReleaseTrack, ParserTrack};
use std::path::Path;

pub struct Scanner {
    parser: Parser,
}

impl Scanner {
    pub fn new(cover_art_dir: &Path) -> Self {
        let music_brainz_manager = MusicBrainzManager::new(
            "GrassMusicPlayer ( https://github.com/lpradopostigo/grass-music-player )",
        );

        let parser = Parser::new(music_brainz_manager, cover_art_dir.into());
        Self { parser }
    }

    pub async fn scan_file(&self, path: &Path) -> Result<ParserTrack, ParserError> {
        self.parser.parse_file(path).await
    }

    pub async fn scan_dir<F>(
        &self,
        path: &Path,
        progress_callback: F,
    ) -> anyhow::Result<(Vec<ParserRelease>, Vec<ParserError>)>
    where
        F: Fn((usize, usize)),
    {
        self.parser.parse_dir(path, progress_callback).await
    }
}

pub type ScannerTrack = ParserTrack;
pub type ScannerRelease = ParserRelease;
pub type ScannerReleaseTrack = ParserReleaseTrack;
