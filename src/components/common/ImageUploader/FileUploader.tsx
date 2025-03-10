
import React, { useRef, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { FileUploaderProps } from './types';

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect, 
  isDragging,
  setIsDragging
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, [setIsDragging]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging, setIsDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect, setIsDragging]);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
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
    </>
  );
};

export default FileUploader;
