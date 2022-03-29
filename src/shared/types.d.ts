export interface DatabaseTrack {
  id: number;
  releaseId: number;
  title: string | null;
  artist: string | null;
  trackNumber: number | null;
  discNumber: number | null;
  duration: number | null;
  filePath: string | null;
}

export interface DatabaseRelease {
  id: number;
  title: string | null;
  artist: string | null;
  year: number | null;
  numberOfTracks: number | null;
  numberOfDiscs: number | null;
  picture: Uint8Array | null;
}

export interface ApiTrack extends Omit<DatabaseTrack, "filePath"> {}

export interface ApiRelease extends DatabaseRelease {}

export interface ScannerParsedFile {
  filePath: string;
  title?: string;
  artist?: string;
  trackNumber: number | null;
  numberOfTracks: number | null;
  discNumber: number | null;
  numberOfDiscs: number | null;
  releaseTitle?: string;
  releaseArtist?: string;
  year?: number;
  picture?: Buffer;
  duration?: number;
}

export interface ScannerTrack {
  title?: string;
  artist?: string;
  trackNumber: number | null;
  discNumber: number | null;
  duration?: number;
  filePath: string;
}

export interface ScannerRelease {
  title?: string;
  artist?: string;
  numberOfTracks: number | null;
  numberOfDiscs: number | null;
  year?: number;
  picture?: Buffer;
  tracks: ScannerTrack[];
}

export interface PlayerState {
  track: {
    id: number;
    releaseId: number;
    title: string | null;
    artist: string | null;
    trackNumber: number | null;
    discNumber: number | null;
    duration: number | null;
    position: number | null;
    releaseTitle: string | null;
    releaseArtist: string | null;
    releaseYear: number | null;
    releasePicture: Uint8Array | null;
    playlistIndex: number;
  };
  playbackState: "stopped" | "playing" | "paused";
  playlist: Omit<DatabaseTrack, "filePath">[];
}
