
export type ImageData = {
  file?: File;
  url?: string;
  previewUrl: string;
  name: string;
  size: number;
};

export type AnalysisResult = {
  carMetadata: {
    make: string;
    model: string;
    color: string;
  };
  damageDescription: string;
  repairEstimate: string;
  isLoading: boolean;
  error?: string;
};

export interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  imageData: ImageData | null;
  setImageData: (data: ImageData | null) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  resetWizard: () => void;
}
