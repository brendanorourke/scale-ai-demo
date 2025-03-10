
import React, { useCallback } from 'react';
import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ImageData } from '@/context/WizardContext';

interface FileDropZoneProps {
  onImageSelect: (data: ImageData) => void;
  isUrlMode: boolean;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  onClick: () => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onImageSelect,
  isUrlMode,
  isDragging,
  setIsDragging,
  onClick,
}) => {
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
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUrlMode) return;
    setIsDragging(true);
  }, [isUrlMode, setIsDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, [setIsDragging]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUrlMode) return;
    if (!isDragging) setIsDragging(true);
  }, [isUrlMode, isDragging, setIsDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUrlMode) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [isUrlMode]);

  return (
    <div 
      onClick={onClick}
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
  );
};

export default FileDropZone;
