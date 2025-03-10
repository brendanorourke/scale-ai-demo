
import React, { useState } from 'react';
import { useApiKey } from '@/context/ApiKeyContext';
import { Settings } from 'lucide-react';
import ApiKeyModal from '@/components/settings/ApiKeyModal';

const Header: React.FC = () => {
  const { isApiKeySet } = useApiKey();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md bg-insurance-general flex items-center justify-center text-white font-bold mr-3">
            AC
          </div>
          <h1 className="text-xl font-semibold text-insurance-general tracking-tight">
            AutoClaim <span className="text-sm font-normal text-gray-500">Assistant</span>
          </h1>
        </div>
        
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 rounded-full flex items-center ${
            isApiKeySet ? 'text-insurance-general hover:bg-gray-100' : 'text-insurance-error animate-pulse'
          }`}
          aria-label="Settings"
        >
          <Settings size={20} />
          {!isApiKeySet && (
            <span className="ml-2 text-sm font-medium">API Key Required</span>
          )}
        </button>
        
        <ApiKeyModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </header>
  );
};

export default Header;
