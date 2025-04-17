
import { FoodItem } from '../types/food';

// This is a mock API for food analysis
// In a real implementation, this would call an actual AI service

interface FoodAnalysisResult {
  success: boolean;
  foodItems: FoodItem[];
  error?: string;
}

// Mock database of recognizable foods
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

// In a real app, this would send the image to an AI service
export const analyzeFood = async (imageBlob: Blob): Promise<FoodAnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // For demo, randomly select 1-3 food items
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...foodDatabase].sort(() => 0.5 - Math.random());
      const selectedFoods = shuffled.slice(0, itemCount);
      
      const foodItems: FoodItem[] = selectedFoods.map(food => ({
        ...food,
        timestamp: new Date()
      }));
      
      resolve({
        success: true,
        foodItems: foodItems
      });
    }, 1500);
  });
};
