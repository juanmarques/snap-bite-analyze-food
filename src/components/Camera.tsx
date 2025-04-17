
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { captureImage, processUploadedImage } from '../utils/imageProcessing';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, RefreshCcw, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CameraProps {
  onImageCapture: (imageSrc: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onImageCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleCapture = async () => {
    const capturedImage = await captureImage(webcamRef);
    if (capturedImage) {
      setImageSrc(capturedImage);
      setIsCaptured(true);
      onImageCapture(capturedImage);
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const processedImage = await processUploadedImage(file);
      if (processedImage) {
        setImageSrc(processedImage);
        setIsCaptured(true);
        onImageCapture(processedImage);
      }
    }
  };

  const handleRetake = () => {
    setIsCaptured(false);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <>
            <Button 
              onClick={handleCapture} 
              className="btn-primary"
            >
              <CameraIcon className="mr-2 h-4 w-4" /> {isMobile ? 'Capture Food' : 'Take Photo'}
            </Button>
            <Button 
              onClick={handleUpload} 
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Image
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </>
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
