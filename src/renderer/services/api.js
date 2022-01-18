const { api } = window;

export const grass = {
  getTrackPosition() {
    return api.invoke("grass:getTrackPosition");
  },

  setPlaylist(tracks) {
    return api.invoke("grass:setPlaylist", tracks);
  },

  play() {
    return api.invoke("grass:play");
  },

  pause() {
    return api.invoke("grass:pause");
  },

  next() {
    return api.invoke("grass:next");
  },

  previous() {
    return api.invoke("grass:previous");
  },

  skipToTrack(index) {
    return api.invoke("grass:skipToTrack", index);
  },

  getPlaybackState() {
    return api.invoke("grass:getPlaybackState");
  },

  setTrackPosition(position) {
    return api.invoke("grass:setTrackPosition", position);
  },

  getCurrentTrack() {
    return api.invoke("grass:getCurrentTrack");
  },
};

export const library = {
  /** @return {Promise<any[]>} */
  getReleases() {
    return api.invoke("library:getReleases");
  },

  /** @return {Promise<any>} */
  getRelease(releaseId) {
    return api.invoke("library:getRelease", releaseId);
  },

  /** @param {number} releaseId
   * @return {Promise<any[]>} */
  getTracks(releaseId) {
    return api.invoke("library:getTracks", releaseId);
  },
};
