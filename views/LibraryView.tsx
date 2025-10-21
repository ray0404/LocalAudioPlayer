import React, { useState } from 'react';
import { Track, Artist, Album } from '../types';
import { 
    FilePlusIcon, FolderPlusIcon, MusicNoteIcon, UserGroupIcon, RectangleStackIcon, MusicalNoteIcon 
} from '../components/Icons';

type LibraryViewMode = 'songs' | 'artists' | 'albums' | 'playlists';

interface LibraryViewProps {
    library: Track[];
    artists: Artist[];
    albums: Album[];
    onPlay: (tracks: Track[], startIndex: number) => void;
    onAddFolderClick: () => void;
    onAddFilesClick: () => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ library, artists, albums, onPlay, onAddFolderClick, onAddFilesClick }) => {
    const [mode, setMode] = useState<LibraryViewMode>('songs');
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    const renderTabs = () => (
        <div className="px-4 pt-4 sticky top-0 bg-gray-900 z-10">
            <div className="flex justify-between items-center mb-4">
                 <h1 className="text-2xl font-bold">Library</h1>
                 <div className="flex items-center space-x-2">
                    <button onClick={onAddFolderClick} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="Add from folder">
                        <FolderPlusIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                    </button>
                    <button onClick={onAddFilesClick} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="Add files">
                        <FilePlusIcon className="w-6 h-6 text-gray-400 hover:text-white" />
                    </button>
                </div>
            </div>
            <div className="flex space-x-2 border-b border-gray-700">
                {([['songs', 'Songs'], ['artists', 'Artists'], ['albums', 'Albums'], ['playlists', 'Playlists']] as const).map(([key, name]) => (
                    <button 
                        key={key} 
                        onClick={() => { setMode(key); setSelectedAlbum(null); setSelectedArtist(null); }}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${mode === key ? 'border-b-2 border-teal-500 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
    
    const renderSongs = (tracks: Track[], context: Track[]) => (
        <ul className="space-y-1 p-4">
            {tracks.map((track, index) => (
                <li key={index} onClick={() => onPlay(context, context.indexOf(track))} className="flex items-center p-3 rounded-md cursor-pointer bg-gray-800 hover:bg-gray-700/70">
                    {track.picture ? <img src={track.picture} className="w-10 h-10 rounded-md mr-4 object-cover" /> : <MusicNoteIcon className="w-10 h-10 rounded-md mr-4 p-2 bg-gray-700 text-gray-500" />}
                    <div className="flex-1 truncate">
                        <p className="font-medium text-sm">{track.name}</p>
                        <p className="text-xs text-gray-400">{track.artist}</p>
                    </div>
                </li>
            ))}
        </ul>
    );

    const renderArtists = () => (
        <ul className="space-y-1 p-4">
            {artists.map((artist, index) => (
                <li key={index} onClick={() => setSelectedArtist(artist)} className="flex items-center p-3 rounded-md cursor-pointer bg-gray-800 hover:bg-gray-700/70">
                    <UserGroupIcon className="w-10 h-10 rounded-full mr-4 p-2 bg-gray-700 text-gray-500" />
                    <p className="font-medium">{artist.name}</p>
                </li>
            ))}
        </ul>
    );

    const renderAlbums = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
            {albums.map((album, index) => (
                <div key={index} onClick={() => setSelectedAlbum(album)} className="flex flex-col items-center text-center cursor-pointer group">
                    <div className="aspect-square w-full bg-gray-800 rounded-md flex items-center justify-center overflow-hidden transition-transform transform group-hover:scale-105">
                        {album.picture ? <img src={album.picture} className="w-full h-full object-cover" /> : <RectangleStackIcon className="w-1/2 h-1/2 text-gray-500" />}
                    </div>
                    <p className="font-semibold text-sm mt-2 truncate w-full">{album.name}</p>
                    <p className="text-xs text-gray-400 truncate w-full">{album.artist}</p>
                </div>
            ))}
        </div>
    );

    const renderContent = () => {
        if (selectedArtist) {
            return (
                <div>
                    <button onClick={() => setSelectedArtist(null)} className="text-teal-400 px-4 pt-2"> &larr; Back to Artists</button>
                    <h2 className="text-xl font-bold p-4">{selectedArtist.name}</h2>
                    {renderSongs(selectedArtist.tracks, selectedArtist.tracks)}
                </div>
            )
        }
        if (selectedAlbum) {
            return (
                <div>
                    <button onClick={() => setSelectedAlbum(null)} className="text-teal-400 px-4 pt-2">&larr; Back to Albums</button>
                    <h2 className="text-xl font-bold p-4">{selectedAlbum.name}</h2>
                    {renderSongs(selectedAlbum.tracks, selectedAlbum.tracks)}
                </div>
            )
        }
        switch (mode) {
            case 'songs': return renderSongs(library, library);
            case 'artists': return renderArtists();
            case 'albums': return renderAlbums();
            case 'playlists': return <p className="p-4 text-gray-500">Playlist functionality is coming soon.</p>;
            default: return null;
        }
    };

    return (
        <div>
            {renderTabs()}
            {renderContent()}
        </div>
    );
};

export default LibraryView;
