
import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploaderProps } from './types';
import { processFile } from './utils';
import FileUploader from './FileUploader';
import UrlInput from './UrlInput';
import ImagePreview from './ImagePreview';
import { ImageData } from '@/context/WizardContext';

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  selectedImage,
  onRemoveImage,
}) => {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Add capture event for the entire document to prevent default behavior
  useEffect(() => {
    // Only add these handlers if we're not in URL mode
    if (!isUrlMode) {
      const preventDefaults = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      
      // Add event listeners to the document to prevent the browser from opening the image
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
      });
      
      return () => {
        // Clean up event listeners when component unmounts or when isUrlMode changes
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          document.removeEventListener(eventName, preventDefaults, false);
        });
      };
    }
  }, [isUrlMode]);

  const handleFileSelect = useCallback((file: File) => {
    try {
      processFile(file, (previewUrl, file) => {
        onImageSelect({
          file,
          previewUrl,
          name: file.name,
          size: file.size,
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(errorMessage);
    }
  }, [onImageSelect]);

  const fetchImageFromUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to a valid image');
      }
      
      const blob = await response.blob();
      const file = new File([blob], 'image-from-url.jpg', { type: contentType });
      
      processFile(file, (previewUrl) => {
        onImageSelect({
          url,
          previewUrl,
          name: 'Image from URL',
          size: blob.size,
        });
      });
      
      setIsUrlMode(false);
    } catch (error) {
      toast.error('Failed to load image from URL');
      console.error(error);
    }
  };
  
  const toggleUploadMode = () => {
    setIsUrlMode(!isUrlMode);
  };

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div className="w-full">
          <div className="flex justify-center mb-4">
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setIsUrlMode(false)}
                className={`px-4 py-2 rounded-md ${
                  !isUrlMode ? 'bg-insurance-general text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Upload size={16} className="inline mr-2" />
                Upload Image
              </button>
              <button
                type="button"
                onClick={toggleUploadMode}
                className={`px-4 py-2 rounded-md ${
                  isUrlMode ? 'bg-insurance-general text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Link2 size={16} className="inline mr-2" />
                Image URL
              </button>
            </div>
          </div>
          
          {isUrlMode ? (
            <UrlInput onImageFromUrl={fetchImageFromUrl} />
          ) : (
            <FileUploader 
              onFileSelect={handleFileSelect} 
              isDragging={isDragging}
              setIsDragging={setIsDragging} 
            />
          )}
        </div>
      ) : (
        <ImagePreview 
          image={selectedImage} 
          onRemove={onRemoveImage} 
        />
      )}
    </div>
  );
};

export default ImageUploader;
