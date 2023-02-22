import { invoke } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Release } from "../../src-tauri/bindings/Release";
import { Track } from "../../src-tauri/bindings/Track";
import { ArtistCredit } from "../../src-tauri/bindings/ArtistCredit";

const Library = {
  findTrack(trackId: string): Promise<Track> {
    return invoke("library_find_track", { trackId });
  },

  findTracksByReleaseId(releaseId: string): Promise<Track[]> {
    return invoke("library_find_tracks_by_release_id", { releaseId });
  },

  findTrackByPath(path: string): Promise<Track> {
    return invoke("library_find_track_by_path", { path });
  },

  findRelease(releaseId: string): Promise<Release> {
    return invoke("library_find_release", { releaseId });
  },

  findAllReleases(): Promise<Release[]> {
    return invoke("library_find_all_releases");
  },

  findArtistCredit(artistCreditId: string): Promise<ArtistCredit> {
    return invoke("library_find_artist_credit", { artistCreditId });
  },

  async findReleaseThumbnail(releaseId: string): Promise<string | null> {
    const path = await invoke<string | null>("library_find_thumbnail", {
      releaseId,
    });
    return path ? convertFileSrc(path) : null;
  },

  async findReleasePicture(releaseId: string): Promise<string | null> {
    const path = await invoke<string | null>("library_find_picture", {
      releaseId,
    });
    return path ? convertFileSrc(path) : null;
  },

  scan(clearData = false): Promise<void> {
    return invoke("library_scan", { clearData });
  },

  scanCoverArt(clearData = false): Promise<void> {
    return invoke("library_scan_cover_art", { clearData });
  },
};

export default Library;
