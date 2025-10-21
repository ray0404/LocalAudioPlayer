import React from 'react';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, VolumeUpIcon, VolumeOffIcon } from './Icons';

interface PlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  trackName?: string;
  artistName?: string;
}

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds)) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Player: React.FC<PlayerProps> = ({
  isPlaying, onPlayPause, onNext, onPrev, currentTime, duration, onSeek, volume, onVolumeChange, trackName, artistName
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center">
        <div className="w-1/4">
            <h3 className="font-bold text-sm truncate">{trackName || 'No track selected'}</h3>
            <p className="text-xs text-gray-400 truncate">{artistName || 'Unknown Artist'}</p>
        </div>
        
        <div className="w-1/2 flex flex-col items-center">
            <div className="flex items-center justify-center space-x-6 mb-2">
                <button onClick={onPrev} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                  <PrevIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={onPlayPause} 
                  className="p-4 bg-teal-600 rounded-full shadow-lg hover:bg-teal-500 transition-transform transform hover:scale-105"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                </button>
                <button onClick={onNext} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                  <NextIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex items-center space-x-4 w-full">
                <span className="text-xs w-12 text-center text-gray-400">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-teal-500"
                />
                <span className="text-xs w-12 text-center text-gray-400">{formatTime(duration)}</span>
            </div>
        </div>

        <div className="w-1/4 flex justify-end">
             <div className="flex items-center space-x-2 w-32">
                {volume > 0 ? <VolumeUpIcon className="w-5 h-5 text-gray-400"/> : <VolumeOffIcon className="w-5 h-5 text-gray-400"/>}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-teal-500"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Player;