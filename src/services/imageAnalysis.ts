
import { AnalysisResult } from '@/context/WizardContext';
import { handleError, handleApiError } from '@/utils/errorHandling';

interface AnalyzeImageParams {
  imageUrl: string;
  apiKey: string;
  onProgress?: (result: AnalysisResult) => void;
}

// Returns true if a value is a placeholder like "TBD" or contains "determined"
const isPlaceholderValue = (value: string): boolean => {
  if (!value) return true;
  const lowerValue = value.toLowerCase();
  return lowerValue === 'tbd' || 
         lowerValue.includes('determined') || 
         lowerValue === 'unknown';
};

export const analyzeImage = async ({ 
  imageUrl, 
  apiKey,
  onProgress
}: AnalyzeImageParams): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error('API key not provided');
  }

  try {
    console.log('[API] Starting image analysis with URL:', imageUrl.substring(0, 20) + '...');
    
    // Initialize with empty values instead of placeholders
    const emptyResult: AnalysisResult = {
      carMetadata: {
        make: '',
        model: '',
        color: '',
      },
      damageDescription: '',
      repairEstimate: '',
      isLoading: true
    };

    // Notify about starting analysis
    if (onProgress) {
      console.log('[API] Setting initial empty state:', emptyResult);
      onProgress(emptyResult);
    }

    console.log('[API] Making request to OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert automotive damage assessor with decades of experience in the insurance industry.
            Analyze the car image and provide the following information:
            1. Car metadata (make, model, and color)
            2. A detailed description of the visible damage
            3. An estimated repair cost range in USD
            
            If you cannot determine any information with confidence, respond with "TBD" for that specific field.
            Format your response as JSON with the following structure:
            {
              "carMetadata": {
                "make": "string",
                "model": "string",
                "color": "string"
              },
              "damageDescription": "string",
              "repairEstimate": "string"
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this car image for make, model, color, damage description, and estimated repair cost.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      console.log('[API] Response not OK:', response.status, response.statusText);
      await handleApiError(response);
    }

    console.log('[API] Received response from API, status:', response.status);
    const data = await response.json();
    console.log('[API] Parsed JSON response, message type:', data.choices[0].message.role);
    
    try {
      const content = data.choices[0].message.content;
      console.log('[API] Raw content from API (first 100 chars):', content.substring(0, 100) + '...');
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonContent = jsonMatch[0];
        console.log('[API] Extracted JSON (first 100 chars):', jsonContent.substring(0, 100) + '...');
        
        const parsedData = JSON.parse(jsonContent);
        console.log('[API] Successfully parsed JSON data, keys:', Object.keys(parsedData));
        console.log('[API] Car metadata:', parsedData.carMetadata);
        
        // Prepare the result with known values or TBD for unknown
        const finalResult: AnalysisResult = {
          carMetadata: {
            make: isPlaceholderValue(parsedData.carMetadata?.make) ? 'TBD' : parsedData.carMetadata.make,
            model: isPlaceholderValue(parsedData.carMetadata?.model) ? 'TBD' : parsedData.carMetadata.model,
            color: isPlaceholderValue(parsedData.carMetadata?.color) ? 'TBD' : parsedData.carMetadata.color,
          },
          damageDescription: isPlaceholderValue(parsedData.damageDescription) ? 'TBD' : parsedData.damageDescription,
          repairEstimate: isPlaceholderValue(parsedData.repairEstimate) ? 'TBD' : parsedData.repairEstimate,
          isLoading: false
        };
        
        console.log('[API] Final processed result:', finalResult);
        
        if (onProgress) {
          console.log('[API] Calling onProgress with final result');
          onProgress(finalResult);
        }
        
        return finalResult;
      } else {
        console.log('[API] No JSON match found in content');
      }
    } catch (parseError) {
      console.error('[API] Failed to parse AI response:', parseError);
    }

    // If we reach here, we couldn't parse the response properly
    console.log('[API] Could not parse response, using fallback values');
    const fallbackResult: AnalysisResult = {
      carMetadata: {
        make: 'TBD',
        model: 'TBD',
        color: 'TBD',
      },
      damageDescription: 'TBD',
      repairEstimate: 'TBD',
      isLoading: false
    };
    
    if (onProgress) {
      console.log('[API] Calling onProgress with fallback result');
      onProgress(fallbackResult);
    }
    
    return fallbackResult;
    
  } catch (error) {
    console.error('[API] Error during analysis:', error);
    handleError(error, 'Failed to analyze image');
    
    // Return TBD values on error
    const errorResult: AnalysisResult = {
      carMetadata: {
        make: 'TBD',
        model: 'TBD',
        color: 'TBD',
      },
      damageDescription: 'TBD',
      repairEstimate: 'TBD',
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    if (onProgress) {
      console.log('[API] Calling onProgress with error result');
      onProgress(errorResult);
    }
    
    throw error;
  }
};
