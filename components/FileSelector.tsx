import React, { useRef } from 'react';
import { FolderIcon } from './Icons';

interface FileSelectorProps {
  onFilesSelected: (files: File[]) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-12 hover:border-teal-500 hover:bg-gray-800/50 cursor-pointer transition-all duration-300"
        onClick={handleClick}
      >
        <FolderIcon className="w-24 h-24 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-300">Select Your Music Folder</h2>
        <p className="text-gray-500 mt-2">Click to scan a folder. We'll read the metadata to build your library.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          // @ts-ignore
          webkitdirectory="true"
          directory="true"
          multiple
        />
      </div>
    </div>
  );
};

export default FileSelector;