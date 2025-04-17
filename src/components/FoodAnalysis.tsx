
import React from 'react';
import { FoodItem } from '../types/food';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Utensils, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface FoodAnalysisProps {
  isLoading: boolean;
  foodItems: FoodItem[];
}

const FoodAnalysis: React.FC<FoodAnalysisProps> = ({ isLoading, foodItems }) => {
  // Calculate totals
  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = foodItems.reduce((sum, item) => sum + item.fat, 0);

  if (isLoading) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
          <div className="h-7 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (foodItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 mt-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl font-semibold">
            <Utensils className="mr-2 h-5 w-5 text-green-500" />
            Food Analysis Results
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {format(new Date(), 'MMMM d, yyyy h:mm a')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2 mb-4">
            <div className="text-2xl font-bold">{totalCalories} kcal</div>
            <div className="text-sm text-muted-foreground">Total calories</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm font-medium">Protein</div>
              <div className="text-lg font-semibold">{totalProtein.toFixed(1)}g</div>
              <div className="h-2 mt-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(totalProtein / (totalProtein + totalCarbs + totalFat)) * 100}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Carbs</div>
              <div className="text-lg font-semibold">{totalCarbs.toFixed(1)}g</div>
              <div className="h-2 mt-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Fat</div>
              <div className="text-lg font-semibold">{totalFat.toFixed(1)}g</div>
              <div className="h-2 mt-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${(totalFat / (totalProtein + totalCarbs + totalFat)) * 100}%` }} 
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Detected Foods:</div>
            <div className="space-y-2">
              {foodItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodAnalysis;
