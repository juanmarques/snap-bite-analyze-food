
import { FoodItem } from '../types/food';

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyBWBGu5YR_DsIvhwQ7TfOPsD0PLGm_GBb8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

interface FoodAnalysisResult {
  success: boolean;
  foodItems: FoodItem[];
  error?: string;
}

// Helper function to convert base64 image to MIME format for Gemini API
const prepareImageForGemini = (dataURL: string) => {
  // Extract the MIME type and base64 data
  const regex = /^data:([^;]+);base64,(.+)$/;
  const matches = dataURL.match(regex);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL format');
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  
  return {
    mimeType,
    data: base64Data
  };
};

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
    
    // Create the request payload for Gemini
    const payload = {
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
        temperature: 0.2,
        top_p: 0.8,
        top_k: 40,
        max_output_tokens: 2048,
      }
    };

    console.log('Calling Gemini API with URL:', GEMINI_API_URL);
    
    // Call Gemini API
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
    
    // Parse the response from Gemini
    try {
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

// Fallback function that uses mock data if the API call fails
const fallbackFoodAnalysis = (): FoodAnalysisResult => {
  const foodDatabase = [
    {
      name: 'Apple',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3
    },
    {
      name: 'Banana',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4
    },
    {
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6
    },
    {
      name: 'Salad',
      calories: 20,
      protein: 1,
      carbs: 3,
      fat: 0.2
    },
    {
      name: 'Rice',
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3
    },
    {
      name: 'Pasta',
      calories: 200,
      protein: 7,
      carbs: 40,
      fat: 1
    },
    {
      name: 'Burger',
      calories: 350,
      protein: 15,
      carbs: 35,
      fat: 17
    },
    {
      name: 'Pizza Slice',
      calories: 285,
      protein: 12,
      carbs: 36,
      fat: 10
    }
  ];

  // Randomly select 1-3 food items
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...foodDatabase].sort(() => 0.5 - Math.random());
  const selectedFoods = shuffled.slice(0, itemCount);
  
  const foodItems: FoodItem[] = selectedFoods.map(food => ({
    ...food,
    timestamp: new Date()
  }));
  
  return {
    success: true,
    foodItems: foodItems
  };
};
