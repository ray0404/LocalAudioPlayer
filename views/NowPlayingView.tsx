import React from 'react';
import { Track } from '../types';
import PlayQueue from '../components/Playlist';
import { MusicNoteIcon } from '../components/Icons';

interface NowPlayingViewProps {
    currentTrack: Track | null;
    playQueue: Track[];
    currentTrackIndex: number | null;
    onTrackSelect: (index: number) => void;
}

const NowPlayingView: React.FC<NowPlayingViewProps> = ({ currentTrack, playQueue, currentTrackIndex, onTrackSelect }) => {
    return (
        <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md aspect-square bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center mb-6 overflow-hidden">
                    {currentTrack?.picture ? (
                        <img src={currentTrack.picture} alt={currentTrack.album} className="w-full h-full object-cover" />
                    ) : (
                        <MusicNoteIcon className="w-32 h-32 text-gray-500" />
                    )}
                </div>
                <h3 className="text-2xl font-bold truncate max-w-full px-4">{currentTrack?.name || 'No track selected'}</h3>
                <p className="text-gray-400 mb-6">{currentTrack?.artist || 'Unknown Artist'}</p>
            </div>
            <div className="w-full md:w-2/5 lg:w-1/3 overflow-y-auto">
                <PlayQueue 
                    tracks={playQueue} 
                    currentTrackIndex={currentTrackIndex} 
                    onTrackSelect={onTrackSelect} 
                />
            </div>
        </div>
    );
};

export default NowPlayingView;