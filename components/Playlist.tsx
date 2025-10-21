import React from 'react';
import { Track } from '../types';
import { MusicNoteIcon } from './Icons';

interface PlayQueueProps {
  tracks: Track[];
  currentTrackIndex: number | null;
  onTrackSelect: (index: number) => void;
}

const PlayQueue: React.FC<PlayQueueProps> = ({ tracks, currentTrackIndex, onTrackSelect }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Now Playing</h2>
      <ul className="space-y-2">
        {tracks.map((track, index) => (
          <li
            key={track.name + index}
            onClick={() => onTrackSelect(index)}
            className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 ${
              index === currentTrackIndex
                ? 'bg-teal-600/80 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700/70'
            }`}
          >
            <MusicNoteIcon className={`w-5 h-5 mr-3 shrink-0 ${index === currentTrackIndex ? 'text-white' : 'text-teal-400'}`} />
            <div className="flex-1 truncate">
                <span className="text-sm font-medium">{track.name}</span>
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayQueue;
