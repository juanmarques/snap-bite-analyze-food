
import { ImageData } from './types';

// Helper function to convert base64 image to MIME format for Gemini API
export const prepareImageForGemini = (dataURL: string): ImageData => {
  // Extract the MIME type and base64 data
  const regex = /^data:([^;]+);base64,(.+)$/;
  const matches = dataURL.match(regex);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL format');
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  
  return {
    mimeType,
    data: base64Data
  };
};
