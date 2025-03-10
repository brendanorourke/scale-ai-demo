
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Eye, EyeOff, Key, Info } from 'lucide-react';
import { useApiKeyModal } from './useApiKeyModal';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const {
    inputApiKey,
    setInputApiKey,
    showApiKey,
    isEditing,
    setIsEditing,
    providers,
    activeProvider,
    apiKey,
    handleInputFocus,
    handleSave,
    handleClear,
    toggleApiKeyVisibility,
    setActiveProvider
  } = useApiKeyModal(isOpen, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2 text-insurance-general" />
            API Settings
          </DialogTitle>
          <DialogDescription>
            Configure your API provider for the damage assessment service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Provider</label>
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    provider.isActive 
                      ? 'bg-insurance-general text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveProvider(provider)}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          </div>
          
          {activeProvider?.id === 'anthropic' ? (
            <div className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center text-insurance-general mb-2">
                <Info size={18} className="mr-2" />
                <h3 className="font-medium">Anthropic Integration</h3>
              </div>
              <p className="text-sm text-gray-600">
                The Anthropic API integration is coming soon! We're working on adding support for Claude and other Anthropic models.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Please check back later or use OpenAI in the meantime.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                {activeProvider?.name || 'API'} Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  value={inputApiKey}
                  onChange={(e) => {
                    setInputApiKey(e.target.value);
                    setIsEditing(true);
                  }}
                  onFocus={handleInputFocus}
                  type={showApiKey ? 'text' : 'password'}
                  placeholder={apiKey ? "••••••••••••••••••••••" : "Enter your API key here"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={toggleApiKeyVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                {activeProvider?.id === 'openai' 
                  ? 'Enter your OpenAI API key. This will be stored in your browser.' 
                  : 'Enter your API key for the selected provider.'}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          {activeProvider?.id !== 'anthropic' && (
            <Button variant="outline" onClick={handleClear} className="text-insurance-error">
              Clear Key
            </Button>
          )}
          <div className="space-x-2 ml-auto">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            {activeProvider?.id !== 'anthropic' && (
              <Button 
                onClick={handleSave} 
                className="bg-insurance-action hover:bg-insurance-action/90 text-white"
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
