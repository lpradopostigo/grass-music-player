const { api } = window;

export const audioPlayer = {};

export const library = {
  /** @return {Promise<import("../../main/services/Database.js").Release[]>} */
  getReleases() {
    return api.invoke('library:getReleases');
  },

  /** @param {number} releaseId
   * @return {Promise<import("../../main/services/Database.js").Track[]>} */
  getTracks(releaseId) {
    return api.invoke('library:getTracks', releaseId);
  },
};
