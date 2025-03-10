
import { ApiResponse } from '../imageAnalysis/types';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const callOpenAiApi = async (
  apiKey: string,
  imageUrl: string
): Promise<ApiResponse> => {
  const response = await fetch(API_URL, {
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

  return await response.json();
};
