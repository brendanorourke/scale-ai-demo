
import React, { useState, useEffect } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useApiKey } from '@/context/ApiKeyContext';
import WizardNav from '@/components/common/WizardNav';
import { analyzeImage } from '@/services/imageAnalysis';
import { handleError } from '@/utils/errorHandling';
import SubmissionModal from './SubmissionModal';
import ImagePreview from './analysis/ImagePreview';
import AnalysisCard from './analysis/AnalysisCard';
import LoadingState from './analysis/LoadingState';

const Step3Results: React.FC = () => {
  const { imageData, analysisResult, setAnalysisResult, isAnalyzing, setIsAnalyzing } = useWizard();
  const { apiKey, isApiKeySet } = useApiKey();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempResult, setTempResult] = useState<typeof analysisResult>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    const performAnalysis = async () => {
      if (!imageData || !isApiKeySet || isAnalyzing) return;

      try {
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        
        await analyzeImage({
          imageUrl: imageData.previewUrl,
          apiKey,
          onProgress: (progressResult) => {
            if (!progressResult.isLoading) {
              // Final result received
              setTempResult(progressResult);
              setAnalysisComplete(true);
              setIsAnalyzing(false);
              
              // Only update the displayed result when analysis is complete
              setAnalysisResult(progressResult);
            } else {
              // Store intermediate results without affecting the UI
              setTempResult(progressResult);
            }
          }
        });
      } catch (error) {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setAnalysisResult({
          carMetadata: {
            make: 'Error',
            model: 'Error',
            color: 'Error',
          },
          damageDescription: 'Error occurred during analysis',
          repairEstimate: 'Unable to estimate',
          isLoading: false
        });
      }
    };

    if (imageData && !analysisResult) {
      performAnalysis();
    }
  }, [imageData, apiKey, isApiKeySet, isAnalyzing, setAnalysisResult, setIsAnalyzing, analysisResult]);

  if (!imageData) {
    return null;
  }

  // Only show results when analysis is complete AND we have results
  const isLoading = isAnalyzing || !analysisComplete;
  const showResults = !isLoading && analysisResult;

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
            {isLoading ? (
              <LoadingState />
            ) : (
              showResults && <AnalysisCard analysisResult={analysisResult} />
            )}
          </div>
        </div>
      </div>
      
      <WizardNav
        nextLabel="File Claim"
        nextButtonClass={isLoading ? "insurance-btn-primary opacity-50 cursor-not-allowed" : "insurance-btn-primary"}
        disableNext={isLoading}
        onNext={() => setIsModalOpen(true)}
      />
      
      <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Step3Results;
