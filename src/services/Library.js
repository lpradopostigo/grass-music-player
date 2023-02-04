import { invoke } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/tauri";

/**
 * @typedef {import("../../src-tauri/bindings/Release").Release} Release
 *
 * @typedef {import("../../src-tauri/bindings/Track").Track} Track
 *
 * @typedef {import("../../src-tauri/bindings/ArtistCredit").ArtistCredit} ArtistCredit
 */

const Library = {
  /**
   * @param trackId {string}
   * @returns {Promise<Track>}
   */
  findTrack(trackId) {
    return invoke("library_find_track", { trackId });
  },

  /**
   * @param releaseId {string}
   * @returns {Promise<unknown>}
   */
  findTracksByReleaseId(releaseId) {
    return invoke("library_find_tracks_by_release_id", { releaseId });
  },

  /**
   * @param path {string}
   * @returns {Promise<Track>}
   */
  findTrackByPath(path) {
    return invoke("library_find_track_by_path", { path });
  },

  /**
   * @param releaseId {string}
   * @returns {Promise<Release>}
   */
  findRelease(releaseId) {
    return invoke("library_find_release", { releaseId });
  },

  /** @returns {Promise<Release[]>} */
  findAllReleases() {
    return invoke("library_find_all_releases");
  },

  /**
   * @param artistCreditId {string}
   * @returns {Promise<ArtistCredit>}
   */
  findArtistCredit(artistCreditId) {
    return invoke("library_find_artist_credit", { artistCreditId });
  },

  /**
   * @param releaseId {string}
   * @returns {Promise<string>}
   */
  async findReleaseThumbnail(releaseId) {
    const path = await invoke("library_thumbnail_path", { releaseId });
    return convertFileSrc(path);
  },

  /**
   * @param releaseId
   * @returns {Promise<string>}
   */
  async findReleasePicture(releaseId) {
    const path = await invoke("library_picture_path", { releaseId });
    return convertFileSrc(path);
  },

  /** @returns {Promise<void>} */
  scan() {
    return invoke("library_scan");
  },

  /** @returns {Promise<void>} */
  scanCoverArt() {
    return invoke("library_scan_cover_art");
  },
};

export default Library;
