import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Track, Artist, Album } from './types';
import FileSelector from './components/FileSelector';
import Player from './components/Player';
import Nav from './components/Nav';
import NowPlayingView from './views/NowPlayingView';
import LibraryView from './views/LibraryView';
import { MusicNoteIcon } from './components/Icons';

// Helper to safely encode large byte arrays to base64
const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// Promisified helper to read metadata from a file
const readTrackMetadata = (file: File): Promise<Track> => {
  return new Promise((resolve) => {
    // @ts-ignore - jsmediatags is loaded from a script tag
    window.jsmediatags.read(file, {
      onSuccess: (tag) => {
        const { title, artist, album, picture } = tag.tags;
        let pictureUrl = '';
        if (picture) {
          const base64String = uint8ArrayToBase64(new Uint8Array(picture.data));
          pictureUrl = `data:${picture.format};base64,${base64String}`;
        }
        resolve({
          file,
          name: title || file.name.replace(/\.[^/.]+$/, ""),
          artist: artist || 'Unknown Artist',
          album: album || 'Unknown Album',
          picture: pictureUrl || undefined,
        });
      },
      onError: () => {
        resolve({
          file,
          name: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Unknown Artist',
          album: 'Unknown Album',
        });
      }
    });
  });
};

// Helper function for batch processing files
const processFilesBatch = async (
  files: File[],
  onProgress: (progress: number) => void
): Promise<Track[]> => {
  const BATCH_SIZE = 50;
  const tracks: Track[] = [];
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchTracks = await Promise.all(batch.map(readTrackMetadata));
    tracks.push(...batchTracks);

    const progress = Math.round(((i + batch.length) / files.length) * 100);
    onProgress(progress);

    // Yield to the main thread to prevent UI freezing
    await new Promise(resolve => setTimeout(resolve, 10)); 
  }
  return tracks;
};


