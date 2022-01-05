const { api } = window;

export const audioPlayer = {};

export const library = {
  /** @return {Promise<any[]>} */
  getReleases() {
    return api.invoke("library:getReleases");
  },

  /** @param {number} releaseId
   * @return {Promise<any[]>} */
  getTracks(releaseId) {
    return api.invoke("library:getTracks", releaseId);
  },
};
