
import { FoodItem } from '../../types/food';
import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_CONFIG } from '../../config/apiConfig';
import { ImageData, GeminiResponse } from './types';

// Create the request payload for Gemini API
export const createGeminiPayload = (imageData: ImageData) => {
  return {
    contents: [
      {
        parts: [
          {
            text: "Analyze this food image and provide detailed nutritional information. Return the response as a JSON array with this format: [{name: 'food name', calories: number, protein: number, carbs: number, fat: number}]. Identify all visible food items in the image. Use grams for protein, carbs, and fat values."
          },
          {
            inline_data: {
              mime_type: imageData.mimeType,
              data: imageData.data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: GEMINI_CONFIG.temperature,
      top_p: GEMINI_CONFIG.top_p,
      top_k: GEMINI_CONFIG.top_k,
      max_output_tokens: GEMINI_CONFIG.max_output_tokens,
    }
  };
};

// Call the Gemini API with image data
export const callGeminiAPI = async (imageData: ImageData): Promise<GeminiResponse> => {
  console.log('Calling Gemini API with URL:', GEMINI_API_URL);
  
  const payload = createGeminiPayload(imageData);
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error('API error response:', response.status, response.statusText);
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = await response.json();
  console.log('Gemini API response:', result);
  return result;
};

// Parse the response from Gemini AI
export const parseGeminiResponse = (result: GeminiResponse): FoodItem[] => {
  // Extract the text from the response
  const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!responseText) {
    throw new Error('No text content in response');
  }
  
  // Find JSON in the text - look for array content between [ and ]
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  
  if (!jsonMatch) {
    throw new Error('No JSON array found in response');
  }
  
  // Parse the JSON array
  const parsedItems = JSON.parse(jsonMatch[0]);
  
  // Validate and transform the data
  const foodItems: FoodItem[] = parsedItems.map((item: any) => ({
    name: item.name || 'Unknown Food',
    calories: typeof item.calories === 'number' ? item.calories : parseInt(item.calories) || 0,
    protein: typeof item.protein === 'number' ? item.protein : parseFloat(item.protein) || 0,
    carbs: typeof item.carbs === 'number' ? item.carbs : parseFloat(item.carbs) || 0,
    fat: typeof item.fat === 'number' ? item.fat : parseFloat(item.fat) || 0,
    timestamp: new Date()
  }));
  
  return foodItems;
};
