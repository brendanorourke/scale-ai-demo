
import React from 'react';
import { Car, Wrench, DollarSign } from 'lucide-react';
import { AnalysisResult } from '@/context/WizardContext';

interface AnalysisCardProps {
  analysisResult: AnalysisResult;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysisResult }) => {
  return (
    <div className="flex flex-col">
      <div>
        <div className="flex items-center mb-2">
          <Car className="mr-2 text-insurance-general" size={20} />
          <h3 className="font-medium">Vehicle Information</h3>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Make</p>
              <p className="font-medium">{analysisResult.carMetadata.make}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Model</p>
              <p className="font-medium">{analysisResult.carMetadata.model}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Color</p>
              <p className="font-medium">{analysisResult.carMetadata.color}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center mb-2">
          <Wrench className="mr-2 text-insurance-general" size={20} />
          <h3 className="font-medium">Damage Assessment</h3>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm">
            {analysisResult.damageDescription}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center mb-2">
          <DollarSign className="mr-2 text-insurance-general" size={20} />
          <h3 className="font-medium">Estimated Repair Cost</h3>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-medium">{analysisResult.repairEstimate}</p>
          <p className="text-xs text-gray-500 mt-1">
            *This is an AI-generated estimate and may differ from actual repair costs
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
