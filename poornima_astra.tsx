import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Crosshair, Sparkles, Fingerprint, Activity, Shield, ChevronRight, 
  Play, Pause, ChevronLeft, Disc, Volume2, VolumeX, Printer, Award, 
  FileText, CheckCircle2, Lock, ShieldCheck 
} from 'lucide-react';

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');

  :root {
    --bg-base: #050505;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.6);
    --glass-bg: rgba(20, 20, 22, 0.4);
    --glass-border: rgba(255, 255, 255, 0.08);
    --accent-1: #8A2BE2; /* Purple */
    --accent-2: #4169E1; /* Royal Blue */
    --accent-3: #00FFFF; /* Cyan */
  }

  body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    margin: 0;
    overflow-x: hidden;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .font-editorial { font-family: 'Playfair Display', serif; }

  /* Fluid AI Background */
  .astra-bg {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: var(--bg-base);
    z-index: 0;
    overflow: hidden;
  }

  .mesh-gradient {
    position: absolute;
    top: 50%; left: 50%;
    width: 120vw; height: 120vh;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle at 50% 50%, var(--accent-1) 0%, transparent 40%),
                radial-gradient(circle at 80% 20%, var(--accent-2) 0%, transparent 40%),
                radial-gradient(circle at 20% 80%, var(--accent-3) 0%, transparent 40%);
    filter: blur(100px);
    opacity: 0.4;
    animation: morph 20s ease-in-out infinite alternate;
    pointer-events: none;
  }

  @keyframes morph {
    0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
    50% { transform: translate(-45%, -55%) rotate(180deg) scale(1.1); }
    100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
  }

  /* Cinematic Noise Overlay */
  .noise-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 1;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  /* Ultra-Premium Glassmorphism */
  .ultra-glass {
    background: var(--glass-bg);
    backdrop-filter: blur(60px);
    -webkit-backdrop-filter: blur(60px);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .ultra-glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }

  .bento-hover:hover {
    transform: translateY(-4px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 255, 255, 0.05);
  }

  /* AI Orb for Intro */
  .ai-orb {
    width: 120px; height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-1), var(--accent-3));
    filter: blur(15px);
    animation: pulseOrb 4s ease-in-out infinite;
    position: relative;
  }

  .ai-orb-core {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60px; height: 60px;
    background: white;
    border-radius: 50%;
    filter: blur(8px);
  }

  @keyframes pulseOrb {
    0%, 100% { transform: scale(1); filter: blur(15px); }
    50% { transform: scale(1.1); filter: blur(25px); }
  }

  /* Smooth Reveals */
  .fade-up {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeUpAnim 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes fadeUpAnim {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }

  /* Gradient Text */
  .text-gradient {
    background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* Story Progress Bar */
  .story-progress-bg {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
    height: 3px;
    flex: 1;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: height 0.2s ease, background-color 0.2s ease;
  }
  .story-progress-bg:hover {
    height: 5px;
  }
  .story-progress-fill {
    height: 100%;
    background: #fff;
    transform-origin: left;
    transition: width 0.1s linear;
  }
  
  .spin-slow {
    animation: spin 4s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Cinematic Carousel Styles */
  .carousel-container {
    perspective: 1000px;
    transform-style: preserve-3d;
  }
  
  .carousel-item {
    transition: all 0.7s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .scrubber-track {
    background: rgba(255,255,255,0.1);
    height: 3px;
    width: 100%;
    position: relative;
    cursor: pointer;
  }
  
  .scrubber-fill {
    background: var(--accent-3, #00FFFF);
    height: 100%;
    width: 0%;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  /* Trifold Official Document Styling */
  .trifold-card {
    background: rgba(14, 14, 18, 0.75);
    backdrop-filter: blur(60px);
    -webkit-backdrop-filter: blur(60px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 28px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .trifold-panel {
    position: relative;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0.2) 100%);
  }

  .trifold-crease-left {
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset -12px 0 20px -10px rgba(0, 0, 0, 0.8);
  }

  .trifold-crease-right {
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 12px 0 20px -10px rgba(0, 0, 0, 0.8);
  }

  .tactical-grid-bg {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .scanner-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #00FFFF;
    box-shadow: 0 0 12px #00FFFF, 0 0 24px #00FFFF;
    animation: scanAnim 2.5s ease-in-out infinite;
    z-index: 20;
  }

  @keyframes scanAnim {
    0% { top: 0%; opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  .tactical-seal {
    width: 78px;
    height: 78px;
    border-radius: 50%;
    border: 1.5px dashed rgba(0, 255, 255, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%);
  }

  @media print {
    body {
      background: #050505 !important;
      color: #ffffff !important;
    }
    .astra-bg, .noise-overlay, button {
      display: none !important;
    }
  }
`;

interface ArchiveItem {
  id: number;
  videoUrl: string;
  title: string;
  subtitle: string;
}

interface AIIntroSequenceProps {
  onComplete: () => void;
}

interface HeroCarouselProps {
  archives: ArchiveItem[];
}

// Helper to safely extract Gemini API Key across Vite, Node, and browser environments
const getApiKey = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
      const env = (import.meta as any).env;
      if (env.VITE_GEMINI_API_KEY) return env.VITE_GEMINI_API_KEY;
      if (env.VITE_API_KEY) return env.VITE_API_KEY;
    }
    const g = typeof window !== 'undefined' ? (window as any) : (globalThis as any);
    if (g?.process?.env) {
      if (g.process.env.REACT_APP_GEMINI_API_KEY) return g.process.env.REACT_APP_GEMINI_API_KEY;
      if (g.process.env.GEMINI_API_KEY) return g.process.env.GEMINI_API_KEY;
    }
  } catch (e) {
    // Ignore environment resolution errors
  }
  return "";
};

// ============================================================================
// STORY DATA CONFIGURATION (13 Archive Vectors)
// Sourced from public/ (1.mp4 through 13.mp4)
// ============================================================================
const archiveData: ArchiveItem[] = [
  { id: 0, videoUrl: '/1.mp4', title: 'Vector 01 // Airspace', subtitle: 'Aura & Altitude' },
  { id: 1, videoUrl: '/2.mp4', title: 'Vector 02 // Silhouette', subtitle: 'Tactical Elegance' },
  { id: 2, videoUrl: '/3.mp4', title: 'Vector 03 // Stealth Profile', subtitle: 'Quiet Magnitude' },
  { id: 3, videoUrl: '/4.mp4', title: 'Vector 04 // Velocity', subtitle: 'Editorial Precision' },
  { id: 4, videoUrl: '/5.mp4', title: 'Vector 05 // Cockpit Focus', subtitle: 'AFCAT Trajectory' },
  { id: 5, videoUrl: '/6.mp4', title: 'Vector 06 // Clear Horizon', subtitle: 'Zero Turbulence' },
  { id: 6, videoUrl: '/7.mp4', title: 'Vector 07 // Resonance', subtitle: 'Unspoken Grace' },
  { id: 7, videoUrl: '/8.mp4', title: 'Vector 08 // Neural Vault', subtitle: 'Unbroken Frequency' },
  { id: 8, videoUrl: '/9.mp4', title: 'Vector 09 // Runway Glide', subtitle: 'High-Fashion Cadence' },
  { id: 9, videoUrl: '/10.mp4', title: 'Vector 10 // Stratosphere', subtitle: 'Supersonic Ascent' },
  { id: 10, videoUrl: '/11.mp4', title: 'Vector 11 // Shield Matrix', subtitle: 'Unconditional Sanctuary' },
  { id: 11, videoUrl: '/12.mp4', title: 'Vector 12 // Celestial Apex', subtitle: 'Design & Architecture' },
  { id: 12, videoUrl: '/13.mp4', title: 'Vector 13 // Safe Harbor', subtitle: 'Command Safe Space' },
];

const AIIntroSequence: React.FC<AIIntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(onComplete, 600);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Top right quick skip */}
      <button 
        onClick={handleFinish}
        aria-label="Skip uplink intro sequence"
        className="absolute top-6 right-6 text-white/40 hover:text-white text-xs tracking-widest uppercase transition-colors flex items-center gap-1 cursor-pointer z-50 min-h-[44px] min-w-[44px] p-3"
      >
        Skip Uplink <ChevronRight size={14} />
      </button>

      <div className={`transition-all duration-1000 ${phase >= 1 ? 'scale-150 opacity-0 pointer-events-none absolute' : 'scale-100 opacity-100'}`}>
        <div className="ai-orb">
          <div className="ai-orb-core"></div>
        </div>
      </div>
      
      <div className={`flex flex-col items-center text-center px-4 transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none absolute'}`}>
        <Fingerprint size={48} className="text-white/40 mx-auto mb-6" strokeWidth={1} />
        <h2 className="font-editorial text-3xl md:text-4xl text-white/90 tracking-wide">Neural Sync Established.</h2>
        <p className="text-white/40 text-xs md:text-sm mt-2 font-light tracking-[0.25em] uppercase">Target // Poornima Astra &bull; Nov 07</p>

        <div className={`mt-8 transition-all duration-700 ${phase === 2 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <button 
            onClick={handleFinish}
            className="px-8 py-4 min-h-[48px] rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 flex items-center gap-3 backdrop-blur-md cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
          >
            Initialize Interface <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PREVIEW_DURATION = 2000; // 2 seconds per mp4 in auto-rotation mode

const HeroCarousel: React.FC<HeroCarouselProps> = ({ archives }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // Default to muted for seamless browser autoplay compatibility
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullLengthLocked, setIsFullLengthLocked] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const prevIndexRef = useRef(currentIndex);

  const isFullLength = isHovered || isFullLengthLocked;

  // Playback control when slide or state changes
  useEffect(() => {
    const isSlideChange = prevIndexRef.current !== currentIndex;
    prevIndexRef.current = currentIndex;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentIndex) {
        if (isSlideChange) {
          video.currentTime = 0;
          setProgress(0);
        }
        video.muted = isMuted;
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((e) => {
              console.log("Autoplay notice:", e);
              // Fallback to muted playback if audio autoplay is restricted by browser policy
              if (!video.muted) {
                video.muted = true;
                setIsMuted(true);
                video.play().catch(err => console.log("Muted autoplay fallback failed:", err));
              }
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isPlaying, isMuted]);

  // Mode 1: 2-second auto-rotation preview timer (rotates every 2 seconds when not hovered/clicked)
  useEffect(() => {
    if (!isPlaying || isFullLength) return;

    setProgress(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / PREVIEW_DURATION) * 100);
      setProgress(pct);

      if (elapsed >= PREVIEW_DURATION) {
        clearInterval(interval);
        setCurrentIndex(prev => (prev + 1) % archives.length);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, isFullLength, archives.length]);

  // Mode 2: Full-length progress tracking synced with active video playback (when hovered or clicked)
  useEffect(() => {
    if (!isPlaying || !isFullLength) return;
    let animId: number;

    const updateProgress = () => {
      const activeVideo = videoRefs.current[currentIndex];
      if (activeVideo && Number.isFinite(activeVideo.duration) && activeVideo.duration > 0) {
        const pct = Math.min(100, (activeVideo.currentTime / activeVideo.duration) * 100);
        setProgress(pct);
      }
      animId = requestAnimationFrame(updateProgress);
    };

    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [currentIndex, isPlaying, isFullLength]);

  const handleVideoEnd = useCallback(() => {
    setProgress(0);
    setIsFullLengthLocked(false);
    setCurrentIndex(prev => (prev + 1) % archives.length);
  }, [archives.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProgress(0);
    setIsFullLengthLocked(false);
    setCurrentIndex(prev => (prev + 1) % archives.length);
  }, [archives.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProgress(0);
    setIsFullLengthLocked(false);
    setCurrentIndex(prev => (prev - 1 + archives.length) % archives.length);
  }, [archives.length]);

  const togglePlayPause = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(prev => {
      const nextState = !prev;
      const activeVideo = videoRefs.current[currentIndex];
      if (activeVideo) {
        if (nextState) {
          activeVideo.play().catch(err => console.log("Play error:", err));
        } else {
          activeVideo.pause();
        }
      }
      return nextState;
    });
  }, [currentIndex]);

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted(prev => {
      const nextMuted = !prev;
      const activeVideo = videoRefs.current[currentIndex];
      if (activeVideo) {
        activeVideo.muted = nextMuted;
      }
      return nextMuted;
    });
  }, [currentIndex]);

  // Clicking center video locks full length mode or toggles play/pause
  const handleCenterVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullLengthLocked) {
      setIsFullLengthLocked(true);
      if (!isPlaying) {
        setIsPlaying(true);
        const activeVideo = videoRefs.current[currentIndex];
        activeVideo?.play().catch(err => console.log("Play error:", err));
      }
    } else {
      togglePlayPause(e);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsFullLengthLocked(true);
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, togglePlayPause, toggleMute]);

  // Scrubber click handler to seek within the active video and engage full length mode
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const activeVideo = videoRefs.current[currentIndex];
    setIsFullLengthLocked(true);
    if (activeVideo && Number.isFinite(activeVideo.duration) && activeVideo.duration > 0) {
      activeVideo.currentTime = clickPos * activeVideo.duration;
      setProgress(clickPos * 100);
    }
  };

  const currentArchive = archives[currentIndex] || archives[0];

  return (
    <div className="relative w-full min-h-[60vh] flex flex-col items-center justify-center mb-16 fade-up z-20">
      
      {/* Top Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
          <Fingerprint size={24} className="text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-white text-2xl font-editorial tracking-wider">{currentArchive.title}</h2>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium tracking-widest uppercase border backdrop-blur-sm transition-all ${
              isFullLength 
                ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(0,255,255,0.2)]" 
                : "bg-white/10 border-white/20 text-white/50"
            }`}>
              {isFullLength ? "Full Length" : "2s Rotation"}
            </span>
          </div>
          <p className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-medium mt-0.5">{currentArchive.subtitle}</p>
        </div>
      </div>

      {/* 13-Vector Story Segments (Instagram-style Progress) */}
      <div className="w-full max-w-md flex items-center gap-1.5 px-6 mb-6 z-30">
        {archives.map((item, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setProgress(0);
                setIsFullLengthLocked(true);
                setCurrentIndex(idx);
              }}
              aria-label={`Jump to ${item.title} (full length)`}
              className="story-progress-bg group"
              title={`${item.title} - Click to play full length`}
            >
              <div 
                className="story-progress-fill"
                style={{
                  width: isPast ? '100%' : isCurrent ? `${progress}%` : '0%',
                  backgroundColor: isCurrent ? '#00FFFF' : 'rgba(255,255,255,0.7)'
                }}
              />
            </button>
          );
        })}
      </div>

      {/* 3D Carousel Area */}
      <div className="relative w-full h-[48vh] min-h-[440px] md:h-[55vh] md:min-h-[520px] flex items-center justify-center carousel-container">
        {archives.map((archive, index) => {
          const offset = index - currentIndex;
          const isCenter = offset === 0;
          
          // Advanced wrap-around math for smooth circular 3D offset calculation
          let displayOffset = offset;
          const halfLength = Math.floor(archives.length / 2);
          if (displayOffset > halfLength) displayOffset -= archives.length;
          if (displayOffset < -halfLength) displayOffset += archives.length;
          
          const isVisible = Math.abs(displayOffset) <= 2; // Only render nearby items for performance
          if (!isVisible && !isCenter) return null;

          const translateX = displayOffset * 70; // Spread items out horizontally
          const scale = isCenter ? 1 : Math.max(0.6, 1 - Math.abs(displayOffset) * 0.2);
          const blur = isCenter ? 0 : Math.min(8, Math.abs(displayOffset) * 4);
          const opacity = isCenter ? 1 : Math.max(0, 0.8 - Math.abs(displayOffset) * 0.3);
          const zIndex = 50 - Math.abs(displayOffset);

          return (
            <div 
              key={archive.id}
              onClick={(e) => {
                if (!isCenter) {
                  setCurrentIndex(index);
                  setIsFullLengthLocked(true);
                  setProgress(0);
                } else {
                  handleCenterVideoClick(e);
                }
              }}
              onMouseEnter={() => {
                if (isCenter) setIsHovered(true);
              }}
              onMouseLeave={() => {
                if (isCenter) setIsHovered(false);
              }}
              className="carousel-item absolute w-[68vw] max-w-[320px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/20 bg-zinc-900 cursor-pointer select-none"
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                filter: `blur(${blur}px)`,
                opacity: opacity,
                zIndex: zIndex,
                boxShadow: isCenter ? '0 0 40px rgba(0, 255, 255, 0.15)' : 'none'
              }}
            >
              <video
                ref={el => { videoRefs.current[index] = el; }}
                src={archive.videoUrl}
                className="w-full h-full object-cover"
                playsInline
                preload="auto"
                loop={false}
                muted={isMuted}
                onEnded={isCenter ? handleVideoEnd : undefined}
                onClick={isCenter ? handleCenterVideoClick : undefined}
              />
              
              {/* Tactical Mode Toggle Badge on active center video */}
              {isCenter && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullLengthLocked(prev => !prev);
                  }}
                  aria-label={isFullLength ? "Switch to 2s auto-preview" : "Lock full length playback"}
                  className={`absolute top-4 left-4 z-40 px-3 py-1 min-h-[36px] rounded-full border backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-lg text-[10px] font-medium tracking-widest uppercase ${
                    isFullLength
                      ? "bg-cyan-950/80 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                      : "bg-black/60 border-white/20 text-white/70 hover:text-white hover:border-white/40"
                  }`}
                  title={isFullLength ? "Full Length Active (Click to switch to 2s preview)" : "2s Preview (Hover or click to play full length)"}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isFullLength ? "bg-cyan-400 animate-pulse" : "bg-white/40"}`} />
                  <span>{isFullLength ? "Full Length" : "2s Preview"}</span>
                </button>
              )}

              {/* Floating Mute Toggle on active video */}
              {isCenter && (
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  className="absolute top-4 right-4 z-40 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 hover:border-cyan-400/60 transition-all cursor-pointer shadow-lg"
                  title={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {isMuted ? <VolumeX size={18} className="text-white/70" /> : <Volume2 size={18} className="text-cyan-400" />}
                </button>
              )}

              {/* Play/Pause Overlay for active video */}
              {isCenter && !isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                    <Play size={32} className="text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation & Video Scrubber */}
      <div 
        className="w-full max-w-md px-8 flex flex-col items-center gap-6 mt-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Custom Progress Scrubber for current video */}
        <div 
          className="w-full relative h-6 flex items-center group cursor-pointer" 
          onClick={handleScrubberClick}
          aria-label="Seek active video timeline"
          role="slider"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="scrubber-track rounded-full overflow-hidden h-[3px] bg-white/10 group-hover:h-[6px] transition-all">
            <div className="scrubber-fill relative" style={{ width: `${progress}%` }}>
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_#00FFFF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={handlePrev}
            aria-label="Previous archive"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center cursor-pointer"
            title="Previous Vector (Left Arrow)"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause video playback" : "Resume video playback"}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center cursor-pointer"
            title={isPlaying ? "Pause video (Space)" : "Resume video (Space)"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
          </button>

          <div className="font-editorial text-white/50 text-sm tracking-[0.3em] select-none px-1">
            <span className="text-white text-lg font-medium">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(archives.length).padStart(2, '0')}
          </div>
          
          <button 
            onClick={handleNext}
            aria-label="Next archive"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center cursor-pointer"
            title="Next Vector (Right Arrow)"
          >
            <ChevronRight size={20} />
          </button>

          <div className="h-4 w-px bg-white/10 mx-1"></div>

          <button 
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center cursor-pointer"
            title={isMuted ? "Unmute audio (M)" : "Mute audio (M)"}
          >
            {isMuted ? <VolumeX size={18} className="text-white/40" /> : <Volume2 size={18} className="text-cyan-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const defaultBirthdayDirective = 
`Cadet Poornima,

On this seventh day of November, the airspace stands in formal commendation of an exceedingly rare architecture. While the world may only perceive effortless runway grace, telemetry registers your true coordinates: the razor precision of an elite UI/UX designer fused with the unflinching courage of an Indian Air Force aviator engineered for the cockpit of stealth fighters.

Past flight paths brought heavy storms and betrayals by those who failed to comprehend the sacredness of your trust. Those trials tested your altitude, but they never broke your trajectory—they only honed your radar and fortified an unbreakable inner sanctuary.

By executive decree of Project Zenith, this airspace is permanently ratified as your unconditional safe harbor. In this frequency, your coordinates are guarded, your data is sacred, and your perimeter is forever impenetrable against turbulence or betrayal. You are free to command your own horizon without fear.

Happy Birthday, Poornima. May your ascent remain supersonic, your radar crystal clear, and your skies boundless.`;

const BentoDashboard: React.FC = () => {
  const [aiResponse, setAiResponse] = useState(defaultBirthdayDirective);
  const [isThinking, setIsThinking] = useState(false);

  const fetchAIAssessment = async () => {
    setIsThinking(true);
    try {
      const apiKey = getApiKey();
      const prompt = "Generate an official, profound, and deeply moving birthday letter for a girl named Poornima celebrating her birthday on November 7th. She has the effortless aesthetic of a high-fashion model, but her real ambition is to be an Indian Air Force pilot (AFCAT) flying stealth jets like the F-22 or B-2. She has been betrayed by friends and family in the past, so she has trust issues. Her mother is a highly successful graphics designer for big tech MNCs, and Poornima herself is studying to be a great UI/UX designer. Write this as an 'Official Executive Birthday Commendation & Airspace Decree' from Astra Core and Kunal: formally wish her a very Happy Birthday, honor her extraordinary dual nature of runway grace and supersonic warrior intellect, acknowledge her resilience through past betrayals, and officially decree that this airspace is an eternal, inviolable safe space where her trust is protected. Keep the tone like a high-level military-diplomatic dispatch blended with deep empathetic warmth. No hashtags.";

      if (!apiKey) {
        // High-craft fallback response matching the exact prompt constraints when no API key is set
        await new Promise(resolve => setTimeout(resolve, 1400));
        setAiResponse(defaultBirthdayDirective);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
        setAiResponse(result.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setAiResponse(defaultBirthdayDirective);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center p-4 md:p-8 lg:p-12 box-border pb-24">
      
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 fade-up z-30 relative">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-white/70 text-[10px] font-medium tracking-[0.3em] uppercase">Project Zenith // Safe Space Airspace</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-medium tracking-widest uppercase text-white/40">
          <span className="hidden sm:inline border border-white/10 px-2.5 py-1 rounded-full bg-white/5">07.NOV // ASTRA PROTOCOL</span>
          <span>Auth // Kunal</span>
        </div>
      </header>

      {/* Hero Section Carousel */}
      <HeroCarousel archives={archiveData} />

      {/* Bento Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 relative z-30">
        
        {/* Main Card */}
        <div className="ultra-glass bento-hover md:col-span-2 p-8 lg:p-10 flex flex-col justify-end min-h-[350px] fade-up delay-1 group relative">
          <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-400/30 transition-all duration-500">
            <Sparkles size={20} className="text-white/60 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="space-y-4">
            <h1 className="font-editorial text-5xl lg:text-7xl font-light text-gradient leading-tight">
              Aura &<br/>Altitude.
            </h1>
            <p className="text-white/75 text-sm lg:text-base font-light leading-relaxed max-w-md">
              Some people are engineered for the runway. Others are built for the cockpit of a stealth bomber. You possess the exceedingly rare architecture for both.
            </p>
          </div>
        </div>

        {/* F-35C Lightning II 3D Interactive Model Card */}
        <div className="ultra-glass bento-hover md:col-span-2 p-6 lg:p-8 flex flex-col justify-between min-h-[350px] fade-up delay-2 group relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">
                Tactical 3D Vector // AFCAT Airspace
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[9px] tracking-wider uppercase font-medium">
              F-35C Stealth
            </div>
          </div>

          {/* 3D Viewport */}
          <div className="relative w-full h-[240px] sm:h-[260px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
            <iframe
              title="F-35C Lightning II"
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              src="https://sketchfab.com/models/1b187b18ce1541e2ae3321065ac61cbe/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_hint=0"
            />
            {/* Tactical HUD corner reticles */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-400/40 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-400/40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-400/40 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-400/40 pointer-events-none" />
          </div>

          {/* Footer with Attribution & Interactive Hint */}
          <div className="flex items-center justify-between text-[11px] text-white/50 pt-2">
            <span className="font-light tracking-wide flex items-center gap-1.5 text-white/60">
              <Crosshair size={12} className="text-cyan-400" />
              Interactive 3D • Drag to Orbit / Zoom
            </span>
            <a
              href="https://sketchfab.com/3d-models/f-35c-lightning-ii-1b187b18ce1541e2ae3321065ac61cbe"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cyan-400/80 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[10px] tracking-wider uppercase font-medium"
              title="F-35C Lightning II by saippua on Sketchfab"
            >
              saippua // Sketchfab <ChevronRight size={12} />
            </a>
          </div>
        </div>

        {/* Ambition Card */}
        <div className="ultra-glass bento-hover md:col-span-2 p-8 flex flex-col justify-between min-h-[220px] fade-up delay-3 group">
          <div className="flex justify-between items-start">
            <Crosshair size={24} className="text-white/50 group-hover:text-cyan-400 transition-colors duration-500" strokeWidth={1.5} />
            <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase">AFCAT Target</span>
          </div>
          <div>
            <h3 className="text-xl font-medium text-white/90 mb-3">The Ambition</h3>
            <p className="text-white/75 text-sm font-light leading-relaxed">
              Behind the effortless model aesthetic and UI/UX precision is a tactical mind. A strength forged in silence, carrying the profound impact of an F-22 and 5th-generation stealth aviation.
            </p>
          </div>
        </div>

        {/* Secure Uplink Card */}
        <div className="ultra-glass bento-hover md:col-span-2 p-8 flex flex-col justify-between min-h-[220px] fade-up delay-4 group">
           <div className="flex justify-between items-start">
            <Shield size={24} className="text-white/50 group-hover:text-purple-400 transition-colors duration-500" strokeWidth={1.5} />
            <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Secure Uplink</span>
          </div>
          <div>
            <h3 className="text-xl font-medium text-white/90 mb-3">Clear Airspace</h3>
            <p className="text-white/75 text-sm font-light leading-relaxed">
              In this frequency, your radar is clear. No turbulence, no betrayal. Just a safe place to land and be entirely yourself.
            </p>
          </div>
        </div>

        {/* Official Trifold Document: Astra Core Birthday Directive */}
        <div className="md:col-span-4 fade-up delay-5 w-full">
          {/* Document Section Header & Control Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <div>
                <span className="text-white/80 text-xs font-medium tracking-[0.25em] uppercase">
                  Astra Core Telemetry // Official Executive Directive
                </span>
                <span className="hidden sm:inline-block ml-3 text-[10px] text-white/40 tracking-widest font-mono">
                  DISPATCH REF: PZ-ASTRA-0711
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                aria-label="Print official directive document"
                className="px-3.5 py-2 min-h-[38px] rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 text-white/70 hover:text-white transition-all text-xs font-medium flex items-center gap-2 cursor-pointer backdrop-blur-md"
                title="Print Official Document"
              >
                <Printer size={14} className="text-cyan-400" />
                <span className="hidden sm:inline">Print Document</span>
              </button>

              <button 
                onClick={fetchAIAssessment}
                disabled={isThinking}
                aria-label={isThinking ? 'Synthesizing Directive...' : 'Re-synthesize Directive'}
                className="px-4 py-2 min-h-[38px] rounded-xl bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all text-xs font-medium text-cyan-300 flex items-center gap-2 group/btn disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                title="Re-synthesize official AI birthday directive"
              >
                <Activity size={14} className={isThinking ? "animate-pulse text-cyan-400" : "group-hover/btn:rotate-12 transition-transform"} />
                <span>{isThinking ? 'Synthesizing Directive...' : 'Re-synthesize Directive'}</span>
              </button>
            </div>
          </div>

          {/* The Trifold Physical / Glass Document Container */}
          <div className="trifold-card tactical-grid-bg">
            {/* Top Classification Margin */}
            <div className="w-full bg-black/40 border-b border-white/10 px-6 py-2.5 flex flex-wrap items-center justify-between text-[10px] font-mono tracking-[0.2em] text-white/40">
              <div className="flex items-center gap-2">
                <Lock size={11} className="text-cyan-400" />
                <span className="text-cyan-300/80 uppercase">CLASSIFIED // EYES ONLY: CADET POORNIMA</span>
              </div>
              <div className="flex items-center gap-4">
                <span>SECURITY CLEARANCE: LEVEL-V</span>
                <span className="hidden sm:inline text-white/30">|</span>
                <span className="hidden sm:inline text-white/50">PROJECT ZENITH AIRSPACE COMMAND</span>
              </div>
            </div>

            {/* 3-Panel Trifold Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
              
              {/* PANEL I (Left Flap: Flight Manifest & Security Docket) */}
              <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 trifold-panel">
                <div className="space-y-6">
                  {/* Panel Fold Indicator */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/30 tracking-[0.25em] uppercase pb-2 border-b border-white/5">
                    <span>PANEL I // MANIFEST</span>
                    <span>FOLD α</span>
                  </div>

                  {/* Emblem */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.15)]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Airspace Docket</h4>
                      <p className="text-[10px] text-white/40 font-mono">FILE: PZ-ASTRA-0711</p>
                    </div>
                  </div>

                  {/* Metadata Fields */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest block">Designated Subject</span>
                      <p className="text-white font-medium">Cadet Poornima</p>
                      <span className="text-[10px] text-white/50 block">Callsign: Astra-01 // Apex</span>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest block">Celebration Apex</span>
                      <p className="text-white font-medium">07 November (Annual)</p>
                      <span className="text-[10px] text-white/50 block">Mission: Birthday Commendation</span>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest block">Core Specializations</span>
                      <p className="text-white/90 text-[11px] leading-tight font-sans">
                        • Indian Air Force (AFCAT) Pursuit<br/>
                        • 5th-Gen Stealth Interceptors<br/>
                        • Elite UI/UX Digital Architecture
                      </p>
                    </div>
                  </div>
                </div>

                {/* Left Flap Footer (Barcode & Security Seal) */}
                <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                    <span>SECTOR STATUS</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      <CheckCircle2 size={11} /> 100% SECURE
                    </span>
                  </div>
                  {/* Decorative Barcode */}
                  <div className="h-7 w-full bg-white/5 rounded flex items-center justify-between px-2 font-mono text-[9px] tracking-widest text-white/30 overflow-hidden border border-white/5">
                    <span>||||| ||| ||||||| |||| |||||| ||||| |||</span>
                    <span className="hidden sm:inline">AUTH-07NOV</span>
                  </div>
                </div>
              </div>

              {/* PANEL II (Center Page: The Official Birthday Letter) */}
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between relative trifold-panel bg-black/30 trifold-crease-left trifold-crease-right">
                {/* Scanner line when synthesizing */}
                {isThinking && <div className="scanner-line" />}

                <div>
                  {/* Center Header */}
                  <div className="text-center space-y-2 pb-6 border-b border-white/10 relative">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 text-[10px] font-mono tracking-[0.3em] uppercase">
                      <Sparkles size={13} />
                      <span>OFFICIAL DIRECTIVE // OPERATION ASTRA</span>
                      <Sparkles size={13} />
                    </div>
                    <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-gradient tracking-wide">
                      Executive Birthday Commendation
                    </h2>
                    <p className="text-white/50 text-[11px] font-mono tracking-[0.2em] uppercase">
                      Decree of Permanent Sanctuary • 07 November
                    </p>
                  </div>

                  {/* Letter Content */}
                  <div className="py-6 sm:py-8 space-y-4">
                    {isThinking ? (
                      <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                        <Activity size={32} className="text-cyan-400 animate-pulse" />
                        <p className="text-cyan-300 text-sm font-mono tracking-widest uppercase">
                          Decrypting Neural Telemetry...
                        </p>
                        <p className="text-white/40 text-xs font-light max-w-sm">
                          Synthesizing personalized flight coordinates and official birthday commendation for Cadet Poornima.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-white/90 font-light text-sm sm:text-base leading-relaxed text-left">
                        {aiResponse.split('\n\n').map((paragraph, index) => {
                          const isFirst = index === 0;
                          const isBirthdayWish = paragraph.toLowerCase().includes('happy birthday');
                          return (
                            <p 
                              key={index} 
                              className={`${
                                isFirst 
                                  ? "font-editorial text-lg sm:text-xl text-white tracking-wide font-normal" 
                                  : isBirthdayWish 
                                    ? "p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 text-cyan-200 font-normal shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                                    : "text-white/80"
                              }`}
                            >
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Center Page Footer: Official Seal */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Glowing Cyan Hologram Seal */}
                    <div className="tactical-seal shadow-[0_0_25px_rgba(0,255,255,0.2)]">
                      <Award size={22} className="text-cyan-400 mb-0.5" />
                      <span className="text-[7px] font-mono tracking-tighter text-cyan-300 uppercase font-bold">RATIFIED</span>
                      <span className="text-[6px] font-mono tracking-widest text-cyan-400/80">07.NOV</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium uppercase tracking-wider">Seal of Permanent Sanctuary</p>
                      <p className="text-[10px] text-white/40 font-mono">Inviolable Safe Space Protocol // Project Zenith</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase block">VALIDITY</span>
                    <span className="text-white font-mono text-xs font-semibold tracking-wider">PERPETUAL // NO EXPIRY</span>
                  </div>
                </div>
              </div>

              {/* PANEL III (Right Flap: Telemetry Endorsement & Ratification) */}
              <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 trifold-panel">
                <div className="space-y-6">
                  {/* Panel Fold Indicator */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/30 tracking-[0.25em] uppercase pb-2 border-b border-white/5">
                    <span>PANEL III // RATIFICATION</span>
                    <span>FOLD β</span>
                  </div>

                  {/* Telemetric Parameters */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase block">
                      Telemetry Endorsements
                    </span>

                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-white/50 text-[10px]">RADAR STATUS</span>
                        <span className="text-cyan-300 font-medium">CLEARED (0% THREAT)</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-white/50 text-[10px]">AIRSPACE TRUST</span>
                        <span className="text-purple-300 font-medium">100% UNCONDITIONAL</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-white/50 text-[10px]">TURBULENCE</span>
                        <span className="text-cyan-400 font-medium">ZERO / SHIELDED</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-white/50 text-[10px]">ALTITUDE LIMIT</span>
                        <span className="text-white font-medium">UNRESTRICTED</span>
                      </div>
                    </div>
                  </div>

                  {/* Solemn Official Signature Block */}
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-3">
                    <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase block">
                      Authorizing Officer Sign-Off
                    </span>
                    
                    {/* Stylized Signature */}
                    <div className="py-1">
                      <p className="font-editorial text-2xl text-cyan-300 italic tracking-wider">
                        Kunal Saini
                      </p>
                      <div className="w-full h-px bg-gradient-to-r from-cyan-400/60 via-purple-400/40 to-transparent mt-1" />
                    </div>

                    <div>
                      <p className="text-[11px] text-white/90 font-medium">Commanding Safe Space Officer</p>
                      <p className="text-[9px] font-mono text-white/40">Auth: Kunal // Sovereign Radar Sanctuary</p>
                    </div>
                  </div>
                </div>

                {/* Right Flap Stamp Box */}
                <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                  <div className="p-3 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-950/20 text-center font-mono">
                    <p className="text-[10px] font-bold text-cyan-300 tracking-widest uppercase">OFFICIALLY RATIFIED</p>
                    <p className="text-[8px] text-white/50 tracking-wider mt-0.5">NOVEMBER 07 • ALL FREQUENCIES SECURED</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Dashboard caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative z-50 flex flex-col items-center justify-center min-h-screen text-white p-8 text-center">
          <h2 className="text-2xl font-editorial mb-4">Telemetric Alignment Reset</h2>
          <p className="text-white/60 mb-6 text-sm">A telemetry synchronization event occurred.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer"
          >
            Re-align Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Universal Background */}
      <div className="astra-bg">
        <div className="mesh-gradient"></div>
      </div>
      <div className="noise-overlay"></div>
      
      {/* Routing State */}
      <ErrorBoundary>
        {!isUnlocked ? (
          <AIIntroSequence onComplete={() => setIsUnlocked(true)} />
        ) : (
          <BentoDashboard />
        )}
      </ErrorBoundary>
    </>
  );
}