/** @typedef {import('../../shared/types').ApiTrack} ApiTrack */
/** @typedef {import('../../shared/types').ApiRelease} ApiRelease */
const { api } = window;

export const grass = {
  /** Get the current position of the current track
   * @return {Promise<{current: number, total: number}>} */
  getTrackPosition() {
    return api.invoke("grass:getTrackPosition");
  },

  /** @param {number} position
   * @return {Promise<void>} */
  setTrackPosition(position) {
    return api.invoke("grass:setTrackPosition", position);
  },

  /** Set a playlist on the player, this will stop the playback
   * @param {DatabaseTrack[]} tracks
   * @return {Promise<void>} */
  setPlaylist(tracks) {
    return api.invoke("grass:setPlaylist", tracks);
  },

  /** Start or resume the playback, does nothing if there is nothing to play or resume
   * @return {Promise<void>} */
  play() {
    return api.invoke("grass:play");
  },

  /** Pause the playback, does nothing if there is nothing to pause
   * @return {Promise<void>} */
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

  /** Change the current track to the track with the specified index
   * @param {number} index
   * @return {Promise<void>} */
  skipToTrack(index) {
    return api.invoke("grass:skipToTrack", index);
  },

  /** It will return STOPPED if there is nothing set in the player
   * @return {Promise<("STOPPED | PAUSED | PLAYING")>} */
  getPlaybackStatus() {
    return api.invoke("grass:getPlaybackStatus");
  },

  /** Get the current track in the player
   * @return {Promise<ApiTrack>} */
  getCurrentTrack() {
    return api.invoke("grass:getCurrentTrack");
  },
};

export const library = {
  /** @return {Promise<ApiRelease[]>} */
  getReleases() {
    return api.invoke("library:getReleases");
  },

  /** @return {Promise<ApiRelease>} */
  getRelease(releaseId) {
    return api.invoke("library:getRelease", releaseId);
  },

  /** Get the associated tracks of the given release
   * @param {number} releaseId
   * @return {Promise<ApiTrack[]>} */
  getReleaseTracks(releaseId) {
    return api.invoke("library:getReleaseTracks", releaseId);
  },
};
