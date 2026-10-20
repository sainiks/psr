# System Architecture: Tanu's WISH

## Overview
Tanu's WISH is an interactive motion graphics web application structured around a high-performance React architecture. It integrates hardware-accelerated HTML5 Canvas motion graphics, mathematical waveform synthesizers, Web Audio API acoustics, and 3D spatial video mechanics with an ultra-glassmorphism Bento layout.

## Component Hierarchy

1. **`App` (Universal Root)**
   - Manages routing lifecycle (`isUnlocked`).
   - Injects global custom design system CSS and motion graphics keyframes.
   - Hosts background visual foundations:
     - Fluid AI Mesh gradient (`.mesh-gradient`)
     - Film grain noise overlay (`.noise-overlay`)
     - Real-time `TacticalMotionGraphicsCanvas`

2. **`TacticalMotionGraphicsCanvas` (Motion Graphics Engine)**
   - High-performance HTML5 Canvas rendering at 60fps.
   - Real-time 360° radar sweep with conic phosphor trail and range rings.
   - Radar blip pings with distance checks and expanding acoustic rings.
   - Particle constellation with distance vector lines and cursor repulsion physics.
   - Hypersonic jet vector streaks with particle dissipation.

3. **`AIIntroSequence` (Secure Uplink Initializer)**
   - 3-stage cinematic uplink sequence with pulsating AI orb core.
   - One-click bypass and Web Audio celestial chime trigger.

4. **`BentoDashboard` (Main Command Interface)**
   - Hosts header, hero, kinetic marquee, Bento grid, and interactive modals.
   - Controls Gemini API re-synthesis with offline high-craft fallback.

5. **`HeroCarousel` (3D Spatial Video Slider & HUD)**
   - 3D perspective slider with continuous wrapping offset logic.
   - Live motion graphics HUD overlays: timecode clock (`00:0X:SS:MS`), recording beacon, corner brackets, and vector badges.
   - Dual playback modes: 2-second auto-rotation preview and full-length locked mode.

6. **`KineticMotionTicker` (Dual-Velocity Typography Marquee)**
   - Forward-velocity primary narrative ribbon.
   - Reverse-velocity telemetry coordinate ticker.

7. **`FlightTelemetryHudCard` (Motion Graphics Cockpit HUD)**
   - Interactive Cockpit Artificial Horizon (mouse-driven pitch ladder & roll).
   - Harmonic Acoustics Sine Wave + 12-band equalizer spectrum bars.
   - Supersonic Mach Vector radial arc meter (Mach 2.45).

8. **`TanuWishModal` (Celestial Wish Matrix)**
   - Full-screen celebratory modal with supersonic shockwave rings.
   - Web Audio API harmonic chime chord synthesizer (`[523.25, 659.25, 783.99, 1046.50, 1318.51] Hz`).
   - 6 interactive wish constellation directives for Tanu.

9. **`MotionGlassCard` (3D Perspective Tilt & Spotlight)**
   - Reusable card wrapper providing mouse-following 3D tilt (`rotateX`, `rotateY`) and radial cursor spotlight glow.
   - Animated perimeter border beam (`border-beam-card`).

10. **`TrifoldCard` (Executive Commendation Docket)**
    - 3-panel physical trifold document layout.
    - Print-ready stylesheet integration (`window.print()`).
    - Hologram seal of permanent sanctuary.