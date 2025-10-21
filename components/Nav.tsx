import React from 'react';

interface NavProps {
    view: 'now-playing' | 'library';
    setView: (view: 'now-playing' | 'library') => void;
}

const Nav: React.FC<NavProps> = ({ view, setView }) => {

    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200";
    const activeClasses = "bg-teal-600 text-white";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700";

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm p-3 text-center sticky top-0 z-20">
            <div className="inline-flex items-center bg-gray-700/50 rounded-lg p-1 space-x-1">
                <button 
                    onClick={() => setView('now-playing')}
                    className={`${baseClasses} ${view === 'now-playing' ? activeClasses : inactiveClasses}`}
                >
                    Now Playing
                </button>
                <button 
                    onClick={() => setView('library')}
                    className={`${baseClasses} ${view === 'library' ? activeClasses : inactiveClasses}`}
                >
                    Library
                </button>
            </div>
        </header>
    );
};

export default Nav;
