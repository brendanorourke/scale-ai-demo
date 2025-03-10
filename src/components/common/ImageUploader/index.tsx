
import React, { useState, useRef, useEffect } from 'react';
import { ImageData } from '@/context/WizardContext';
import UploadOptions from './UploadOptions';
import FileDropZone from './FileDropZone';
import UrlInputField from './UrlInputField';
import ImagePreviewCard from './ImagePreviewCard';

interface ImageUploaderProps {
  onImageSelect: (data: ImageData) => void;
  selectedImage: ImageData | null;
  onRemoveImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  selectedImage,
  onRemoveImage,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = reader.result as string;
      onImageSelect({
        file,
        previewUrl,
        name: file.name,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };
  
  const toggleUploadMode = () => {
    setIsUrlMode(!isUrlMode);
    setUrlInput('');
  };

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

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div className="w-full">
          <UploadOptions 
            isUrlMode={isUrlMode} 
            toggleUploadMode={toggleUploadMode} 
            triggerFileInput={() => fileInputRef.current?.click()} 
          />
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {isUrlMode ? (
            <UrlInputField 
              onImageSelect={onImageSelect} 
              setIsUrlMode={setIsUrlMode} 
            />
          ) : (
            <FileDropZone 
              onImageSelect={onImageSelect}
              isUrlMode={isUrlMode}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onClick={() => fileInputRef.current?.click()}
            />
          )}
        </div>
      ) : (
        <ImagePreviewCard 
          image={selectedImage} 
          onRemove={onRemoveImage} 
        />
      )}
    </div>
  );
};

export default ImageUploader;
