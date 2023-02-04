import { invoke } from "@tauri-apps/api";

const Player = {
  /** @returns {Promise<void>} */
  play() {
    return invoke("player_play");
  },

  /** @returns {Promise<void>} */
  pause() {
    return invoke("player_pause");
  },

  /** @returns {Promise<void>} */
  stop() {
    return invoke("player_stop");
  },

  /** @param trackIndex {number} */
  skipToTrack(trackIndex) {
    return invoke("player_skip_to_track", { trackIndex });
  },

  /** @returns {Promise<void>} */
  next() {
    return invoke("player_next");
  },

  /** @returns {Promise<void>} */
  previous() {
    return invoke("player_previous");
  },

  /**
   * @param seekTime {number}
   * @returns {Promise<void>}
   */
  seek(seekTime) {
    return invoke("player_seek", { seekTime });
  },

  /**
   * @param paths {string[]}
   * @returns {Promise<void>}
   */
  setPlaylist(paths) {
    return invoke("player_set_playlist", { paths });
  },
};

export default Player;
