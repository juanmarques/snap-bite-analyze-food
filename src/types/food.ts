
export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
  imageUrl?: string;
}

export interface FoodLog {
  id: string;
  items: FoodItem[];
  totalCalories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
  imageUrl?: string;
}
