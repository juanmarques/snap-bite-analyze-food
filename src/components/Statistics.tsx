
import React from 'react';
import { FoodLog } from '../types/food';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Activity } from 'lucide-react';

interface StatisticsProps {
  logs: FoodLog[];
}

const Statistics: React.FC<StatisticsProps> = ({ logs }) => {
  // Calculate daily calories
  const today = new Date();
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate.getDate() === today.getDate() && 
           logDate.getMonth() === today.getMonth() && 
           logDate.getFullYear() === today.getFullYear();
  });
  
  const dailyCalories = todayLogs.reduce((sum, log) => sum + log.totalCalories, 0);
  
  // Calculate meal type distribution
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  const mealDistribution = mealTypes.map(type => {
    const calories = logs
      .filter(log => log.mealType === type)
      .reduce((sum, log) => sum + log.totalCalories, 0);
    
    return {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      calories
    };
  });

  // If there are no logs, display a message
  if (logs.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Activity className="mr-2 h-5 w-5 text-purple-500" />
            Nutrition Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PieChart className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-muted-foreground">Take photos of your meals to see statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Activity className="mr-2 h-5 w-5 text-purple-500" />
          Nutrition Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm font-medium text-muted-foreground">Today's Calories</div>
          <div className="text-2xl font-bold">{dailyCalories} kcal</div>
        </div>
        
        <div className="h-[200px] mt-6">
          <div className="text-sm font-medium mb-2">Calories by Meal Type</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mealDistribution}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="calories" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;
