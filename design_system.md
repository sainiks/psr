# Design System & UI/UX Guidelines

## Aesthetic Core & Philosophy
The design language is "Dark Mode Editorial meets Tactical HUD." It must satisfy the high standards of a professional UI/UX designer (Poornima) and a graphic designer (her mother). 

This project adheres strictly to **Apple's Human Interface Guidelines (HIG)** and the evaluation standards set by the `apple-design-skill` framework. Every UI decision must pass through a strict design-craft lens so the result feels premium, intentional, and platform-native without looking like a generated template.

### The 8 Core Design Principles (Apple HIG)
All UI components must be evaluated against these principles:
1. **Purpose:** The UI exists to deliver the content (the videos and the AI message), not overshadow it.
2. **Agency:** The user must feel in control (e.g., clear video playback controls, seamless scrolling).
3. **Responsibility:** The app must be respectful of the user's data, context, and time.
4. **Familiarity:** Use recognizable interaction patterns (Bento grids, standard spatial navigation).
5. **Flexibility:** The UI must adapt flawlessly across screen sizes (mobile to desktop).
6. **Simplicity:** Remove unnecessary decorative elements; rely on spacing and typography.
7. **Craft:** Pixel-perfect execution (1px borders, smooth curves, flawless alignment).
8. **Delight:** Subtle, physics-based micro-interactions that surprise and elevate the experience.

---

## The 5 Audit Lenses

When adding new features or modifying the UI, the following lenses must be strictly applied:

### 1. Accessibility (Blocking/Critical)
*   **Contrast:** Ensure all text passes minimum contrast ratios (4.5:1 for body text). The ultra-glassmorphism uses heavy background blur (`60px`) to ensure text remains readable even when the vibrant AI mesh moves behind it.
*   **Touch Targets:** All interactive elements (buttons, carousel arrows) must have a minimum touch target area of `44x44pt` on mobile.
*   **Motion:** Animations must be smooth and purposeful, never jarring.

### 2. Platform Conventions
*   **Layout:** The architecture utilizes a highly structured, asymmetric **Bento Grid**—the current gold standard in high-end web and OS design.
*   **Safe Areas:** Padding and margins must respect device safe areas, preventing content from bleeding into notches or physical bezels.

### 3. Visual Design & Craft (Token System)
*   **Typography Engine:** 
    *   *Display/Editorial:* **Playfair Display (Serif).** Used for large headers and editorial statements to bring a high-fashion, Vogue-like elegance.
    *   *UI/System:* **Inter (Sans-Serif).** Acts as the system font (similar to SF Pro). Used for body text, subtitles, UI elements, and technical readouts for high legibility.
*   **Color Palette (Dark Mode Default):**
    *   *Background Base:* Ultra-dark grey/black (`#050505`).
    *   *Text Primary:* High-contrast white (`#ffffff` or `text-white/90`).
    *   *Text Secondary:* Muted white (`text-white/60`).
    *   *Fluid AI Accents:* Purple (`#8A2BE2`), Royal Blue (`#4169E1`), Cyan (`#00FFFF`).
*   **Materials (Liquid Glass):**
    *   Cards use `backdrop-filter: blur(60px)` combined with a complex `-webkit-mask-composite` to create a perfect 1px gradient border that mimics etched glass. This is the core "Liquid Glass" effect.
*   **Corner Radii:** Consistent use of heavy rounding (`rounded-3xl`, `rounded-2xl`) to match modern iOS/macOS surface design.

### 4. Interaction Design
*   **Magnetic Micro-interactions:** Elements should respond to user input with physics-based, spring-like animations rather than linear transitions. 
*   **Cinematic Motion:** Elements reveal via custom `.fade-up` animations. 3D spatial positioning (like the Hero Carousel) is used instead of flat 2D sliders to create depth.
*   **Feedback:** Every action (clicking the AI button, sliding the carousel) must provide immediate visual feedback.

### 5. Content & Writing
*   **Tone:** "Crisp & Punchy." Copy should be direct, supportive, and avoid unnecessary jargon. 
*   **Capitalization:** Use standard sentence case for UI text, avoiding ALL CAPS unless specifically styling a tactical HUD element or a subtitle (`text-[10px] tracking-widest uppercase`).