
// Function to handle capturing an image from webcam
export const captureImage = async (webcamRef: React.RefObject<any>): Promise<string | null> => {
  if (!webcamRef.current) {
    return null;
  }
  
  try {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  } catch (err) {
    console.error("Error capturing image: ", err);
    return null;
  }
};

// Function to process an uploaded image file
export const processUploadedImage = (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    // Check file size (limit to 10MB to avoid API issues)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("File size is too large (max 10MB)"));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        // For larger images, we might want to resize before sending to API
        // but for now we'll just use the direct result
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read image file"));
      }
    };
    
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
      reject(new Error("Error reading file"));
    };
    
    reader.readAsDataURL(file);
  });
};

// Function to convert base64 to file blob
export const dataURLtoBlob = (dataURL: string): Blob => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
};

// Function to compress an image before sending to API if needed
export const compressImage = (base64Image: string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Only resize if image is larger than maxWidth
      if (img.width <= maxWidth) {
        resolve(base64Image);
        return;
      }
      
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Image); // Fallback to original if can't get context
        return;
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get the data URL of the resized image
      const resizedImage = canvas.toDataURL('image/jpeg', 0.85);
      resolve(resizedImage);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = base64Image;
  });
};
