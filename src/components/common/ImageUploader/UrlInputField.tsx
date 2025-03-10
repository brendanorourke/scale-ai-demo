
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ImageData } from '@/context/WizardContext';

interface UrlInputFieldProps {
  onImageSelect: (data: ImageData) => void;
  setIsUrlMode: (isUrlMode: boolean) => void;
}

const UrlInputField: React.FC<UrlInputFieldProps> = ({ onImageSelect, setIsUrlMode }) => {
  const [urlInput, setUrlInput] = useState('');

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

  return (
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
  );
};

export default UrlInputField;
