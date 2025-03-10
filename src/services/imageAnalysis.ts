
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
      onProgress(emptyResult);
    }

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
      await handleApiError(response);
    }

    const data = await response.json();
    
    try {
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        
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
        
        if (onProgress) {
          onProgress(finalResult);
        }
        
        return finalResult;
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    // If we reach here, we couldn't parse the response properly
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
      onProgress(fallbackResult);
    }
    
    return fallbackResult;
    
  } catch (error) {
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
      onProgress(errorResult);
    }
    
    throw error;
  }
};
