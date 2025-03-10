
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { useApiKey } from '@/context/ApiKeyContext';
import WizardNav from '@/components/common/WizardNav';
import ImageUploader from '@/components/common/ImageUploader';
import { toast } from 'sonner';

const Step2Upload: React.FC = () => {
  const { 
    imageData, 
    setImageData, 
    goToNextStep,
    setAnalysisResult,
    setIsAnalyzing
  } = useWizard();
  const { isApiKeySet } = useApiKey();

  const handleImageSelect = (data: typeof imageData) => {
    setImageData(data);
    // Clear previous results when selecting a new image
    setAnalysisResult(null);
  };

  const handleRemoveImage = () => {
    setImageData(null);
    setAnalysisResult(null);
  };

  const handleContinue = () => {
    if (!imageData) {
      toast.error('Please upload an image of the damaged car first');
      return;
    }

    if (!isApiKeySet) {
      toast.error(
        'Please set your API key in the settings menu before proceeding',
        {
          description: 'Click the settings icon in the top right corner to set up your API key.',
          duration: 5000
        }
      );
      return;
    }
    
    goToNextStep();
  };

  return (
    <div className="wizard-step w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-insurance-general mb-2">
          Upload Car Damage Photo
        </h2>
        <p className="text-gray-600">
          Upload a clear photo of the damage to your vehicle for AI analysis
        </p>
      </div>
      
      <div className="glass-card p-6 mb-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          selectedImage={imageData}
          onRemoveImage={handleRemoveImage}
        />
      </div>
      
      <WizardNav
        onNext={handleContinue}
        disableNext={!imageData}
        nextLabel="Continue"
      />
    </div>
  );
};

export default Step2Upload;
