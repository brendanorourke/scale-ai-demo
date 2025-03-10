
import { toast } from 'sonner';

/**
 * Error types for better categorization and handling
 */
export enum ErrorType {
  API_KEY = 'api_key',
  NETWORK = 'network',
  ANALYSIS = 'analysis',
  UPLOAD = 'upload',
  UNKNOWN = 'unknown'
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  details?: string;
  suggestedAction?: string;
}

/**
 * Map API error messages to user-friendly messages
 */
export const mapErrorMessage = (error: Error | string): ErrorResponse => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // API Key related errors
  if (errorMessage.includes('invalid_api_key') || errorMessage.includes('API key not provided')) {
    return {
      type: ErrorType.API_KEY,
      message: 'API Key Issue',
      details: 'The API key appears to be invalid or missing.',
      suggestedAction: 'Please check your settings and ensure your API key is correct.'
    };
  }
  
  // Rate limiting and quota errors
  if (errorMessage.includes('insufficient_quota')) {
    return {
      type: ErrorType.API_KEY,
      message: 'API Quota Exceeded',
      details: 'Your API quota has been exceeded.',
      suggestedAction: 'Please check your OpenAI account or contact support.'
    };
  }
  
  if (errorMessage.includes('rate_limit')) {
    return {
      type: ErrorType.API_KEY,
      message: 'Too Many Requests',
      details: 'You\'ve sent too many requests in a short period.',
      suggestedAction: 'Please try again in a few moments.'
    };
  }
  
  // Network related errors
  if (
    errorMessage.includes('network') || 
    errorMessage.includes('Failed to fetch') || 
    errorMessage.includes('ECONNREFUSED')
  ) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network Error',
      details: 'Unable to connect to the service.',
      suggestedAction: 'Please check your internet connection and try again.'
    };
  }
  
  // Analysis errors
  if (errorMessage.includes('analyze') || errorMessage.includes('analysis')) {
    return {
      type: ErrorType.ANALYSIS,
      message: 'Analysis Failed',
      details: 'Failed to analyze the provided image.',
      suggestedAction: 'Please try again with a different image or contact support.'
    };
  }
  
  // Upload errors
  if (
    errorMessage.includes('upload') || 
    errorMessage.includes('image') || 
    errorMessage.includes('file')
  ) {
    return {
      type: ErrorType.UPLOAD,
      message: 'Upload Failed',
      details: 'There was an issue with the image upload.',
      suggestedAction: 'Please try a different image format or smaller file size.'
    };
  }
  
  // Default case for unknown errors
  return {
    type: ErrorType.UNKNOWN,
    message: 'Unexpected Error',
    details: errorMessage.substring(0, 100) + (errorMessage.length > 100 ? '...' : ''),
    suggestedAction: 'If this issue persists, please contact support.'
  };
};

/**
 * Handle errors with consistent UI feedback
 */
export const handleError = (error: Error | string, customMessage?: string): ErrorResponse => {
  console.error('Error occurred:', error);
  
  const errorResponse = mapErrorMessage(error);
  
  toast.error(customMessage || errorResponse.message, {
    description: errorResponse.details,
    duration: 5000,
  });
  
  return errorResponse;
};

/**
 * Specific error handler for API requests
 */
export const handleApiError = async (response: Response): Promise<never> => {
  const contentType = response.headers.get('content-type');
  let errorMessage = `API request failed with status ${response.status}`;
  
  try {
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } else {
      const text = await response.text();
      if (text) errorMessage = text;
    }
  } catch (parseError) {
    console.error('Failed to parse error response:', parseError);
  }
  
  throw new Error(errorMessage);
};
