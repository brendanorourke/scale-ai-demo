
import React, { useState, useEffect, useRef } from 'react';
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
  
  // Track if analysis has completed
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Create a local analysis state to prevent flicker
  const [currentAnalysisState, setCurrentAnalysisState] = useState<typeof analysisResult>(null);
  
  // Use a ref to track the specific image being analyzed and analysis status
  const analysisMeta = useRef<{
    imageUrl: string | null;
    analysisRequested: boolean;
    analysisInProgress: boolean;
  }>({
    imageUrl: null,
    analysisRequested: false,
    analysisInProgress: false
  });

  // Effect for initialization and image change detection
  useEffect(() => {
    console.log('[UI] Component mounted or dependencies changed');
    console.log('[UI] Current state:', { 
      hasImageData: !!imageData, 
      hasApiKey: isApiKeySet, 
      isAnalyzing, 
      hasResult: !!analysisResult,
      analysisComplete,
      analysisRequested: analysisMeta.current.analysisRequested,
      imageUrlInRef: analysisMeta.current.imageUrl,
      newImageUrl: imageData?.previewUrl
    });
    
    // Reset analysis state when image changes
    if (imageData && analysisMeta.current.imageUrl !== imageData.previewUrl) {
      console.log('[UI] New image detected, resetting analysis state');
      setAnalysisComplete(false);
      setCurrentAnalysisState(null);
      analysisMeta.current.imageUrl = imageData.previewUrl;
      analysisMeta.current.analysisRequested = false;
      analysisMeta.current.analysisInProgress = false;
    }
  }, [imageData, isApiKeySet, isAnalyzing, analysisResult, analysisComplete]);

  // Separate effect that only handles analysis initiation
  useEffect(() => {
    const performAnalysis = async () => {
      // Only analyze if we have image data, API key is set, we're not already analyzing,
      // analysis has not been completed, and it has not been requested yet
      if (!imageData || !isApiKeySet || 
          analysisMeta.current.analysisInProgress || 
          analysisComplete || 
          analysisMeta.current.analysisRequested) {
        console.log('[UI] Skipping analysis due to conditions not met or already completed', {
          hasImageData: !!imageData,
          hasApiKey: isApiKeySet,
          analysisInProgress: analysisMeta.current.analysisInProgress,
          analysisComplete,
          analysisRequested: analysisMeta.current.analysisRequested
        });
        return;
      }

      try {
        console.log('[UI] Conditions met for starting new analysis');
        console.log('[UI] Starting analysis process - marking as initiated');
        
        // Mark analysis as requested and in progress
        analysisMeta.current.analysisRequested = true;
        analysisMeta.current.analysisInProgress = true;
        
        // Reset UI state before starting
        setIsAnalyzing(true);
        
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
        
        console.log('[UI] Setting initial empty state:', initialState);
        setCurrentAnalysisState(initialState);
        
        await analyzeImage({
          imageUrl: imageData.previewUrl,
          apiKey,
          onProgress: (progressResult) => {
            console.log('[UI] Received progress update:', progressResult);
            
            // Update the current analysis state with each progress update
            setCurrentAnalysisState(progressResult);
            
            // Only when loading is complete do we finalize the result
            if (!progressResult.isLoading) {
              console.log('[UI] Analysis complete, finalizing result');
              setAnalysisComplete(true);
              setIsAnalyzing(false);
              analysisMeta.current.analysisInProgress = false;
              setAnalysisResult(progressResult);
            }
          }
        });
      } catch (error) {
        console.error('[UI] Analysis failed:', error);
        
        // Handle error state
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        analysisMeta.current.analysisInProgress = false;
        
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
        
        console.log('[UI] Setting error result:', errorResult);
        setCurrentAnalysisState(errorResult);
        setAnalysisResult(errorResult);
      }
    };

    performAnalysis();
  }, [imageData, apiKey, isApiKeySet]); // Removed isAnalyzing, analysisResult, analysisComplete
  
  // Use existing result if available 
  useEffect(() => {
    if (analysisResult && !currentAnalysisState && analysisComplete) {
      console.log('[UI] Using existing analysis result:', analysisResult);
      setCurrentAnalysisState(analysisResult);
    }
  }, [analysisResult, currentAnalysisState, analysisComplete]);

  if (!imageData) {
    return null;
  }

  // Display the appropriate component based on loading state
  const showLoading = isAnalyzing || (currentAnalysisState?.isLoading === true);
  const disableNext = showLoading || !analysisComplete;

  console.log('[UI] Render state - showLoading:', showLoading, 'disableNext:', disableNext);
  console.log('[UI] Current analysis state:', currentAnalysisState);

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
