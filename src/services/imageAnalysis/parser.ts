
import { AnalysisResult } from '@/context/WizardContext';
import { ParsedAnalysisData } from './types';

export const getDefaultResult = (): AnalysisResult => ({
  carMetadata: {
    make: 'TBD',
    model: 'TBD',
    color: 'TBD',
  },
  damageDescription: 'TBD',
  repairEstimate: 'TBD',
  isLoading: false
});

export const parseAnalysisResponse = (content: string): ParsedAnalysisData | null => {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return null;
  }
};

export const createAnalysisResult = (
  parsedData: ParsedAnalysisData | null, 
  isLoading: boolean = false
): AnalysisResult => {
  const defaultResult = getDefaultResult();
  
  if (!parsedData) {
    return { ...defaultResult, isLoading };
  }
  
  return {
    carMetadata: {
      make: parsedData.carMetadata?.make || defaultResult.carMetadata.make,
      model: parsedData.carMetadata?.model || defaultResult.carMetadata.model,
      color: parsedData.carMetadata?.color || defaultResult.carMetadata.color,
    },
    damageDescription: parsedData.damageDescription || defaultResult.damageDescription,
    repairEstimate: parsedData.repairEstimate || defaultResult.repairEstimate,
    isLoading
  };
};
