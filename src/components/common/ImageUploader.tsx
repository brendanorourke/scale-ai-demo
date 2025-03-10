
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link2, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ImageData } from '@/context/WizardContext';

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
      toast.error('Only image files are allowed');
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
  
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
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
  
  const fetchImageFromUrl = async () => {
    if (!urlInput) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    try {
      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to a valid image');
      }
      
      const blob = await response.blob();
      const file = new File([blob], 'image-from-url.jpg', { type: contentType });
      
      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;
        onImageSelect({
          url: urlInput,
          previewUrl,
          name: 'Image from URL',
          size: blob.size,
        });
      };
      reader.readAsDataURL(blob);
      
      setUrlInput('');
      setIsUrlMode(false);
    } catch (error) {
      toast.error('Failed to load image from URL');
      console.error(error);
    }
  };
  
  const toggleUploadMode = () => {
    setIsUrlMode(!isUrlMode);
    setUrlInput('');
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUrlMode) return;
    setIsDragging(true);
  }, [isUrlMode]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUrlMode) return;
    if (!isDragging) setIsDragging(true);
  }, [isUrlMode, isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUrlMode) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [isUrlMode, processFile]);

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div className="w-full">
          <div className="flex justify-center mb-4">
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => !isUrlMode && fileInputRef.current?.click()}
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
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {isUrlMode ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center w-full">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-insurance-general"
                />
                <button
                  onClick={fetchImageFromUrl}
                  className="p-3 bg-insurance-general text-white rounded-r-md hover:bg-insurance-general/90 transition-colors"
                >
                  Load
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 ${isDragging ? 'border-insurance-general bg-insurance-general/10' : 'border-gray-300'} border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-insurance-general transition-colors`}
            >
              <ImageIcon className={`mx-auto h-12 w-12 ${isDragging ? 'text-insurance-general' : 'text-gray-400'}`} />
              <div className="mt-4 flex text-sm text-gray-600 justify-center">
                <label className="relative cursor-pointer rounded-md font-medium text-insurance-general focus-within:outline-none">
                  <span>Upload a file</span>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full border rounded-lg p-4 bg-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900">{selectedImage.name}</h3>
              <p className="text-sm text-gray-500">{formatFileSize(selectedImage.size)}</p>
            </div>
            <button
              onClick={onRemoveImage}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="relative rounded-md overflow-hidden aspect-video bg-gray-100">
            <img
              src={selectedImage.previewUrl}
              alt="Selected car"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default ImageUploader;
