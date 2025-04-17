
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { captureImage } from '../utils/imageProcessing';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, RefreshCcw } from 'lucide-react';

interface CameraProps {
  onImageCapture: (imageSrc: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onImageCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleCapture = async () => {
    const capturedImage = await captureImage(webcamRef);
    if (capturedImage) {
      setImageSrc(capturedImage);
      setIsCaptured(true);
      onImageCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setIsCaptured(false);
    setImageSrc(null);
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative rounded-lg overflow-hidden shadow-lg w-full max-w-lg aspect-video bg-black">
        {!isCaptured ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={imageSrc || ''} 
            alt="Captured food" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="mt-4 flex gap-4">
        {!isCaptured ? (
          <Button 
            onClick={handleCapture} 
            className="btn-primary"
          >
            <CameraIcon className="mr-2 h-4 w-4" /> Capture Food
          </Button>
        ) : (
          <Button 
            onClick={handleRetake} 
            variant="outline"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Retake Photo
          </Button>
        )}
      </div>
    </div>
  );
};

export default Camera;
