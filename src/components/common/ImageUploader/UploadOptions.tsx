
import React from 'react';
import { Upload, Link2 } from 'lucide-react';

interface UploadOptionsProps {
  isUrlMode: boolean;
  toggleUploadMode: () => void;
  triggerFileInput: () => void;
}

const UploadOptions: React.FC<UploadOptionsProps> = ({ 
  isUrlMode, 
  toggleUploadMode, 
  triggerFileInput 
}) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="space-x-2">
        <button
          type="button"
          onClick={() => !isUrlMode && triggerFileInput()}
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
  );
};

export default UploadOptions;
