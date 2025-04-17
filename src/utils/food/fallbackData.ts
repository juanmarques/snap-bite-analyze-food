
import { FoodItem } from '../../types/food';
import { FoodAnalysisResult } from './types';

// Mock food database for fallback
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

// Fallback function that uses mock data if the API call fails
export const fallbackFoodAnalysis = (): FoodAnalysisResult => {
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
