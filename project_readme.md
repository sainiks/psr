# Project Zenith (Poornima Astra Tribute)

A premium, interactive web experience built as a birthday tribute. The application blends high-fashion editorial aesthetics with military aviation (AFCAT) themes, utilizing a highly polished UI/UX design standard.

## Features
- **Cinematic 3D Video Carousel:** An infinite-looping, spatial carousel displaying custom MP4 files with depth-of-field blurring and dynamic progress tracking.
- **Ultra-Glassmorphism Bento Grid:** Advanced CSS masking and backdrop-filters to create a high-end, futuristic architectural layout.
- **Astra Core AI Integration:** Live API connection to Gemini for generating dynamic, personalized profile assessments.
- **Fluid AI Background:** A CSS-driven mesh gradient that morphs continuously, creating a bioluminescent effect.
- **Secure Terminal Intro:** A cinematic loading sequence establishing the "Secure Uplink" narrative.

## Getting Started

### Prerequisites
- Node.js (v16+)
- A Gemini API Key (from Google AI Studio)

### Installation
1. Clone the repository or initialize a new React project (e.g., using Vite: `npm create vite@latest . -- --template react`).
2. Install dependencies:
   ```bash
   npm install lucide-react
   ```
3. Add your Gemini API key (Optional):
   - Open `poornima_astra.tsx` (or `src/App.jsx`).
   - Locate the `fetchAIAssessment` function.
   - Set your key or pass via `VITE_GEMINI_API_KEY` (if omitted, high-craft local synthesis will execute).
4. Media Archive:
   - Configured with the 13 `.mp4` video files in `public/` (`/1.mp4` through `/13.mp4`), loaded into `archiveData`.

### Running the App
```bash
npm run dev
```

## Tech Stack
- React.js (Hooks, Refs, State)
- CSS-in-JS (Custom Stylesheet injection)
- Tailwind CSS (Utility classes for grid/layout)
- Lucide React (Icons)