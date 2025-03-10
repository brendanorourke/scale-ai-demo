
import React, { useState, useEffect } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useApiKey } from '@/context/ApiKeyContext';
import WizardNav from '@/components/common/WizardNav';
import { analyzeImage } from '@/services/imageAnalysis';
import SubmissionModal from './SubmissionModal';
import ImagePreview from './analysis/ImagePreview';
import AnalysisCard from './analysis/AnalysisCard';
import LoadingState from './analysis/LoadingState';

const Step3Results: React.FC = () => {
  const { imageData, analysisResult, setAnalysisResult, isAnalyzing, setIsAnalyzing } = useWizard();
  const { apiKey, isApiKeySet } = useApiKey();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Track if analysis has completed regardless of result
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Create a local analysis state to prevent flicker
  const [currentAnalysisState, setCurrentAnalysisState] = useState<typeof analysisResult>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      if (!imageData || !isApiKeySet || isAnalyzing) return;

      try {
        // Reset state before starting
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        
        // Initialize with empty analysis state
        const initialState = {
          carMetadata: {
            make: '',
            model: '',
            color: '',
          },
          damageDescription: '',
          repairEstimate: '',
          isLoading: true
        };
        
        setCurrentAnalysisState(initialState);
        
        await analyzeImage({
          imageUrl: imageData.previewUrl,
          apiKey,
          onProgress: (progressResult) => {
            // Update the current analysis state with each progress update
            setCurrentAnalysisState(progressResult);
            
            // Only when loading is complete do we finalize the result
            if (!progressResult.isLoading) {
              setAnalysisComplete(true);
              setIsAnalyzing(false);
              setAnalysisResult(progressResult);
            }
          }
        });
      } catch (error) {
        console.error('Analysis failed:', error);
        
        // Handle error state
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        
        const errorResult = {
          carMetadata: {
            make: 'TBD',
            model: 'TBD',
            color: 'TBD',
          },
          damageDescription: 'TBD',
          repairEstimate: 'TBD',
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred during analysis'
        };
        
        setCurrentAnalysisState(errorResult);
        setAnalysisResult(errorResult);
      }
    };

    // Start analysis if we have an image but no analysis yet
    if (imageData && !analysisResult && !isAnalyzing && !analysisComplete) {
      performAnalysis();
    }
    
    // If we already have an analysis result, use it for the current state
    if (analysisResult && !currentAnalysisState) {
      setCurrentAnalysisState(analysisResult);
    }
  }, [
    imageData, 
    apiKey, 
    isApiKeySet, 
    isAnalyzing, 
    setAnalysisResult, 
    setIsAnalyzing, 
    analysisResult, 
    analysisComplete,
    currentAnalysisState
  ]);

  if (!imageData) {
    return null;
  }

  // Display the appropriate component based on loading state
  const showLoading = isAnalyzing || (currentAnalysisState?.isLoading === true);
  const disableNext = showLoading || !analysisComplete;

  return (
    <div className="wizard-step w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-insurance-general mb-2">
          Damage Assessment Results
        </h2>
        <p className="text-gray-600">
          AI-powered analysis of your vehicle damage
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImagePreview imageData={imageData} />
        
        <div className="flex flex-col">
          <div className="glass-card p-6 flex-1">
            {showLoading ? (
              <LoadingState />
            ) : (
              currentAnalysisState && <AnalysisCard analysisResult={currentAnalysisState} />
            )}
          </div>
        </div>
      </div>
      
      <WizardNav
        nextLabel="File Claim"
        nextButtonClass={disableNext ? "insurance-btn-primary opacity-50 cursor-not-allowed" : "insurance-btn-primary"}
        disableNext={disableNext}
        onNext={() => setIsModalOpen(true)}
      />
      
      <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Step3Results;
