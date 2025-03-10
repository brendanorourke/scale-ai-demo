
import { AnalysisResult } from '@/context/WizardContext';

export interface AnalyzeImageParams {
  imageUrl: string;
  apiKey: string;
  onProgress?: (result: AnalysisResult) => void;
}

export interface ApiResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface ParsedAnalysisData {
  carMetadata?: {
    make?: string;
    model?: string;
    color?: string;
  };
  damageDescription?: string;
  repairEstimate?: string;
}
