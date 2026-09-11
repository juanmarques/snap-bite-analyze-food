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

### Local Development

From the repository root, with Node.js and npm installed, use the factory-proven dependency preparation below. `--legacy-peer-deps` is required for compatibility with the existing lockfile's legacy peer resolution; keep the lockfile unchanged.

```bash
# Install dependencies
npm ci --ignore-scripts --no-audit --no-fund --legacy-peer-deps

# Start dev server
npm run dev
# Open the local URL printed by Vite

# Build for production
npm run build

# Check application TypeScript without emitting files
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json

# Preview the production build locally (run the build first)
npm run preview
```

### Manual Camera Fallback Check

With the local app open, verify the following without capturing or uploading a photo or invoking food analysis:

1. Deny camera access when prompted, or block camera permission for the local site and reload.
2. Confirm a useful "Camera unavailable" error explains that permission may be denied or the camera may be missing or in use, and points to **Upload Image**.
3. Confirm the capture button (**Take Photo**, or **Capture Food** on mobile) is disabled.
4. Confirm **Upload Image** remains enabled and opens the image file chooser. Cancel the chooser without selecting a file.
5. Confirm history navigation remains usable, then return to the camera view.

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
