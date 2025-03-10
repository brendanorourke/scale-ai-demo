
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useWizard } from '@/context/WizardContext';
import { CheckCircle } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const { resetWizard } = useWizard();
  
  const handleNewClaim = () => {
    resetWizard();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-center">
            <CheckCircle className="w-12 h-12 text-insurance-action mb-4" />
            <span className="text-xl">Claim Submitted Successfully</span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Thank you for submitting your claim. A representative will contact you shortly to discuss next steps and process your claim.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-md my-4">
          <p className="text-sm text-gray-700">
            <strong>What happens next?</strong><br />
            A claims adjuster will review your submission and contact you within 1-2 business days to verify information and guide you through the next steps in the claims process.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-center gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            onClick={handleNewClaim}
            className="bg-insurance-action hover:bg-insurance-action/90 text-white"
          >
            New Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionModal;
