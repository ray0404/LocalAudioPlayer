export interface Track {
  file: File;
  name: string;
  artist?: string;
  album?: string;
  picture?: string; // Base64 string for album art
}

export interface Artist {
    name: string;
    albums: Album[];
    tracks: Track[];
}

export interface Album {
    name:string;
    artist?: string;
    picture?: string;
    tracks: Track[];
}
