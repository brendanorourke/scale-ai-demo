
export interface ApiProvider {
  id: string;
  name: string;
  isActive: boolean;
}

export interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeySet: boolean;
  providers: ApiProvider[];
  activeProvider: ApiProvider | null;
  setActiveProvider: (provider: ApiProvider) => void;
  clearApiKey: () => void;
}
