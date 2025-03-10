
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
  
  // Track if analysis has completed regardless of result
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Create a local analysis state to prevent flicker
  const [currentAnalysisState, setCurrentAnalysisState] = useState<typeof analysisResult>(null);
  
  // Use a ref to track if we've already initiated analysis for this image
  const analysisInitiatedRef = useRef(false);

  useEffect(() => {
    console.log('[UI] Component mounted or dependencies changed');
    console.log('[UI] Current state:', { 
      hasImageData: !!imageData, 
      hasApiKey: isApiKeySet, 
      isAnalyzing, 
      hasResult: !!analysisResult,
      analysisComplete,
      analysisInitiated: analysisInitiatedRef.current
    });
    
    const performAnalysis = async () => {
      if (!imageData || !isApiKeySet || isAnalyzing || analysisInitiatedRef.current) {
        console.log('[UI] Skipping analysis due to conditions not met or already initiated');
        return;
      }

      try {
        console.log('[UI] Starting analysis process - marking as initiated');
        // Set the ref to prevent duplicate API calls
        analysisInitiatedRef.current = true;
        
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
        
        console.log('[UI] Setting initial empty state:', initialState);
        setCurrentAnalysisState(initialState);
        
        await analyzeImage({
          imageUrl: imageData.previewUrl,
          apiKey,
          onProgress: (progressResult) => {
            console.log('[UI] Received progress update:', progressResult);
            
            // Update the current analysis state with each progress update
            setCurrentAnalysisState(prevState => {
              console.log('[UI] Updating from previous state:', prevState);
              console.log('[UI] Updating to new state:', progressResult);
              return progressResult;
            });
            
            // Only when loading is complete do we finalize the result
            if (!progressResult.isLoading) {
              console.log('[UI] Analysis complete, finalizing result');
              setAnalysisComplete(true);
              setIsAnalyzing(false);
              setAnalysisResult(progressResult);
            }
          }
        });
      } catch (error) {
        console.error('[UI] Analysis failed:', error);
        
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
        
        console.log('[UI] Setting error result:', errorResult);
        setCurrentAnalysisState(errorResult);
        setAnalysisResult(errorResult);
      }
    };

    // We only want to start analysis when we have new image data and haven't analyzed it yet
    if (imageData && !analysisComplete && !analysisInitiatedRef.current) {
      console.log('[UI] Conditions met for starting new analysis');
      performAnalysis();
    }
    
    // If we already have analysis results but no current state, use them (happens on component remount)
    if (analysisResult && !currentAnalysisState) {
      console.log('[UI] Using existing analysis result:', analysisResult);
      setCurrentAnalysisState(analysisResult);
      setAnalysisComplete(true);
    }
    
    // Reset the initiated flag if the image changes
    return () => {
      if (!imageData) {
        console.log('[UI] Resetting analysis initiated flag due to no image data');
        analysisInitiatedRef.current = false;
      }
    };
  }, [
    imageData, 
    apiKey, 
    isApiKeySet, 
    setAnalysisResult, 
    setIsAnalyzing
  ]);
  
  // Effect to update currentAnalysisState when analysisResult changes
  useEffect(() => {
    if (analysisResult) {
      console.log('[UI] Updating current analysis state from result:', analysisResult);
      setCurrentAnalysisState(analysisResult);
    }
  }, [analysisResult]);

  // Reset the initiated flag when imageData changes
  useEffect(() => {
    console.log('[UI] Image data changed, resetting analysis initiated flag');
    analysisInitiatedRef.current = false;
    
    // If there's no image data, also reset other states
    if (!imageData) {
      setAnalysisComplete(false);
      setCurrentAnalysisState(null);
    }
  }, [imageData]);

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
