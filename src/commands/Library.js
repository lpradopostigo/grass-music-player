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
   * @returns {Promise<string | null>}
   */
  async findReleaseThumbnail(releaseId) {
    const path = await invoke("library_find_thumbnail", { releaseId });
    return path ? convertFileSrc(path) : null;
  },

  /**
   * @param releaseId
   * @returns {Promise<string | null>}
   */
  async findReleasePicture(releaseId) {
    const path = await invoke("library_find_picture", { releaseId });
    return path ? convertFileSrc(path) : null;
  },

  /**
   * @param [clearData] {boolean}
   * @returns {Promise<void>}
   */
  scan(clearData = false) {
    return invoke("library_scan", { clearData });
  },

  /**
   * @param [clearData] {boolean}
   * @returns {Promise<void>}
   */
  scanCoverArt(clearData = false) {
    return invoke("library_scan_cover_art", { clearData });
  },
};

export default Library;
