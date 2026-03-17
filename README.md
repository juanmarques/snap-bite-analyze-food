# FoodLens

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI-powered food analysis app -- snap a photo of your meal or upload an image, and get instant nutritional breakdown powered by Google Gemini Vision.

## Features

- **Camera Capture** -- Take photos directly from your webcam
- **Image Upload** -- Upload existing food photos (max 10MB)
- **AI Food Recognition** -- Google Gemini Vision identifies food items and estimates macros
- **Nutritional Breakdown** -- Calories, protein, carbs, and fat per detected item
- **Food Log** -- Save analyzed meals with auto-detected meal type (breakfast/lunch/dinner/snack)
- **Daily Statistics** -- Calorie tracking and meal distribution bar chart
- **Image Compression** -- Client-side resize (max 800px width) before API submission

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 (SWC) |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Camera | react-webcam |
| State | TanStack React Query |
| AI | Google Gemini Vision API |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Opens at http://localhost:8080

# Build for production
npm run build
```

### API Key Setup

The app uses Google Gemini Vision for food recognition. Configure your API key in `src/config/apiConfig.ts`.

Get a free key at [Google AI Studio](https://makersuite.google.com/app/apikey).

## How It Works

1. Capture or upload a food photo
2. Image is compressed and sent as base64 to Gemini Vision API
3. Gemini returns structured JSON with detected foods and estimated macros
4. Results display with per-item calorie/macro breakdown
5. Save to food log (in-memory, resets on page refresh)

## Limitations

- Food log is client-side only (no backend persistence)
- Nutritional estimates are AI-generated approximations
- Requires webcam permission for camera capture
- Gemini API rate limits apply

## License

This project is licensed under the MIT License -- see the [LICENSE](LICENSE) file for details.
