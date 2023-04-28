import { invoke } from "@tauri-apps/api";

const PlayerCommands = {
  play(): Promise<void> {
    return invoke("player_play");
  },

  pause(): Promise<void> {
    return invoke("player_pause");
  },

  stop(): Promise<void> {
    return invoke("player_stop");
  },

  skipToTrack(trackIndex: number): Promise<void> {
    return invoke("player_skip_to_track", { trackIndex });
  },

  next(): Promise<void> {
    return invoke("player_next");
  },

  previous(): Promise<void> {
    return invoke("player_previous");
  },

  seek(seekTime: number): Promise<void> {
    return invoke("player_seek", { seekTime });
  },

  setPlaylist(paths: string[]): Promise<void> {
    return invoke("player_set_playlist", { paths });
  },
};

export default PlayerCommands;
