
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { Car, ArrowRight } from 'lucide-react';

const Step1Welcome: React.FC = () => {
  const { goToNextStep } = useWizard();

  return (
    <div className="wizard-step glass-card p-10 md:p-14 text-center max-w-3xl mx-auto">
      <div className="relative w-20 h-20 mb-8 mx-auto">
        <div className="absolute inset-0 bg-insurance-general/10 rounded-full animate-pulse-light"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Car size={42} className="text-insurance-general" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-insurance-general">
        Auto Damage Assessment
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Our AI-powered system analyzes your car damage photos to provide instant make/model identification, 
        detailed damage assessment, and estimated repair costs.
      </p>
      
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-insurance-general/10 flex items-center justify-center mr-4">
            <span className="text-insurance-general font-semibold">1</span>
          </div>
          <p className="text-left text-gray-700 flex-1 max-w-sm">
            Upload a photo of your damaged vehicle
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-insurance-general/10 flex items-center justify-center mr-4">
            <span className="text-insurance-general font-semibold">2</span>
          </div>
          <p className="text-left text-gray-700 flex-1 max-w-sm">
            Our AI analyzes the damage and vehicle details
          </p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-insurance-general/10 flex items-center justify-center mr-4">
            <span className="text-insurance-general font-semibold">3</span>
          </div>
          <p className="text-left text-gray-700 flex-1 max-w-sm">
            Get instant damage assessment and cost estimates
          </p>
        </div>
      </div>
      
      <button
        onClick={goToNextStep}
        className="insurance-btn-primary px-8 py-3 text-lg flex items-center mx-auto"
      >
        Get Started
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default Step1Welcome;
