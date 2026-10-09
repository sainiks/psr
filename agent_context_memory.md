# AI Agent Briefing & Memory File

**CRITICAL:** Read this file before modifying the codebase. This file contains the emotional, structural, and aesthetic constraints of Project Zenith. Do not hallucinate features that break these rules.

## 0. Linked Knowledge Graph (Directory)
This file is the root node. If you require deeper specifics on a certain aspect of the project, immediately reference the following connected files:
*   **`EMOTIONAL_BOND.md`**: Read this for the psychological background, the history of Poornima and Kunal's friendship, shared traumas, and the strict rules of engagement regarding romantic boundaries.
*   **`DESIGN.md`**: Read this for exact CSS variables, hex codes, typography rules (Playfair/Inter), and UI/UX paradigms (Glassmorphism, Grid systems).
*   **`ARCHITECTURE.md`**: Read this for the React component hierarchy, state management logic, API integration details, and DOM manipulation rules.
*   **`README.md`**: Read this for general setup, installation commands, and a high-level feature list.

## 1. The Target User (Poornima)

* **Profile:** UI/UX designer student. Mother is a top MNC graphic designer (standards for UI are extremely high). Aspires to be an Indian Air Force Pilot (AFCAT, loves F-22, B-2 stealth bombers). Has the aesthetic of a high-fashion model but avoids the industry.
* **Emotional Context:** Has severe trust issues due to family trauma (divorce/cheating) and betrayal by friends.
* **The Vibe:** This app is a birthday gift (Nov 7). It must serve as a "Safe Space." It must validate her strength and ambition. **DO NOT introduce romantic themes or standard dating app tropes. Keep it supportive, secure, and highly respectful.**

## 2. Codebase Structure (The "Monolith")

* The entire application is currently housed in a single file (`poornima_astra.tsx` / `App.jsx`).
* **Dependencies:** React, Tailwind CSS, Lucide React icons.
* **CSS Strategy:** A massive template literal (`customStyles`) is injected via `<style dangerouslySetInnerHTML>`. **DO NOT remove or convert this to external CSS unless explicitly instructed.** It is vital for the advanced glass masking and AI fluid mesh.

## 3. Key Components & Modification Rules

* **`archiveData` Array:** Located at the top of the file. This is where the 13 `.mp4` video files from `public/` (`1.mp4` through `13.mp4`) are loaded.
* **`HeroCarousel`:** A highly complex 3D math component acting as the Hero Section. It infinitely auto-scrolls through the 13 videos. **WARNING:** Do not touch the `displayOffset` math or the `translateX`/`scale` inline styles unless the user explicitly asks to break or change the 3D physics.
* **`BentoDashboard`:** The grid layout. If adding new features, follow the existing Tailwind grid layout (`md:grid-cols-4`, `md:col-span-X`).
* **Gemini API:** The `fetchAIAssessment` function contains a highly specific prompt. If modifying, ensure the prompt retains instructions to act as an "empathetic AI analyzing an aerospace/design profile."

## 4. UI/UX Non-Negotiables

* **Typography:** Always use `font-editorial` (Playfair) for big headings and standard Inter for UI text.
* **Readability:** Text inside glass cards MUST remain readable against the moving background. Always use `text-white/90` or `text-white/70` for main reading text.
* **Borders:** Do not use solid CSS borders on cards; rely on the existing `.ultra-glass` class.