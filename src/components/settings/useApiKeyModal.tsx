
import { useState, useEffect } from 'react';
import { useApiKey } from '@/context/ApiKeyContext';

export const useApiKeyModal = (isOpen: boolean, onClose: () => void) => {
  const { apiKey, setApiKey, clearApiKey, providers, activeProvider, setActiveProvider } = useApiKey();
  const [inputApiKey, setInputApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // When the modal opens or apiKey changes, set the placeholder masks
  useEffect(() => {
    if (apiKey && !isEditing) {
      setInputApiKey('••••••••••••••••••••••');
    }
  }, [apiKey, isOpen]);

  const handleInputFocus = () => {
    if (apiKey && !isEditing) {
      setInputApiKey('');
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (inputApiKey && inputApiKey !== '••••••••••••••••••••••') {
      setApiKey(inputApiKey);
    }
    setIsEditing(false);
    onClose();
  };

  const handleClear = () => {
    setInputApiKey('');
    setIsEditing(true);
    clearApiKey();
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return {
    inputApiKey,
    setInputApiKey,
    showApiKey,
    isEditing,
    providers,
    activeProvider,
    handleInputFocus,
    handleSave,
    handleClear,
    toggleApiKeyVisibility,
    setActiveProvider
  };
};
