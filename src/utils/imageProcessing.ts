
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
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
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
