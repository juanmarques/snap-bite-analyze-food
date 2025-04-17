
import { FoodItem } from '../types/food';
import { prepareImageForGemini } from './food/imageUtils';
import { callGeminiAPI, parseGeminiResponse } from './food/geminiService';
import { fallbackFoodAnalysis } from './food/fallbackData';
import { FoodAnalysisResult } from './food/types';

export const analyzeFood = async (imageBlob: Blob): Promise<FoodAnalysisResult> => {
  try {
    // Convert blob to base64
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
    
    // Prepare image for Gemini
    const imageData = prepareImageForGemini(base64Image);
    
    // Call Gemini API and get response
    const result = await callGeminiAPI(imageData);
    
    // Parse the response from Gemini
    try {
      const foodItems = parseGeminiResponse(result);
      
      return {
        success: true,
        foodItems
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Original response:', JSON.stringify(result, null, 2));
      
      // Fallback to our database if parsing fails
      return fallbackFoodAnalysis();
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Use fallback in case of API failure
    return fallbackFoodAnalysis();
  }
};

// Re-export fallback for direct use if needed
export { fallbackFoodAnalysis } from './food/fallbackData';
