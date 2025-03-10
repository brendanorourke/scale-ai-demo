
import React from 'react';
import { ImageData } from '@/context/WizardContext/types';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  imageData: ImageData;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageData,
  className 
}) => {
  return (
    <div className={cn(
      "glass-card overflow-hidden transition-all duration-300 hover:shadow-md", 
      className
    )}>
      <div className="aspect-video bg-gray-50 dark:bg-gray-900 relative">
        <img
          src={imageData.previewUrl}
          alt="Damaged car"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-medium text-insurance-general">Uploaded Image</h3>
        <p className="text-sm text-gray-500">{imageData.name}</p>
        <p className="text-xs text-gray-400">
          {formatFileSize(imageData.size)}
        </p>
      </div>
    </div>
  );
};

// Helper function to format file size, consistent with the ImageUploader component
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default ImagePreview;
