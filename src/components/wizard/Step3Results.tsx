
import React, { useState, useEffect } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useApiKey } from '@/context/ApiKeyContext';
import WizardNav from '@/components/common/WizardNav';
import { analyzeImage } from '@/services/imageAnalysis';
import { toast } from 'sonner';
import { Car, Wrench, DollarSign, Loader } from 'lucide-react';
import SubmissionModal from './SubmissionModal';

const Step3Results: React.FC = () => {
  const { imageData, analysisResult, setAnalysisResult, isAnalyzing, setIsAnalyzing } = useWizard();
  const { apiKey, isApiKeySet } = useApiKey();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset analysis state when component mounts or image changes
  useEffect(() => {
    // Only reset if we have an image and no analysis is in progress
    if (imageData && !isAnalyzing) {
      // Instead of immediately setting to null, we'll initialize with loading state
      setAnalysisResult({
        carMetadata: {
          make: 'To be determined',
          model: 'To be determined',
          color: 'To be determined',
        },
        damageDescription: 'To be determined',
        repairEstimate: 'To be determined',
        isLoading: true
      });
    }
  }, [imageData, setAnalysisResult, isAnalyzing]);

  useEffect(() => {
    const performAnalysis = async () => {
      // Only proceed if we have an image, API key is set, and not already analyzing
      if (!imageData || !isApiKeySet || isAnalyzing) return;

      try {
        setIsAnalyzing(true);
        const imageUrl = imageData.previewUrl;
        
        // Using onProgress to show loading state but not override completed fields
        const result = await analyzeImage({
          imageUrl,
          apiKey,
          onProgress: (progressResult) => {
            // Only update if we're in a loading state
            if (progressResult.isLoading) {
              setAnalysisResult(current => ({
                ...current,
                ...progressResult,
                // Preserve any non-default values from the current state
                carMetadata: {
                  make: current?.carMetadata.make !== 'To be determined' ? current.carMetadata.make : progressResult.carMetadata?.make || 'To be determined',
                  model: current?.carMetadata.model !== 'To be determined' ? current.carMetadata.model : progressResult.carMetadata?.model || 'To be determined',
                  color: current?.carMetadata.color !== 'To be determined' ? current.carMetadata.color : progressResult.carMetadata?.color || 'To be determined',
                },
                damageDescription: current?.damageDescription !== 'To be determined' ? current.damageDescription : progressResult.damageDescription || 'To be determined',
                repairEstimate: current?.repairEstimate !== 'To be determined' ? current.repairEstimate : progressResult.repairEstimate || 'To be determined',
              }));
            }
          }
        });
        
        // Final result always takes precedence
        setAnalysisResult(result);
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
            make: 'To be determined',
            model: 'To be determined',
            color: 'To be determined',
          },
          damageDescription: 'To be determined',
          repairEstimate: 'To be determined',
          isLoading: false,
          error: userFriendlyMessage
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, [imageData, apiKey, isApiKeySet, isAnalyzing, setAnalysisResult, setIsAnalyzing]);

  if (!imageData) {
    return null;
  }

  const isLoading = isAnalyzing || (analysisResult?.isLoading ?? true);

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
        <div className="glass-card overflow-hidden">
          <div className="aspect-video bg-gray-100 relative">
            <img
              src={imageData.previewUrl}
              alt="Damaged car"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium">Uploaded Image</h3>
            <p className="text-sm text-gray-500">{imageData.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="glass-card p-6 flex-1">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Loader className="animate-spin text-insurance-general mb-4" size={36} />
                <h3 className="text-lg font-medium mb-2">Analyzing Image</h3>
                <p className="text-gray-500">
                  Our AI is examining the damage and preparing your assessment...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <Car className="mr-2 text-insurance-general" size={20} />
                    <h3 className="font-medium">Vehicle Information</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Make</p>
                        <p className="font-medium">{analysisResult?.carMetadata.make}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Model</p>
                        <p className="font-medium">{analysisResult?.carMetadata.model}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Color</p>
                        <p className="font-medium">{analysisResult?.carMetadata.color}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Wrench className="mr-2 text-insurance-general" size={20} />
                    <h3 className="font-medium">Damage Assessment</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">
                      {analysisResult?.damageDescription}
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <DollarSign className="mr-2 text-insurance-general" size={20} />
                    <h3 className="font-medium">Estimated Repair Cost</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{analysisResult?.repairEstimate}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      *This is an AI-generated estimate and may differ from actual repair costs
                    </p>
                  </div>
                </div>
              </div>
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
