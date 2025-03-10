
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

interface ApiProvider {
  id: string;
  name: string;
  isActive: boolean;
}

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeySet: boolean;
  providers: ApiProvider[];
  activeProvider: ApiProvider | null;
  setActiveProvider: (provider: ApiProvider) => void;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [providers, setProviders] = useState<ApiProvider[]>([
    { id: 'openai', name: 'OpenAI', isActive: true },
    { id: 'anthropic', name: 'Anthropic', isActive: false },
  ]);

  useEffect(() => {
    // Try to get API key from localStorage on mount
    const storedKey = localStorage.getItem('insurance_app_api_key');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    if (!key.trim()) {
      toast.error('API key cannot be empty');
      return;
    }

    setApiKeyState(key);
    localStorage.setItem('insurance_app_api_key', key);
    toast.success('API key saved successfully');
  };

  const clearApiKey = () => {
    setApiKeyState('');
    localStorage.removeItem('insurance_app_api_key');
    toast.info('API key cleared');
  };

  const activeProvider = providers.find(p => p.isActive) || null;

  const setActiveProvider = (provider: ApiProvider) => {
    setProviders(providers.map(p => ({
      ...p,
      isActive: p.id === provider.id
    })));
  };

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        isApiKeySet: !!apiKey,
        providers,
        activeProvider,
        setActiveProvider,
        clearApiKey
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
