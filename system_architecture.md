# System Architecture

## Overview
Project Zenith is currently structured as a monolithic, single-file React application (`poornima_astra.tsx` / `App.jsx`) for ease of deployment and portability. It utilizes a hybrid styling approach, combining standard Tailwind utility classes for layout (Bento grid, flexbox) with a massive custom CSS block for advanced features (animations, ultra-glassmorphism, masking).

## Component Hierarchy

1. **`App` (Main Container)**
   - Manages global routing state (`isUnlocked`).
   - Injects global custom CSS.
   - Renders the background layers (Fluid AI Mesh, Noise Overlay).

2. **`AIIntroSequence` (Intro Screen)**
   - Handles the initial 3-phase loading animation (Orb -> Text -> Button).
   - Uses `setTimeout` for phase transitions.

3. **`BentoDashboard` (Main Layout)**
   - Houses the Bento grid architecture.
   - Contains the state for the AI Integration (`aiResponse`, `isThinking`).
   - Handles the API fetch logic to the Gemini endpoint with fallback synthesis.

4. **`HeroCarousel` (3D Video Slider)**
   - A highly complex sub-component rendered inside `BentoDashboard`.
   - **State:** Tracks `currentIndex`, `isPlaying`, `isMuted`, `progress`.
   - **Refs:** Uses a `useRef` array (`videoRefs`) to directly manipulate DOM `<video>` elements (play, pause, currentTime, muted).
   - **Math:** Utilizes custom wrapping logic to calculate 3D offsets (`translateX`, `scale`, `blur`, `zIndex`) based on the delta between a video's index and the active `currentIndex`.

## Data Management
- **Media Payload:** Stored statically in the `archiveData` array containing 13 local MP4 video vectors (`/1.mp4` through `/13.mp4`) with tactical editorial titles and subtitles.

## API Integration
- Uses standard browser `fetch` to POST to `generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`.
- Prompt is hardcoded to enforce the specific narrative constraints (AFCAT, UI/UX, safe space).