
import React from 'react';
import { X } from 'lucide-react';
import { ImagePreviewProps } from './types';
import { formatFileSize } from './utils';

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove }) => {
  return (
    <div className="w-full border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{image.name}</h3>
          <p className="text-sm text-gray-500">{formatFileSize(image.size)}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>
      <div className="relative rounded-md overflow-hidden aspect-video bg-gray-100">
        <img
          src={image.previewUrl}
          alt="Selected image"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
