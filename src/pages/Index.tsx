
import React, { useState } from 'react';
import { dataURLtoBlob } from '../utils/imageProcessing';
import { analyzeFood } from '../utils/foodAnalysisApi';
import { FoodItem, FoodLog as FoodLogType } from '../types/food';
import Camera from '../components/Camera';
import FoodAnalysis from '../components/FoodAnalysis';
import FoodLog from '../components/FoodLog';
import Statistics from '../components/Statistics';
import { Button } from '@/components/ui/button';
import { PlusCircle, Camera as CameraIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<FoodItem[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLogType[]>([]);
  const [activeTab, setActiveTab] = useState('camera');
  
  // Handle image capture from camera
  const handleImageCapture = (capturedImage: string) => {
    setImageSrc(capturedImage);
    analyzeFoodImage(capturedImage);
  };
  
  // Analyze food image using mock API
  const analyzeFoodImage = async (imageSource: string) => {
    setIsAnalyzing(true);
    try {
      const imageBlob = dataURLtoBlob(imageSource);
      const result = await analyzeFood(imageBlob);
      
      if (result.success && result.foodItems.length > 0) {
        setDetectedFoods(result.foodItems);
      } else {
        console.error("Food analysis failed:", result.error);
      }
    } catch (error) {
      console.error("Error analyzing food:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Save current food analysis to log
  const saveToLog = () => {
    if (detectedFoods.length > 0 && imageSrc) {
      const totalCalories = detectedFoods.reduce((sum, item) => sum + item.calories, 0);
      
      // Determine meal type based on time of day
      const hour = new Date().getHours();
      let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack';
      
      if (hour >= 5 && hour < 10) mealType = 'breakfast';
      else if (hour >= 10 && hour < 15) mealType = 'lunch';
      else if (hour >= 15 && hour < 22) mealType = 'dinner';
      
      const newLog: FoodLogType = {
        id: Date.now().toString(),
        items: detectedFoods,
        totalCalories,
        mealType,
        timestamp: new Date(),
        imageUrl: imageSrc
      };
      
      setFoodLogs(prev => [newLog, ...prev]);
      setDetectedFoods([]);
      setImageSrc(null);
      setActiveTab('history');
    }
  };
  
  // Reset current analysis
  const resetAnalysis = () => {
    setDetectedFoods([]);
    setImageSrc(null);
    setActiveTab('camera');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold food-lens-gradient bg-clip-text text-transparent">FoodLens</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="camera" className="flex items-center justify-center py-3">
              <CameraIcon className="mr-2 h-4 w-4" />
              Capture Food
            </TabsTrigger>
            <TabsTrigger value="history">
              <PlusCircle className="mr-2 h-4 w-4" />
              Food History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="space-y-4">
            <Camera onImageCapture={handleImageCapture} />
            
            <FoodAnalysis 
              isLoading={isAnalyzing}
              foodItems={detectedFoods}
            />
            
            {detectedFoods.length > 0 && (
              <div className="flex justify-center gap-4 mt-4">
                <Button onClick={saveToLog} className="btn-primary">
                  Save to Log
                </Button>
                <Button variant="outline" onClick={resetAnalysis}>
                  Reset
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <FoodLog logs={foodLogs} />
            <Statistics logs={foodLogs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
