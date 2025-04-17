
import { FoodItem } from '../../types/food';

export interface FoodAnalysisResult {
  success: boolean;
  foodItems: FoodItem[];
  error?: string;
}

export interface ImageData {
  mimeType: string;
  data: string;
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}
