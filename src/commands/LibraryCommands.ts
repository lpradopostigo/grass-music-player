import { invoke } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { PlayerTrack } from "../../src-tauri/bindings/PlayerTrack.ts";
import { SearchResult } from "../../src-tauri/bindings/SearchResult.ts";
import { ReleaseOverview } from "../../src-tauri/bindings/ReleaseOverview.ts";
import { Release } from "../../src-tauri/bindings/Release.ts";
import { ArtistOverview } from "../../src-tauri/bindings/ArtistOverview.ts";
import { Artist } from "../../src-tauri/bindings/Artist.ts";

const LibraryCommands = {
  async getReleaseOverviews(): Promise<ReleaseOverview[]> {
    const releases = await invoke<ReleaseOverview[]>(
      "library_get_release_overviews"
    );

    for (const release of releases) {
      if (release.thumbnailSrc) {
        release.thumbnailSrc = convertFileSrc(release.thumbnailSrc);
      }
    }

    return releases;
  },

  async getRelease(releaseId: string): Promise<Release> {
    const release = await invoke<Release>("library_get_release", {
      releaseId,
    });

    if (release?.coverArtSrc) {
      release.coverArtSrc = convertFileSrc(release.coverArtSrc);
    }

    return release;
  },

  async getArtistOverviews(): Promise<ArtistOverview[]> {
    const artists = await invoke<ArtistOverview[]>(
      "library_get_artist_overviews"
    );

    for (const artist of artists) {
      artist.thumbnailSrcs = artist.thumbnailSrcs.map((src) =>
        convertFileSrc(src)
      );
    }

    return artists;
  },

  async getArtist(artistId: string): Promise<Artist> {
    const artist = await invoke<Artist>("library_get_artist", {
      artistId,
    });

    if (artist) {
      for (const release of artist.releases) {
        if (release.thumbnailSrc) {
          release.thumbnailSrc = convertFileSrc(release.thumbnailSrc);
        }
      }

      if (artist.backgroundSrc) {
        artist.backgroundSrc = convertFileSrc(artist.backgroundSrc);
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
};

export default LibraryCommands;
