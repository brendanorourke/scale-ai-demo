import { AnalysisResult } from '@/context/WizardContext';

interface AnalyzeImageParams {
  imageUrl: string;
  apiKey: string;
  onProgress?: (result: AnalysisResult) => void;
}

export const analyzeImage = async ({ 
  imageUrl, 
  apiKey,
  onProgress
}: AnalyzeImageParams): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error('API key not provided');
  }

  try {
    const defaultResult: AnalysisResult = {
      carMetadata: {
        make: 'To be determined',
        model: 'To be determined',
        color: 'To be determined',
      },
      damageDescription: 'To be determined',
      repairEstimate: 'To be determined',
      isLoading: false
    };

    // Notify about starting analysis
    if (onProgress) {
      onProgress({
        ...defaultResult,
        isLoading: true
      });
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
            
            If you cannot determine any information with confidence, respond with "To be determined" for that specific field.
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
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    
    try {
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        
        const result: AnalysisResult = {
          carMetadata: {
            make: parsedData.carMetadata?.make || defaultResult.carMetadata.make,
            model: parsedData.carMetadata?.model || defaultResult.carMetadata.model,
            color: parsedData.carMetadata?.color || defaultResult.carMetadata.color,
          },
          damageDescription: parsedData.damageDescription || defaultResult.damageDescription,
          repairEstimate: parsedData.repairEstimate || defaultResult.repairEstimate,
          isLoading: false
        };
        
        if (onProgress) {
          onProgress(result);
        }
        
        return result;
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    // Send final state with default values if parsing fails
    const fallbackResult = { ...defaultResult, isLoading: false };
    if (onProgress) {
      onProgress(fallbackResult);
    }
    return fallbackResult;
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};
