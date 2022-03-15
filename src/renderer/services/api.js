/** @typedef {import('../../shared/types').ApiTrack} ApiTrack */
/** @typedef {import('../../shared/types').ApiRelease} ApiRelease */
/** @typedef {import('../../shared/types').PlayerTrack} PlayerTrack */

const { api } = window;

export const settings = {
  getValue(key, defaultValue) {
    return api.invoke("settings:getValue", key, defaultValue);
  },

  setValue(key, value) {
    return api.invoke("settings:setValue", key, value);
  },

  openPathSelector() {
    return api.invoke("settings:openPathSelector");
  },
};

export const grass = {
  /** @return {Promise<PlayerTrack>} */
  getTrack() {
    return api.invoke("grass:get-track");
  },

  /** Set a playlist on the player, this will stop the playback
   * @param {DatabaseTrack[]} tracks
   * @return {Promise<void>} */
  setPlaylist(tracks) {
    return api.invoke("grass:set-playlist", tracks);
  },

  /** @return {Promise<DatabaseTrack[]>} */
  getPlaylist() {
    return api.invoke("grass:get-playlist");
  },

  /** @return {Promise<void>} */
  play() {
    return api.invoke("grass:play");
  },

  /** @return {Promise<void>} */
  pause() {
    return api.invoke("grass:pause");
  },

  /** Change the current track to the next one, it will go to the first track if there is no one
   * @return {Promise<void>} */
  next() {
    return api.invoke("grass:next");
  },

  /** Change the current track to the previous one, it will go to the last track if there is no one
   * @return {Promise<void>} */
  previous() {
    return api.invoke("grass:previous");
  },

  /** @param {number} position
   * @return {Promise<void>} */
  seek(position) {
    return api.invoke("grass:seek", position);
  },

  /** Change the current track to the track with the specified index
   * @param {number} index
   * @return {Promise<void>} */
  skipToIndex(index) {
    return api.invoke("grass:skip-to-index", index);
  },

  /** It will return STOPPED if there is nothing set in the player
   * @return {Promise<("STOPPED | PAUSED | PLAYING")>} */
  getPlaybackStatus() {
    return api.invoke("grass:get-playback-status");
  },
};

export const library = {
  /** @return {Promise<ApiRelease[]>} */
  getReleases() {
    return api.invoke("library:get-releases");
  },

  /** @return {Promise<ApiRelease>} */
  getRelease(releaseId) {
    return api.invoke("library:get-release", releaseId);
  },

  /** Get the associated tracks of the given release
   * @param {number} releaseId
   * @return {Promise<ApiTrack[]>} */
  getReleaseTracks(releaseId) {
    return api.invoke("library:get-release-tracks", releaseId);
  },
};
