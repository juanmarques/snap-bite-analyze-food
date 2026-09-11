
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
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const cameraSessionRef = useRef(0);
  const cameraSession = cameraSessionRef.current;
  const isMobile = useIsMobile();

  const handleCapture = async () => {
    if (!isCameraReady || cameraError) return;

    const capturedImage = await captureImage(webcamRef);
    if (capturedImage) {
      cameraSessionRef.current += 1;
      setIsCameraReady(false);
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
        cameraSessionRef.current += 1;
        setIsCameraReady(false);
        setImageSrc(processedImage);
        setIsCaptured(true);
        onImageCapture(processedImage);
      }
    }
  };

  const handleRetake = () => {
    cameraSessionRef.current += 1;
    setIsCameraReady(false);
    setCameraError(false);
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
            onUserMedia={() => {
              // Ignore callbacks from a camera replaced by upload or retake.
              if (cameraSession !== cameraSessionRef.current) return;
              setCameraError(false);
              setIsCameraReady(true);
            }}
            onUserMediaError={() => {
              if (cameraSession !== cameraSessionRef.current) return;
              setIsCameraReady(false);
              setCameraError(true);
            }}
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

      {!isCaptured && cameraError && (
        <p role="alert" className="mt-4 w-full max-w-lg text-sm text-destructive">
          Camera unavailable. Camera permission may be denied, or your camera may
          be missing or in use. You can still use Upload Image to choose a photo.
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {!isCaptured ? (
          <>
            <Button 
              onClick={handleCapture} 
              disabled={!isCameraReady || cameraError}
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
              aria-label="Upload Image"
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
