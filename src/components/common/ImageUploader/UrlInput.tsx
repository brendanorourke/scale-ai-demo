
import React, { useState } from 'react';
import { UrlInputProps } from './types';

const UrlInput: React.FC<UrlInputProps> = ({ onImageFromUrl }) => {
  const [urlInput, setUrlInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onImageFromUrl(urlInput.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="flex items-center w-full">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-insurance-general"
        />
        <button
          type="submit"
          className="p-3 bg-insurance-general text-white rounded-r-md hover:bg-insurance-general/90 transition-colors"
        >
          Load
        </button>
      </div>
    </form>
  );
};

export default UrlInput;
