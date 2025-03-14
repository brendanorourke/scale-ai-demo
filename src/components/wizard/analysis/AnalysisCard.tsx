
import React, { useEffect } from 'react';
import { Car, Wrench, DollarSign } from 'lucide-react';
import { AnalysisResult } from '@/context/WizardContext/types';

interface AnalysisCardProps {
  analysisResult: AnalysisResult;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysisResult }) => {
  // Function to display TBD if value is empty, undefined or contains placeholders
  const displayValue = (value: string | undefined) => {
    if (!value || value.trim() === '' || value.toLowerCase() === 'tbd' || value.toLowerCase().includes('undetermined')) {
      return 'TBD';
    }
    return value;
  };
  
  // Safely access nested properties
  const safeCarMeta = analysisResult?.carMetadata || { make: '', model: '', color: '' };
  
  useEffect(() => {
    console.log('[UI:AnalysisCard] Rendering with data:', {
      make: safeCarMeta.make,
      model: safeCarMeta.model,
      color: safeCarMeta.color,
      damageDescription: analysisResult?.damageDescription,
      repairEstimate: analysisResult?.repairEstimate,
      isLoading: analysisResult?.isLoading
    });
  }, [analysisResult, safeCarMeta]);
  
  return (
    <div className="flex flex-col">
      <div>
        <div className="flex items-center mb-2">
          <Car className="mr-2 text-insurance-general" size={20} />
          <h3 className="font-medium text-insurance-general">Vehicle Information</h3>
        </div>
        <div className="bg-white shadow-sm p-4 rounded-md border border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600 font-medium">Make</p>
              <p className="font-semibold text-gray-800">{displayValue(safeCarMeta.make)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Model</p>
              <p className="font-semibold text-gray-800">{displayValue(safeCarMeta.model)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Color</p>
              <p className="font-semibold text-gray-800">{displayValue(safeCarMeta.color)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center mb-2">
          <Wrench className="mr-2 text-insurance-general" size={20} />
          <h3 className="font-medium text-insurance-general">Damage Assessment</h3>
        </div>
        <div className="bg-white shadow-sm p-4 rounded-md border border-gray-200">
          <p className="text-sm text-gray-800">
            {displayValue(analysisResult?.damageDescription)}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center mb-2">
          <DollarSign className="mr-2 text-insurance-general" size={20} />
          <h3 className="font-medium text-insurance-general">Estimated Repair Cost</h3>
        </div>
        <div className="bg-white shadow-sm p-4 rounded-md border border-gray-200">
          <p className="font-semibold text-gray-800">{displayValue(analysisResult?.repairEstimate)}</p>
          <p className="text-xs text-gray-500 mt-2">
            *This is an AI-generated estimate and may differ from actual repair costs
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
