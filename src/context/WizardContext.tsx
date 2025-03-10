
import React, { createContext, useState, useContext } from 'react';

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

interface WizardContextType {
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

const defaultAnalysisResult: AnalysisResult = {
  carMetadata: {
    make: 'TBD',
    model: 'TBD',
    color: 'TBD',
  },
  damageDescription: 'TBD',
  repairEstimate: 'TBD',
  isLoading: false,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setImageData(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        imageData,
        setImageData,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
