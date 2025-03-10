
import React from 'react';
import { ImageData } from '@/context/WizardContext/types';

interface ImagePreviewProps {
  imageData: ImageData;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageData }) => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        <img
          src={imageData.previewUrl}
          alt="Damaged car"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium">Uploaded Image</h3>
        <p className="text-sm text-gray-500">{imageData.name}</p>
      </div>
    </div>
  );
};

export default ImagePreview;