function App() {
  const [library, setLibrary] = useState<Track[]>([]);
  const [playQueue, setPlayQueue] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [trackUrl, setTrackUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [view, setView] = useState<'now-playing' | 'library'>('now-playing');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const addFolderInputRef = useRef<HTMLInputElement>(null);
  const addFilesInputRef = useRef<HTMLInputElement>(null);
  
  const currentTrack = currentTrackIndex !== null ? playQueue[currentTrackIndex] : null;

  // Effect to derive artists and albums from library
  useEffect(() => {
    const artistsMap = new Map<string, Track[]>();
    const albumsMap = new Map<string, { album: Album, tracks: Track[] }>();

    library.forEach(track => {
      const artistName = track.artist || 'Unknown Artist';
      if (!artistsMap.has(artistName)) artistsMap.set(artistName, []);
      artistsMap.get(artistName)!.push(track);

      const albumIdentifier = `${track.album || 'Unknown Album'}%_%${track.artist || 'Unknown Artist'}`;
      if (!albumsMap.has(albumIdentifier)) {
        albumsMap.set(albumIdentifier, {
          album: {
            name: track.album || 'Unknown Album',
            artist: track.artist || 'Unknown Artist',
            picture: track.picture,
            tracks: []
          },
          tracks: []
        });
      }
      albumsMap.get(albumIdentifier)!.tracks.push(track);
    });
    
    const newArtists: Artist[] = Array.from(artistsMap.entries()).map(([name, tracks]) => ({ 
        name, 
        tracks, 
        albums: []
    })).sort((a,b) => a.name.localeCompare(b.name));
    
    const newAlbums: Album[] = Array.from(albumsMap.values()).map(({ album, tracks }) => ({
      ...album,
      tracks,
      picture: tracks.find(t => t.picture)?.picture || album.picture,
    })).sort((a,b) => a.name.localeCompare(b.name));

    setArtists(newArtists);
    setAlbums(newAlbums);
  }, [library]);

  // Effect to manage audio source URL
  useEffect(() => {
    if (currentTrack) {
      const newUrl = URL.createObjectURL(currentTrack.file);
      setTrackUrl(newUrl);
      
      return () => {
        URL.revokeObjectURL(newUrl);
      };
    } else {
      setTrackUrl('');
    }
  }, [currentTrack]);

  // Effect to manage play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, trackUrl]);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const playNext = useCallback(() => {
    if (playQueue.length === 0) return;
    const nextIndex = ((currentTrackIndex ?? -1) + 1) % playQueue.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [currentTrackIndex, playQueue.length]);

  const handleTrackEnd = () => {
    playNext();
  };
  
  const onFilesSelected = async (files: File[]) => {
      setIsLoading(true);
      setLoadingProgress(0);
      setLibrary([]);
      setPlayQueue([]);
      setCurrentTrackIndex(null);

      const audioFiles = files.filter(file => file.type.startsWith('audio/'));
      const newTracks = await processFilesBatch(audioFiles, setLoadingProgress);
      newTracks.sort((a, b) => a.name.localeCompare(b.name));
      
      setLibrary(newTracks);
      setPlayQueue(newTracks);
      setCurrentTrackIndex(newTracks.length > 0 ? 0 : null);
      if (newTracks.length > 0) {
        setIsPlaying(true);
      }
      setIsLoading(false);
  };
  
  const handleAddTracks = async (files: File[]) => {
      setIsLoading(true);
      setLoadingProgress(0);
      const audioFiles = files.filter(file => file.type.startsWith('audio/'));
      const newTracks = await processFilesBatch(audioFiles, setLoadingProgress);

      setLibrary(prevLibrary => {
        const existingKeys = new Set(prevLibrary.map(t => `${t.name}-${t.artist}-${t.file.size}`));
        const uniqueNewTracks = newTracks.filter(newTrack => 
            !existingKeys.has(`${newTrack.name}-${newTrack.artist}-${newTrack.file.size}`)
        );
        return [...prevLibrary, ...uniqueNewTracks].sort((a, b) => a.name.localeCompare(b.name));
      });
      setIsLoading(false);
  };

  const handleAddFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) handleAddTracks(Array.from(event.target.files));
  };

  const handleAddFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) handleAddTracks(Array.from(event.target.files));
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };
  
  const handlePlayFromLibrary = (tracks: Track[], startIndex: number) => {
    setPlayQueue(tracks);
    setCurrentTrackIndex(startIndex);
    setIsPlaying(true);
    setView('now-playing');
  };

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying(prev => !prev);
  }, [currentTrack]);
  
  const playPrev = useCallback(() => {
    if (playQueue.length === 0) return;
    const prevIndex = ((currentTrackIndex ?? 0) - 1 + playQueue.length) % playQueue.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  }, [currentTrackIndex, playQueue.length]);
  
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const handleVolumeChange = (volumeValue: number) => {
    if (audioRef.current) {
        audioRef.current.volume = volumeValue;
        setVolume(volumeValue);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
            <MusicNoteIcon className="w-24 h-24 text-teal-500 animate-bounce" />
            <p className="text-lg mt-4 text-gray-400">Scanning your music...</p>
            <div className="w-1/2 max-w-sm bg-gray-700 rounded-full h-2.5 mt-4">
              <div 
                className="bg-teal-500 h-2.5 rounded-full" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-gray-500">{loadingProgress}%</p>
        </div>
      );
    }

    if (library.length === 0) {
      return <FileSelector onFilesSelected={onFilesSelected} />;
    }

    return (
      <div className="flex-grow overflow-y-auto pb-24">
          {view === 'now-playing' && (
              <NowPlayingView 
                  currentTrack={currentTrack}
                  playQueue={playQueue}
                  currentTrackIndex={currentTrackIndex}
                  onTrackSelect={selectTrack}
              />
          )}
          {view === 'library' && (
              <LibraryView 
                  library={library}
                  artists={artists}
                  albums={albums}
                  onPlay={handlePlayFromLibrary}
                  onAddFolderClick={() => addFolderInputRef.current?.click()}
                  onAddFilesClick={() => addFilesInputRef.current?.click()}
              />
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans h-screen">
      {library.length > 0 && <Nav view={view} setView={setView} />}
      
      <main className="flex-grow flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      {currentTrack && (
        <footer className="bg-gray-800/80 backdrop-blur-md p-4 z-20 mt-auto">
          <Player
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onNext={playNext}
            onPrev={playPrev}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            trackName={currentTrack.name}
            artistName={currentTrack.artist}
          />
        </footer>
      )}
      
      <audio 
        ref={audioRef} 
        src={trackUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnd}
        preload="auto"
      />
      <input
          type="file" ref={addFolderInputRef} onChange={handleAddFolderChange}
          className="hidden" {...{ webkitdirectory: "true", directory: "true" }} multiple
      />
      <input
          type="file" ref={addFilesInputRef} onChange={handleAddFilesChange}
          className="hidden" multiple accept="audio/*"
      />
    </div>
  );
}

export default App;