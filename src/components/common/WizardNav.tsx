
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizard } from '@/context/WizardContext';

interface WizardNavProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  disableNext?: boolean;
  hideBack?: boolean;
  hideNext?: boolean;
  nextButtonClass?: string;
}

const WizardNav: React.FC<WizardNavProps> = ({
  onBack,
  onNext,
  nextLabel = 'Continue',
  backLabel = 'Back',
  disableNext = false,
  hideBack = false,
  hideNext = false,
  nextButtonClass = 'insurance-btn-primary'
}) => {
  const { goToPreviousStep, goToNextStep } = useWizard();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goToPreviousStep();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      goToNextStep();
    }
  };

  return (
    <div className="flex items-center justify-between w-full mt-8 gap-4">
      {!hideBack && (
        <button
          onClick={handleBack}
          className="insurance-btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>
      )}
      
      <div className={hideBack ? 'ml-auto' : ''}></div>
      
      {!hideNext && (
        <button
          onClick={handleNext}
          disabled={disableNext}
          className={`${nextButtonClass} flex items-center gap-2 ${
            disableNext ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {nextLabel}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

export default WizardNav;
