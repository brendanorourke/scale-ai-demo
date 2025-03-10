
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <Loader className="animate-spin text-insurance-general mb-4" size={36} />
      <h3 className="text-lg font-medium mb-2">Analyzing Image</h3>
      <p className="text-gray-500">
        Our AI is examining the damage and preparing your assessment...
      </p>
    </div>
  );
};

export default LoadingState;
