
import React from 'react';
import Layout from '@/components/layout/Layout';
import Step1Welcome from '@/components/wizard/Step1Welcome';
import Step2Upload from '@/components/wizard/Step2Upload';
import Step3Results from '@/components/wizard/Step3Results';
import { WizardProvider, useWizard } from '@/context/WizardContext';
import { ApiKeyProvider } from '@/context/ApiKeyContext';

const WizardSteps: React.FC = () => {
  const { currentStep } = useWizard();
  
  return (
    <div className="wizard-container">
      {currentStep === 1 && <Step1Welcome />}
      {currentStep === 2 && <Step2Upload />}
      {currentStep === 3 && <Step3Results />}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ApiKeyProvider>
      <WizardProvider>
        <Layout>
          <WizardSteps />
        </Layout>
      </WizardProvider>
    </ApiKeyProvider>
  );
};

export default Index;
