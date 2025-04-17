
import React from 'react';
import { FoodLog as FoodLogType } from '../types/food';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';

interface FoodLogProps {
  logs: FoodLogType[];
}

const FoodLog: React.FC<FoodLogProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Food History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ArrowUpCircle className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-muted-foreground">Take a photo of your food to start tracking</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          Food History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium capitalize">{log.mealType}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(log.timestamp, 'MMM d, h:mm a')}
                  </div>
                </div>
                
                <div className="flex mb-2">
                  <div className="font-semibold mr-1">Total:</div>
                  <div>{log.totalCalories} kcal</div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {log.items.map(item => item.name).join(', ')}
                </div>
                
                {log.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={log.imageUrl} 
                      alt="Food" 
                      className="w-full h-20 object-cover rounded-md" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FoodLog;
