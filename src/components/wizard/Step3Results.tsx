import React, { useState, useEffect } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useApiKey } from '@/context/ApiKeyContext';
import WizardNav from '@/components/common/WizardNav';
import { analyzeImage } from '@/services/imageAnalysis';
import { toast } from 'sonner';
import SubmissionModal from './SubmissionModal';
import ImagePreview from './analysis/ImagePreview';
import AnalysisCard from './analysis/AnalysisCard';
import LoadingState from './analysis/LoadingState';

const Step3Results: React.FC = () => {
  const { imageData, analysisResult, setAnalysisResult, isAnalyzing, setIsAnalyzing } = useWizard();
  const { apiKey, isApiKeySet } = useApiKey();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const performAnalysis = async () => {
      if (!imageData || !isApiKeySet || isAnalyzing) return;

      try {
        setIsAnalyzing(true);
        await analyzeImage({
          imageUrl: imageData.previewUrl,
          apiKey,
          onProgress: (progressResult) => {
            if (!progressResult.isLoading) {
              setIsAnalyzing(false);
            }
            setAnalysisResult(progressResult);
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        let userFriendlyMessage = 'Failed to analyze image';
        
        if (errorMessage.includes('invalid_api_key')) {
          userFriendlyMessage = 'The API key appears to be invalid. Please check your settings.';
        } else if (errorMessage.includes('insufficient_quota')) {
          userFriendlyMessage = 'Your API quota has been exceeded. Please check your OpenAI account.';
        } else if (errorMessage.includes('rate_limit')) {
          userFriendlyMessage = 'Too many requests. Please try again in a few moments.';
        }
        
        toast.error(userFriendlyMessage, {
          description: 'If this issue persists, please contact support.',
          duration: 5000
        });

        setAnalysisResult({
          carMetadata: {
            make: 'Error occurred',
            model: 'Error occurred',
            color: 'Error occurred',
          },
          damageDescription: 'Error occurred during analysis',
          repairEstimate: 'Unable to estimate',
          isLoading: false
        });
        setIsAnalyzing(false);
      }
    };

    if (imageData && !analysisResult) {
      performAnalysis();
    }
  }, [imageData, apiKey, isApiKeySet, isAnalyzing, setAnalysisResult, setIsAnalyzing, analysisResult]);

  if (!imageData) {
    return null;
  }

  const isLoading = isAnalyzing || (analysisResult?.isLoading ?? false);

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
              analysisResult && <AnalysisCard analysisResult={analysisResult} />
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
