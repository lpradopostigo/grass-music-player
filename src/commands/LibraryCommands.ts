import { invoke } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { LibraryReleasesItem } from "../../src-tauri/bindings/LibraryReleasesItem";
import { LibraryRelease } from "../../src-tauri/bindings/LibraryRelease";
import { LibraryArtistsItem } from "../../src-tauri/bindings/LibraryArtistsItem";
import { LibraryArtist } from "../../src-tauri/bindings/LibraryArtist";
import { PlayerTrack } from "../../src-tauri/bindings/PlayerTrack";
import { SearchResult } from "../../src-tauri/bindings/SearchResult";

const LibraryCommands = {
  async getLibraryReleases(): Promise<LibraryReleasesItem[]> {
    const releases = await invoke<LibraryReleasesItem[]>(
      "library_get_library_releases"
    );

    for (const release of releases) {
      if (release.thumbnailSrc) {
        release.thumbnailSrc = convertFileSrc(release.thumbnailSrc);
      }
    }

    return releases;
  },

  async getLibraryRelease(releaseId: string): Promise<LibraryRelease> {
    const release = await invoke<LibraryRelease>(
      "library_get_library_release",
      { releaseId }
    );

    if (release?.coverArtSrc) {
      release.coverArtSrc = convertFileSrc(release.coverArtSrc);
    }

    return release;
  },

  async getLibraryArtists(): Promise<LibraryArtistsItem[]> {
    const artists = await invoke<LibraryArtistsItem[]>(
      "library_get_library_artists"
    );

    for (const artist of artists) {
      artist.thumbnailSrcs = artist.thumbnailSrcs.map((src) =>
        convertFileSrc(src)
      );
    }

    return artists;
  },

  async getLibraryArtist(artistId: string): Promise<LibraryArtist> {
    const artist = await invoke<LibraryArtist>("library_get_library_artist", {
      artistId,
    });

    if (artist) {
      for (const release of artist.releases) {
        if (release.thumbnailSrc) {
          release.thumbnailSrc = convertFileSrc(release.thumbnailSrc);
        }
      }
    }

    return artist;
  },

  async getPlayerTrack(trackPath: string): Promise<PlayerTrack> {
    const track = await invoke<PlayerTrack>("library_get_player_track", {
      trackPath,
    });

    if (track?.thumbnailSrc) {
      track.thumbnailSrc = convertFileSrc(track.thumbnailSrc);
    }

    return track;
  },

  async search(query: string): Promise<SearchResult> {
    const result = await invoke<SearchResult>("library_search", { query });

    for (const release of result.releases) {
      if (release.thumbnailSrc) {
        release.thumbnailSrc = convertFileSrc(release.thumbnailSrc);
      }
    }

    for (const artist of result.artists) {
      artist.thumbnailSrcs = artist.thumbnailSrcs.map((src) =>
        convertFileSrc(src)
      );
    }

    return result;
  },

  scan(clearData = false): Promise<void> {
    return invoke("library_scan", { clearData });
  },

  scanCoverArt(): Promise<void> {
    return invoke("library_scan_cover_art");
  },
};

export default LibraryCommands;
