
import { AnalysisResult } from '@/context/WizardContext';
import { AnalyzeImageParams } from './types';
import { getDefaultResult, parseAnalysisResponse, createAnalysisResult } from './parser';
import { callOpenAiApi } from '../api/openaiService';

export const analyzeImage = async ({ 
  imageUrl, 
  apiKey,
  onProgress
}: AnalyzeImageParams): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error('API key not provided');
  }

  try {
    // Notify about starting analysis
    if (onProgress) {
      onProgress({
        ...getDefaultResult(),
        isLoading: true
      });
    }

    const data = await callOpenAiApi(apiKey, imageUrl);
    
    const content = data.choices[0].message.content;
    const parsedData = parseAnalysisResponse(content);
    const result = createAnalysisResult(parsedData);
    
    if (onProgress) {
      onProgress(result);
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Send final state with default values if parsing fails
    const fallbackResult = getDefaultResult();
    
    if (onProgress) {
      onProgress(fallbackResult);
    }
    
    throw error;
  }
};
