import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Camera, Clapperboard, Flame, Heart, Pause, Plane, Play, Sparkles, Volume2, VolumeX, X } from 'lucide-react';

const photos = [
  { src: '/img/WhatsApp Image 2026-09-21 at 22.15.42.jpeg', label: 'One for the camera roll' },
  { src: '/img/WhatsApp Image 2026-10-06 at 17.13.27.jpeg', label: 'A day to keep' },
  { src: '/img/WhatsApp Image 2026-09-21 at 22.16.34.jpeg', label: 'Just you' },
  { src: '/img/tanu-memory.webp', label: 'Another favourite' },
  { src: '/img/842608892_17904385437588295_5104484414049162163_n.webp', label: 'A little snapshot' },
  { src: '/img/857189100_17905787178588295_1323502340611779721_n.webp', label: 'One to remember' },
  { src: '/img/855643127_17905789452588295_4710484533333073808_n.webp', label: 'A favourite frame' },
];
const clips = Array.from({ length: 17 }, (_, i) => `/video/${i + 1}.mp4`);

export default function App() {
  const [open, setOpen] = useState<{ title: string; body: string } | null>(null);
  const [roseCount, setRoseCount] = useState(0);
  const [photo, setPhoto] = useState<number | null>(null);
  const [clip, setClip] = useState<number | null>(null);
  const [clipMuted, setClipMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [songPlaying, setSongPlaying] = useState(false);
  const songPlayingRef = useRef(false);
  const [mediaFocus, setMediaFocus] = useState<{ kind: 'video' | 'image'; index: number } | null>(null);
  const [filmAudioNeedsTap, setFilmAudioNeedsTap] = useState(false);
  const filmAudioIndexRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(29.5);
  const [candleBlown, setCandleBlown] = useState(false);
  const [hugs, setHugs] = useState(19);
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; size: number; char: string }>>([]);
  const waveformBars = [12, 18, 10, 24, 16, 28, 14, 20, 10, 24, 18, 12, 22, 16, 20, 10, 14, 26, 18, 12, 26, 16, 22, 8];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleVoice = () => {
    if (!audioRef.current) return;
    if (voicePlaying) {
      audioRef.current.pause();
      setVoicePlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setVoicePlaying(true);
      }).catch(() => {
        setVoicePlaying(true);
      });
    }
  };

  const seekVoice = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * (audioRef.current.duration || 29.5);
    audioRef.current.currentTime = newTime;
    setVoiceProgress(newTime);
  };

  const blowCandle = () => {
    setCandleBlown(true);
    const newPetals = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 88 + 6,
      delay: Math.random() * 2,
      size: Math.random() * 12 + 14,
      char: i % 3 === 0 ? '🎈' : i % 3 === 1 ? '🌹' : '💙',
    }));
    setPetals(newPetals);
  };

  const sendHug = () => {
    setHugs(h => h + 1);
    const newPetal = {
      id: Date.now(),
      left: Math.random() * 60 + 20,
      delay: 0,
      size: 18,
      char: '💙',
    };
    setPetals(prev => [...prev.slice(-30), newPetal]);
  };


  const focusMediaForPage = (pageIndex: number) => {
    const kind = pageIndex === 0 ? 'video' : pageIndex === 2 ? 'image' : null;
    const syncFilmAudio = (activeIndex: number | null) => {
      const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('.film-card video'));
      videos.forEach((video, index) => {
        if (index !== activeIndex) {
          video.muted = true;
          video.pause();
          return;
        }
        video.muted = false;
        video.volume = 0.8;
        if (video.paused) {
          video.play().then(() => setFilmAudioNeedsTap(false)).catch(() => setFilmAudioNeedsTap(true));
        }
      });
    };
    if (!kind) {
      syncFilmAudio(null);
      setMediaFocus(current => current ? null : current);
      return;
    }
    const selector = kind === 'video' ? '.film-card' : '.memory';
    const cards = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!cards.length) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const index = cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      return { index, distance: Math.hypot(rect.left + rect.width / 2 - centerX, rect.top + rect.height / 2 - centerY) };
    }).sort((a, b) => a.distance - b.distance)[0].index;
    setMediaFocus(current => current?.kind === kind && current.index === index ? current : { kind, index });
    if (kind === 'video') {
      filmAudioIndexRef.current = index;
      syncFilmAudio(index);
    } else {
      syncFilmAudio(null);
    }
  };

  const enableFilmAudio = () => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('.film-card video'));
    const activeVideo = videos[filmAudioIndexRef.current];
    if (!activeVideo) return;
    videos.forEach(video => { if (video !== activeVideo) { video.muted = true; video.pause(); } });
    activeVideo.muted = false;
    activeVideo.volume = 0.8;
    activeVideo.play().then(() => setFilmAudioNeedsTap(false)).catch(() => setFilmAudioNeedsTap(true));
  };

  const openClip = (index: number) => {
    document.querySelectorAll<HTMLVideoElement>('.film-card video').forEach(video => { video.muted = true; video.pause(); });
    setClipMuted(false);
    setClip(index);
  };

  const closeClip = () => {
    setClip(null);
    if (document.getElementById('movie')?.classList.contains('active-page')) focusMediaForPage(0);
  };

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.reveal-chapter');
    const ordered = Array.from(sections);
    let starts: number[] = [];
    const measurePages = () => {
      starts = ordered.map(page => page.getBoundingClientRect().top + window.scrollY);
      updatePage();
    };
    const updatePage = () => {
      const roseChapterIndex = ordered.findIndex(page => page.id === 'roses');
      const nextChapterStart = starts[roseChapterIndex + 1];
      const roseChapter = ordered[roseChapterIndex];
      if (roseChapter && nextChapterStart !== undefined && roseChapter.dataset.rosesComplete !== 'true') {
        const gatePosition = nextChapterStart - window.innerHeight * .9 - 1;
        if (window.scrollY > gatePosition) {
          window.scrollTo(0, gatePosition);
          return;
        }
      }
      const edge = window.scrollY + window.innerHeight * .9;
      let currentIndex = -1;
      starts.forEach((start, index) => { if (edge >= start) currentIndex = index; });
      ordered.forEach((page, index) => {
        if (index <= currentIndex) page.classList.add('in-view');
        page.classList.toggle('active-page', index === currentIndex);
        page.classList.toggle('turned-page', index < currentIndex);
        page.classList.toggle('waiting-page', index > currentIndex);
      });
      const film = document.querySelector<HTMLElement>('.film');
      const track = document.querySelector<HTMLElement>('.film-grid');
      if (film && track) {
        const travel = Math.max(0, track.scrollWidth - window.innerWidth);
        const progress = Math.min(1, Math.max(0, -film.getBoundingClientRect().top / Math.max(1, film.offsetHeight - window.innerHeight)));
        track.style.transform = `translateX(${-travel * progress}px)`;
      }
      const gallery = document.querySelector<HTMLElement>('.gallery');
      const photoTrack = document.querySelector<HTMLElement>('.gallery-grid');
      if (gallery && photoTrack) {
        const travel = Math.max(0, photoTrack.scrollWidth - window.innerWidth);
        const progress = Math.min(1, Math.max(0, -gallery.getBoundingClientRect().top / Math.max(1, gallery.offsetHeight - window.innerHeight)));
        photoTrack.style.transform = `translateX(${-travel * progress}px)`;
      }
      const story = document.querySelector<HTMLElement>('.dreams');
      const storyTrack = document.querySelector<HTMLElement>('.dream-story-track');
      if (story && storyTrack) {
        const travel = Math.max(0, story.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -story.getBoundingClientRect().top / Math.max(1, travel)));
        storyTrack.style.transform = `translateY(${-travel * progress}px)`;
        const activeScene = Math.min(2, Math.floor(progress * 2 + .001));
        storyTrack.querySelectorAll('.dream-scene').forEach((scene, index) => scene.classList.toggle('is-current', index === activeScene));
        if ((currentIndex !== 3 || activeScene !== 2) && songPlayingRef.current) {
          songPlayingRef.current = false;
          setSongPlaying(false);
        }
      }
      focusMediaForPage(currentIndex);
    };
    measurePages();
    window.addEventListener('scroll', updatePage, { passive: true });
    window.addEventListener('resize', measurePages);
    document.fonts?.ready.then(measurePages);
    return () => {
      window.removeEventListener('scroll', updatePage);
      window.removeEventListener('resize', measurePages);
    };
  }, []);
  useEffect(() => {
    const filmTrack = document.querySelector('.film-grid');
    const photoTrack = document.querySelector('.gallery-grid');
    const onFilmScroll = () => { if (document.getElementById('movie')?.classList.contains('active-page')) focusMediaForPage(0); };
    const onPhotoScroll = () => { if (document.getElementById('memories')?.classList.contains('active-page')) focusMediaForPage(2); };
    filmTrack?.addEventListener('scroll', onFilmScroll, { passive: true });
    photoTrack?.addEventListener('scroll', onPhotoScroll, { passive: true });
    return () => {
      filmTrack?.removeEventListener('scroll', onFilmScroll);
      photoTrack?.removeEventListener('scroll', onPhotoScroll);
    };
  }, []);
  const goToMovie = () => { setStarted(true); document.getElementById('movie')?.scrollIntoView({ behavior: 'smooth' }); };
  const toggleSong = () => setSongPlaying(current => { songPlayingRef.current = !current; return !current; });

  const reveal = (title: string, body: string) => setOpen({ title, body });
  const notes = [
    'I hope today has Jab We Met, something delicious, and exactly as much doing-nothing as you want.',
    'I love how you notice the small details. Your eye for design is already yours—keep making things the way you see them.',
    'And keep going after that pilot’s seat. One class, one exam, one brave step at a time. I’ll be in your corner.',
    'Nineteen blue roses for nineteen. Here’s to a year that feels like yours.',
  ];

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap');
      *{box-sizing:border-box} html{scroll-behavior:smooth} body{margin:0;background:#f8f5f0;color:#202b35;font-family:'Manrope',sans-serif} button{font:inherit;color:inherit} button:focus-visible{outline:3px solid #386ca5;outline-offset:3px}.pill:disabled{cursor:default;opacity:.78;transform:none}
      .page{overflow:clip}.top{position:fixed;z-index:20;top:14px;left:50%;transform:translateX(-50%);width:min(94%,1050px);display:flex;align-items:center;justify-content:space-between;padding:10px 14px 10px 20px;border:1px solid #d5dce4;border-radius:99px;background:#fff;color:#273849;box-shadow:0 8px 30px #253a5615}.brand{font-weight:700;font-size:13px;letter-spacing:.04em}.top a{font-size:12px;color:#3d4b58;text-decoration:none;margin:0 9px}.top button,.pill{border:0;border-radius:99px;padding:11px 17px;background:#24466f;color:#fff;cursor:pointer;transition:.2s}.top button:hover,.pill:hover{transform:translateY(-2px);background:#18385f}
      .hero,section,.footer{min-height:100svh;position:relative}.hero{display:grid;place-items:center;text-align:center;padding:100px 24px 60px;background:#f4f6f8}@keyframes float{50%{transform:translateY(-8px)}}
      .hero-inner{max-width:840px;position:relative;z-index:1}.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#395c81;font-weight:700}.hero h1{color:#202b35;font:400 clamp(64px,11vw,132px)/.88 'Instrument Serif',Georgia,serif;letter-spacing:-.035em;margin:24px 0 16px}.hero h1 em{color:#315c8b;font-weight:400}.hero p{font:italic 23px 'Instrument Serif',Georgia,serif;color:#354452;margin:15px 0 32px}.hint{margin-top:28px;font-size:11px;color:#3b4854;letter-spacing:.08em}.float-rose{color:#315f9c;display:inline-block;animation:float 3s ease-in-out infinite}
      section{padding:100px 24px}.wrap{width:min(100%,1050px);margin:auto}.section-head{margin-bottom:25px}.section-head small{color:#294e75;text-transform:uppercase;letter-spacing:.14em;font-size:11px;font-weight:700}.section-head h2{font:400 clamp(37px,5vw,60px)/1.03 'Instrument Serif',Georgia,serif;margin:10px 0;color:#202b35}.section-head p{color:#33414e;max-width:570px;line-height:1.7}.film{background:#e5edf6;color:#202b35;position:relative}.film .section-head small{color:#294e75}.film .section-head p{color:#33414e}.film-sound-button{margin-top:9px;padding:9px 13px;border:1px solid #294e75;border-radius:999px;background:#294e75;color:#fff;font-size:12px;font-weight:600;cursor:pointer}.film-grid{display:flex;gap:16px;overflow-x:auto;overflow-y:hidden;padding:8px 4px 24px;scroll-snap-type:x mandatory;scrollbar-color:#879bb3 transparent}.film-card{flex:0 0 clamp(220px,23vw,270px);scroll-snap-align:start;border:1px solid #c4d0dc;background:#fff;color:#202b35;text-align:left;padding:0;border-radius:18px;overflow:hidden;cursor:pointer;transition:.25s;box-shadow:0 7px 24px #24395112}.film-card:hover{transform:translateY(-4px);background:#fff;box-shadow:0 12px 28px #24395120}.film-card video{width:100%;height:clamp(150px,22vh,205px);object-fit:cover;display:block;background:#152237}.film-label{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;font-size:13px}.film-label span:last-child{color:#294e75}
      .bouquet{background:linear-gradient(145deg,#f1f5fa,#e4edf7 55%,#f7f8fa)}.bouquet-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:clamp(28px,6vw,74px);align-items:center}.bouquet-art{min-height:clamp(390px,62vh,610px);border-radius:30px;background:#d7e2ef;position:relative;overflow:hidden;box-shadow:0 28px 70px #203c5b25}.bouquet-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 55%;transition:transform 1s ease}.bouquet-art:hover .bouquet-photo{transform:scale(1.035)}.bouquet-art:after{content:'';position:absolute;inset:45% 0 0;background:linear-gradient(transparent,#17294355);pointer-events:none}.rose{position:absolute;z-index:1;width:clamp(48px,7vw,76px);aspect-ratio:1;border:2px solid #fff;border-radius:50%;overflow:hidden;box-shadow:0 8px 22px #132d4d55;animation:rise 1s cubic-bezier(.2,.75,.25,1) both;pointer-events:none}.rose img{width:100%;height:100%;object-fit:cover;transition:transform .35s}.rose-count{margin:12px 0 0;color:#345675;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.bouquet-credit{margin:8px 0 0;font-size:10px;line-height:1.5;color:#66798c}.bouquet-copy{line-height:1.8;color:#354452}.bouquet-copy h2{font:400 48px 'Instrument Serif',Georgia,serif;color:#202a34;line-height:1.02}.bouquet-copy .pill{margin-top:10px}@keyframes rise{from{transform:translateY(35px) scale(.4);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
      .gallery{background:#f7f6f2}.gallery-grid{display:flex;gap:16px;overflow-x:auto;overflow-y:hidden;padding:8px 4px 24px;scroll-snap-type:x mandatory;scrollbar-color:#879bb3 transparent}.memory{flex:0 0 clamp(220px,23vw,270px);border:0;padding:0;background:white;text-align:left;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px #27395312;cursor:pointer;transition:.25s;scroll-snap-align:center}.memory:hover{transform:translateY(-5px);box-shadow:0 16px 35px #27395322}.memory img{width:100%;height:245px;display:block;object-fit:cover;background:#e7e9eb}.memory span{display:block;padding:13px 14px;font:italic 18px 'Instrument Serif',Georgia,serif;color:#283846}.gallery-count{display:inline-flex;align-items:center;gap:7px;margin-top:6px;padding:8px 12px;border:1px solid #c9d5e1;border-radius:99px;color:#345675;background:#ffffffa8;font-size:11px;letter-spacing:.08em;text-transform:uppercase}.gallery.active-page .gallery-count{display:none}
      .dreams{isolation:isolate;background:radial-gradient(ellipse at 12% 8%,#ffffffd9 0,transparent 38%),linear-gradient(145deg,#dce8f4,#edf2f7 58%,#e1eaf4);overflow:hidden}.dreams:before,.dreams:after{content:'';position:absolute;z-index:-1;border:1px solid #6687aa22;border-radius:50%;pointer-events:none}.dreams:before{width:390px;height:390px;right:-130px;top:-170px;box-shadow:0 0 0 28px #6687aa08,0 0 0 64px #6687aa06}.dreams:after{width:220px;height:220px;left:-120px;bottom:-105px;box-shadow:0 0 0 24px #6687aa08,0 0 0 52px #6687aa06}.story-wrap{position:relative;width:min(100%,1120px)}.story-heading{position:relative;z-index:1;max-width:780px;margin:0 auto 20px;text-align:center}.story-heading h2{font-size:clamp(40px,5.4vw,64px);letter-spacing:-.025em}.story-heading p{margin:10px auto 0;max-width:650px}.story-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;position:relative}.story-beat{position:relative;min-height:355px;overflow:hidden;padding:15px 19px 20px;border:1px solid #ffffffc9;border-radius:23px;text-align:left;color:#27384a;background:linear-gradient(148deg,#ffffffed,#f6f9fdeb 68%,#eaf1f9);box-shadow:0 18px 45px #304c6c12,inset 0 1px #fff;cursor:pointer;transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease;opacity:0;transform:translateY(22px)}.story-beat:before{content:'';position:absolute;width:150px;height:150px;right:-70px;top:-75px;border-radius:50%;background:radial-gradient(circle,#acc8e75c,transparent 68%);transition:transform .6s ease}.story-beat:hover{transform:translateY(-7px);box-shadow:0 25px 55px #304c6c20,inset 0 1px #fff;border-color:#fff}.story-beat:hover:before{transform:scale(1.55)}.story-beat:focus-visible{outline:3px solid #386ca5;outline-offset:4px}.story-beat .story-topline{display:flex;align-items:center;gap:11px;position:relative;z-index:1}.story-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:12px;color:#315f8c;background:linear-gradient(145deg,#e8f1fb,#d7e5f4);box-shadow:inset 0 1px #fff,0 6px 14px #315f8c13}.story-index{font-size:10px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#54718f}.story-beat h3{position:relative;z-index:1;font:400 27px/1.05 'Instrument Serif',Georgia,serif;color:#23364a;margin:15px 0 8px}.story-beat p{position:relative;z-index:1;margin:0;color:#46586a;font-size:12px;line-height:1.65;max-width:310px}.story-more{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;margin-top:14px;color:#315f8c;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.story-art{height:122px;position:relative;overflow:hidden;border-radius:16px;margin-bottom:18px;isolation:isolate}.sky-art{background:linear-gradient(180deg,#dceafa 0%,#eff4fa 56%,#c3d8ee 100%)}.sky-art:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 49.8%,#fff7 50%,transparent 50.2%);opacity:.7}.sky-sun{position:absolute;width:48px;height:48px;left:50%;top:47%;translate:-50% -50%;border-radius:50%;background:radial-gradient(circle at 36% 32%,#fff,#e8effa 56%,#9dbbe0);box-shadow:0 0 0 9px #ffffff45,0 0 38px 15px #a6c3e755;animation:sun-rise 5s ease-in-out infinite alternate}.sky-orbit{position:absolute;left:50%;top:48%;width:175px;height:54px;border:1px solid #597ca144;border-radius:50%;transform:translate(-50%,-50%) rotate(-13deg)}.sky-orbit.orbit-two{width:225px;height:74px;transform:translate(-50%,-50%) rotate(12deg);border-color:#fff9}.sky-star{position:absolute;left:calc(50% + 78px);top:18px;color:#315f8c;font-size:17px;animation:star-pulse 2s ease-in-out infinite}.sky-horizon{position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(180deg,transparent,#7898b524)}@keyframes sun-rise{from{top:58%;scale:.86}to{top:39%;scale:1.08}}@keyframes star-pulse{50%{opacity:.35;transform:scale(.7) rotate(35deg)}}.memory-art{display:grid;place-items:center;background:linear-gradient(145deg,#e9eff6,#d5e4f2)}.memory-art:before,.memory-art:after{content:'';position:absolute;width:100px;height:72px;border-radius:5px;background:#fff;box-shadow:0 8px 18px #2945621a}.memory-art:before{transform:translate(-25px,4px) rotate(-10deg);animation:memory-back 4.5s ease-in-out infinite alternate}.memory-art:after{transform:translate(20px,-3px) rotate(8deg);animation:memory-front 4.5s ease-in-out infinite alternate}.memory-frame{position:relative;z-index:1;width:106px;height:78px;padding:6px 6px 16px;background:#fff;border-radius:4px;box-shadow:0 10px 24px #29456230;transform:rotate(-2deg);animation:memory-float 4s ease-in-out infinite}.memory-frame:before{content:'';display:block;width:100%;height:100%;background:radial-gradient(circle at 70% 33%,#fff9 0 3px,transparent 4px),linear-gradient(145deg,transparent 46%,#7996b8 47% 49%,transparent 50%),linear-gradient(35deg,#a9c3dc 0 38%,#d9e7f3 39% 58%,#7898b8 59%);border-radius:2px}.memory-frame:after{content:'little things';position:absolute;bottom:2px;left:0;right:0;text-align:center;color:#506984;font:italic 10px 'Instrument Serif',Georgia,serif}@keyframes memory-back{to{transform:translate(-42px,0) rotate(-15deg)}}@keyframes memory-front{to{transform:translate(36px,-5px) rotate(13deg)}}@keyframes memory-float{50%{transform:translateY(-4px) rotate(1deg)}}.film-art{display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#203953,#3e5d7d);box-shadow:inset 0 0 45px #11253e55}.film-strip{display:flex;gap:5px;padding:15px 0;width:130%;transform:rotate(-7deg);background:repeating-linear-gradient(90deg,#e3edf7 0 10px,transparent 10px 19px) top left/100% 5px no-repeat,repeating-linear-gradient(90deg,#e3edf7 0 10px,transparent 10px 19px) bottom left/100% 5px no-repeat;animation:film-roll 9s linear infinite}.film-cell{flex:0 0 69px;height:52px;border:3px solid #d8e4f0;background:linear-gradient(145deg,#a9bfd6,#526f90 58%,#233e5d);position:relative;overflow:hidden}.film-cell:nth-child(2n){background:linear-gradient(35deg,#6a87a5,#d6e2ed 48%,#748da8)}.film-cell:after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,#fff7 50%,transparent 67%);transform:translateX(-120%);animation:film-glint 3.8s ease-in-out infinite}.film-cell:nth-child(2):after{animation-delay:1.2s}.film-cell:nth-child(3):after{animation-delay:2.4s}@keyframes film-roll{to{translate:-30px 0}}@keyframes film-glint{45%,100%{transform:translateX(120%)}}.reveal-chapter.in-view .story-beat{animation:story-arrive .75s cubic-bezier(.2,.75,.25,1) both}.reveal-chapter.in-view .story-beat:nth-child(2){animation-delay:.16s}.reveal-chapter.in-view .story-beat:nth-child(3){animation-delay:.32s}@keyframes story-arrive{to{opacity:1;transform:translateY(0)}}
      .letter{background:#f7f6f2}.letter-card{max-width:760px;margin:auto;background:linear-gradient(145deg,#fff,#fdfcf9);border:1px solid #d5dce4;border-radius:24px;padding:clamp(26px,6vw,55px);box-shadow:0 20px 65px #463e3210;position:relative}.letter-card:before{content:'“';font:100px 'Instrument Serif',Georgia,serif;color:#b8cbe0;position:absolute;right:28px;top:8px;pointer-events:none}.letter-card h2{font:400 46px 'Instrument Serif',Georgia,serif;margin:0 0 18px}.letter-card p{font:20px/1.7 'Instrument Serif',Georgia,serif;color:#384650;min-height:70px}.notes-list{margin:12px 0 18px}.note-snippet{display:grid;grid-template-columns:32px 1fr;gap:12px;align-items:start;padding:12px 0;border-bottom:1px solid #dce1e6}.note-snippet>span{padding-top:3px;font-size:11px;letter-spacing:.12em;color:#496786}.letter-card .note-snippet p{min-height:0;margin:0;font:19px/1.5 'Instrument Serif',Georgia,serif;color:#384650}.letter-card p.signoff{min-height:0;margin:18px 0 0;font:15px/1.65 'Manrope',sans-serif;color:#384650}
      .letter.reveal-chapter{background:radial-gradient(ellipse at 50% 15%,#15253e 0%,#0a1120 70%,#050811 100%);min-height:100svh;height:auto;padding:clamp(40px,7vh,80px) 20px;overflow-y:auto;display:flex;align-items:center;justify-content:center}
      .finale-wrap{width:min(100%,680px);margin:0 auto;position:relative;z-index:2}
      .finale-box{background:rgba(15,23,42,0.78);border:1px solid rgba(255,255,255,0.14);border-radius:28px;padding:clamp(22px,4vw,34px) clamp(18px,4vw,30px);backdrop-filter:blur(24px);box-shadow:0 30px 70px -15px rgba(0,0,0,0.6),0 0 40px rgba(56,189,248,0.08);position:relative;overflow:hidden;color:#f8fafc}
      .finale-nav{display:flex;gap:6px;background:rgba(0,0,0,0.4);padding:5px;border-radius:99px;border:1px solid rgba(255,255,255,0.08);margin-bottom:22px}
      .finale-pill{flex:1;text-align:center;padding:9px 12px;border-radius:99px;font-size:12px;font-weight:600;color:#94a3b8;border:none;background:transparent;cursor:pointer;transition:all .25s ease}
      .finale-pill:hover{color:#e2e8f0}
      .finale-pill.active{background:#38bdf8;color:#090d16;box-shadow:0 4px 15px rgba(56,189,248,0.35)}
      .tab-pane{min-height:360px;display:flex;flex-direction:column;justify-content:space-between}
      .animate-fade{animation:paneFade .35s ease forwards}
      @keyframes paneFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      .letter-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
      .letter-top h2{font-family:'Instrument Serif',Georgia,serif;font-size:clamp(32px,5vw,40px);font-weight:400;margin:4px 0 0;color:#fff;line-height:1.1}
      .letter-top h2 em{color:#7dd3fc;font-style:italic}
      .notes-stack{display:flex;flex-direction:column;gap:10px}
      .note-bubble{display:flex;gap:12px;padding:12px 14px;background:rgba(30,41,59,0.45);border:1px solid rgba(255,255,255,0.07);border-radius:14px;transition:all .25s ease}
      .note-bubble:hover{background:rgba(30,41,59,0.7);border-color:rgba(56,189,248,0.3);transform:translateX(3px)}
      .note-idx{font-size:11px;font-weight:700;color:#38bdf8;background:rgba(56,189,248,0.12);padding:2px 7px;border-radius:6px;height:fit-content;flex-shrink:0}
      .note-msg{font-family:'Instrument Serif',Georgia,serif;font-size:17.5px;line-height:1.48;color:#f1f5f9;margin:0}
      .action-row{margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
      .signature-text{font-family:'Instrument Serif',Georgia,serif;font-size:19px;color:#cbd5e1}
      .signature-text strong{color:#38bdf8;font-style:italic}
      .next-btn{background:rgba(56,189,248,0.15);border:1px solid rgba(56,189,248,0.4);color:#7dd3fc;padding:9px 18px;border-radius:99px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
      .next-btn:hover{background:#38bdf8;color:#090d16}
      .voice-hero{text-align:center;padding:16px 0 10px;display:flex;flex-direction:column;align-items:center}
      .avatar-ring{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#0284c7,#38bdf8);display:grid;place-items:center;font-size:26px;font-weight:700;color:#090d16;box-shadow:0 0 0 8px rgba(56,189,248,0.15),0 0 25px rgba(56,189,248,0.4);margin-bottom:14px;transition:all .3s}
      @keyframes ringPulse{0%{box-shadow:0 0 0 0 rgba(56,189,248,0.6)}70%{box-shadow:0 0 0 16px rgba(56,189,248,0)}100%{box-shadow:0 0 0 0 rgba(56,189,248,0)}}
      .pulse-ring{animation:ringPulse 1.8s infinite}
      .voice-hero h3{font-family:'Instrument Serif',Georgia,serif;font-size:30px;font-weight:400;color:#fff;margin:0 0 4px}
      .voice-hero p{color:#94a3b8;font-size:14px;font-style:italic;font-family:'Instrument Serif',Georgia,serif;margin:0 0 16px}
      .player-wrap{background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:99px;padding:10px 18px;display:flex;align-items:center;gap:14px;width:100%}
      .play-btn{width:42px;height:42px;border-radius:50%;background:#38bdf8;color:#090d16;border:none;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 15px rgba(56,189,248,0.4);flex-shrink:0;transition:transform .15s}
      .play-btn:hover{transform:scale(1.05)}
      .bars{display:flex;align-items:center;gap:4px;flex:1;height:32px;cursor:pointer;padding:0 4px}
      .bar{width:3.5px;background:#64748b;border-radius:99px;opacity:.5;transition:height .15s,background .2s}
      .bar-filled{background:#38bdf8;opacity:.9}
      @keyframes soundBar{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1.15)}}
      .anim-bar{animation:soundBar .8s ease-in-out infinite alternate;transform-origin:center}
      .time-tag{font-size:12px;color:#94a3b8;font-variant-numeric:tabular-nums;flex-shrink:0}
      .candle-stage{text-align:center;padding:16px 0 10px;display:flex;flex-direction:column;align-items:center}
      .candle-wrap{width:60px;height:95px;position:relative;display:flex;flex-direction:column;align-items:center;margin-bottom:12px}
      .flame{width:18px;height:30px;background:radial-gradient(circle at 50% 80%,#fff,#fbbf24 60%,#f97316 100%);border-radius:50% 50% 20% 20% / 60% 60% 40% 40%;box-shadow:0 0 25px 8px rgba(251,191,36,0.6);animation:flicker 1.2s ease-in-out infinite alternate}
      .wick{width:2.5px;height:8px;background:#555}
      .candle-body{width:22px;height:52px;background:linear-gradient(to right,#93c5fd,#3b82f6);border-radius:4px;box-shadow:inset 0 -2px 5px rgba(0,0,0,0.3)}
      .wish-title{font-family:'Instrument Serif',Georgia,serif;font-size:32px;font-weight:400;margin:0 0 6px}
      .wish-sub{color:#94a3b8;font-size:14px;max-width:440px;margin:0 0 18px;line-height:1.5}
      .wish-btn{background:linear-gradient(135deg,#38bdf8,#2563eb);color:#fff;border:none;padding:13px 28px;border-radius:99px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(56,189,248,0.4);transition:all .2s;display:inline-flex;align-items:center;gap:6px}
      .wish-btn:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(56,189,248,0.5)}
      .wish-revealed{text-align:center;padding:16px 10px 10px;display:flex;flex-direction:column;align-items:center;animation:paneFade .6s ease}
      .star-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b);display:grid;place-items:center;font-size:30px;box-shadow:0 0 35px rgba(251,191,36,0.5);margin-bottom:14px;animation:starPulse 2s infinite alternate}
      @keyframes starPulse{to{transform:scale(1.08);box-shadow:0 0 50px rgba(251,191,36,0.8)}}
      .wish-revealed h3{font-family:'Instrument Serif',Georgia,serif;font-size:32px;font-weight:400;color:#fff;margin:0 0 8px}
      .wish-revealed p{color:#cbd5e1;font-size:14.5px;line-height:1.6;max-width:480px;margin:0 0 20px}
      .love-btn{background:linear-gradient(135deg,#0284c7,#38bdf8);color:#090d16;border:none;padding:12px 26px;border-radius:99px;font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(56,189,248,0.4);display:inline-flex;align-items:center;gap:8px;transition:transform .15s}
      .love-btn:hover{transform:scale(1.04)}
      .elena-badge{text-align:center;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-top:20px;font-weight:600}
      .elena-badge span{color:#38bdf8}
      .hint-sub{font-size:12px;color:#94a3b8}
      @keyframes floatPetal{0%{transform:translateY(100vh) rotate(0deg) scale(.6);opacity:0}20%{opacity:.95}80%{opacity:.85}100%{transform:translateY(-20vh) rotate(360deg) scale(1.1);opacity:0}}
      .floating-petal{position:fixed;bottom:-20px;font-size:22px;pointer-events:none;z-index:99;animation:floatPetal 4.5s cubic-bezier(.25,1,.5,1) forwards}

      .overlay{position:fixed;z-index:30;inset:0;background:#101725d9;display:grid;place-items:center;padding:22px;backdrop-filter:blur(10px)}.modal{width:min(100%,620px);background:#fffdf7;border-radius:24px;padding:32px;position:relative;box-shadow:0 30px 100px #0005}.modal h2{font:400 42px 'Instrument Serif',Georgia,serif;margin:0 42px 12px 0}.modal p{line-height:1.8;color:#33414e}.close{position:absolute;right:15px;top:15px;width:44px;height:44px;border:0;background:#f0eee8;border-radius:50%;display:grid;place-items:center;cursor:pointer}.lightbox img{max-height:78vh;max-width:88vw;object-fit:contain;border-radius:14px}.video-modal video{width:min(85vw,850px);max-height:78vh;border-radius:16px;background:#111}.lightbox .close,.video-modal .close{background:#fff;right:-8px;top:-8px}.video-sound-toggle{position:absolute;z-index:2;top:-8px;right:48px;min-height:44px;padding:0 13px;display:flex;align-items:center;gap:7px;border:0;border-radius:999px;background:#fff;color:#17253b;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px #0003}.video-sound-toggle span{white-space:nowrap}
      /* Keep the film's full-screen cards, and use downward page scrolling to advance them. */
      .film.active-page,.gallery.active-page{padding:0;background:#101725!important;color:#fff}
      .film.active-page .wrap,.gallery.active-page .wrap{width:100%;height:100%;max-width:none;position:relative}
      .film.active-page .section-head,.gallery.active-page .section-head{position:absolute;z-index:2;top:72px;left:clamp(20px,5vw,72px);margin:0;padding:16px 20px;max-width:min(600px,88vw);border-radius:16px;background:#f8f5f0ed;box-shadow:0 8px 32px #0002}
      .film.active-page .section-head h2,.gallery.active-page .section-head h2{font-size:clamp(30px,4vw,48px)}
      .film.active-page .section-head p,.gallery.active-page .section-head p{margin-bottom:0}
      .film.active-page .film-grid,.gallery.active-page .gallery-grid{position:absolute;inset:0;padding:0;gap:0;scroll-snap-type:x mandatory;scrollbar-width:none}
      .film.active-page .film-card,.gallery.active-page .memory{position:relative;flex:0 0 100vw;width:100vw;height:100%;border:0;border-radius:0;background:#101725;box-shadow:none;scroll-snap-align:start;transform:none}
      .film.active-page .film-card video,.gallery.active-page .memory img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain;background:#101725}
      .film.active-page .film-label,.gallery.active-page .memory span{position:absolute;z-index:1;bottom:28px;left:50%;transform:translateX(-50%);color:white;background:#101725b8;border-radius:99px;padding:12px 18px;white-space:nowrap;text-shadow:0 1px 8px #000}
      .film.reveal-chapter{z-index:1;background-color:#f5f1e8}.bouquet.reveal-chapter{z-index:2;background-color:#eef2f6}.gallery.reveal-chapter{z-index:3;background-color:#f7f4ec}.dreams.reveal-chapter{z-index:4;background-color:#edf1f4}.letter.reveal-chapter{z-index:5;background-color:#f7f4ec}.footer.reveal-chapter{z-index:6}
      .reveal-chapter{position:sticky;top:0;height:100svh;min-height:600px;max-height:100svh;display:flex;align-items:center;justify-content:center;transform-origin:left center;backface-visibility:hidden;perspective:1600px;overflow:hidden;background-image:linear-gradient(90deg,#33445d18 0,transparent 3.5%,transparent 100%);border-left:1px solid #d9d5cb;box-shadow:0 18px 55px #18253720;opacity:0;transition:opacity .7s ease,transform .9s cubic-bezier(.2,.75,.25,1)}
      .reveal-chapter .wrap{max-height:100%;overflow:visible}
      .reveal-chapter.in-view .section-head,.reveal-chapter.in-view .film-card,.reveal-chapter.in-view .bouquet-art,.reveal-chapter.in-view .bouquet-copy,.reveal-chapter.in-view .memory,.reveal-chapter.in-view .dream,.reveal-chapter.in-view .letter-card,.reveal-chapter.in-view>div{opacity:1;transform:translateY(0) scale(1);transition:opacity .75s ease,transform .8s cubic-bezier(.2,.75,.25,1)}
      .reveal-chapter.waiting-page{opacity:0;transform:perspective(1600px) rotateY(14deg) translateX(52px) scale(.97);pointer-events:none}
      .reveal-chapter.active-page{opacity:1;transform:perspective(1600px) rotateY(0) translateX(0) scale(1);pointer-events:auto}
      .reveal-chapter.turned-page{opacity:0;transform:perspective(1600px) rotateY(-16deg) translateX(-42px) scale(.97);pointer-events:none}
      .reveal-chapter:not(.in-view) .section-head,.reveal-chapter:not(.in-view) .film-card,.reveal-chapter:not(.in-view) .bouquet-art,.reveal-chapter:not(.in-view) .bouquet-copy,.reveal-chapter:not(.in-view) .memory,.reveal-chapter:not(.in-view) .dream,.reveal-chapter:not(.in-view) .letter-card,.reveal-chapter:not(.in-view)>div{opacity:0;transform:translateY(42px) scale(.97)}
      .film.active-page .film-card:nth-child(2){transition-delay:.08s}.film.active-page .film-card:nth-child(3){transition-delay:.16s}.film.active-page .film-card:nth-child(4){transition-delay:.24s}.gallery.active-page .memory:nth-child(2){transition-delay:.1s}.gallery.active-page .memory:nth-child(3){transition-delay:.2s}.gallery.active-page .memory:nth-child(4){transition-delay:.3s}.dreams.active-page .dream:nth-child(2){transition-delay:.12s}.dreams.active-page .dream:nth-child(3){transition-delay:.24s}
      /* The film and photo chapters span one viewport per item; each pinned canvas advances as the page scrolls down. */
      .film.reveal-chapter{position:relative;top:auto;height:calc(100svh * var(--clip-count));min-height:calc(100svh * var(--clip-count));max-height:none;display:block;overflow:visible;transform:none!important;perspective:none;backface-visibility:visible;opacity:1;border:0;box-shadow:none;background-image:none}
      .film.reveal-chapter.waiting-page,.film.reveal-chapter.turned-page{opacity:1;pointer-events:auto}
      .film.reveal-chapter .wrap{position:sticky;top:0;width:100%;height:100svh;max-height:none;overflow:hidden;margin:0;padding:0}
      .film.reveal-chapter .section-head{position:absolute;z-index:2;top:72px;left:clamp(20px,5vw,72px);margin:0;padding:16px 20px;max-width:min(600px,88vw);border-radius:16px;background:#f8f5f0ed;box-shadow:0 8px 32px #0002}
      .film.reveal-chapter .section-head p{margin-bottom:0}
      .film.reveal-chapter .film-grid{position:absolute;inset:0;display:flex;gap:0;padding:0;overflow:visible;scroll-snap-type:none;transform:translateX(0);will-change:transform}
      .film.reveal-chapter .film-card{position:relative;flex:0 0 100vw;width:100vw;height:100%;border:0;border-radius:0;background:#101725;box-shadow:none;scroll-snap-align:none;transform:none}
      .film.reveal-chapter .film-card video{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain;background:#101725}
      .film.reveal-chapter .film-label{position:absolute;z-index:1;bottom:28px;left:50%;transform:translateX(-50%);color:#fff;background:#101725b8;border-radius:99px;padding:12px 18px;white-space:nowrap;text-shadow:0 1px 8px #000}
      .gallery.reveal-chapter{position:relative;top:auto;height:calc(100svh * var(--photo-count));min-height:calc(100svh * var(--photo-count));max-height:none;display:block;overflow:visible;transform:none!important;perspective:none;backface-visibility:visible;opacity:1;border:0;box-shadow:none;background-image:none}
      .gallery.reveal-chapter.waiting-page,.gallery.reveal-chapter.turned-page{opacity:1;pointer-events:auto}
      .gallery.reveal-chapter .wrap{position:sticky;top:0;width:100%;height:100svh;max-height:none;overflow:hidden;margin:0;padding:0}
      .gallery.reveal-chapter .section-head{position:absolute;z-index:2;top:72px;left:clamp(20px,5vw,72px);margin:0;padding:16px 20px;max-width:min(600px,88vw);border-radius:16px;background:#f8f5f0ed;box-shadow:0 8px 32px #0002}
      .gallery.reveal-chapter .section-head p{margin-bottom:0}
      .gallery.reveal-chapter .gallery-count{display:none}
      .gallery.reveal-chapter .gallery-grid{position:absolute;inset:0;display:flex;gap:0;padding:0;overflow:visible;scroll-snap-type:none;transform:translateX(0);will-change:transform}
      .gallery.reveal-chapter .memory{position:relative;flex:0 0 100vw;width:100vw;height:100%;border:0;border-radius:0;background:#101725;box-shadow:none;scroll-snap-align:none;transform:none}
      .gallery.reveal-chapter .memory img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain;background:#101725}
      .gallery.reveal-chapter .memory span{position:absolute;z-index:1;bottom:28px;left:50%;transform:translateX(-50%);color:#fff;background:#101725b8;border-radius:99px;padding:12px 18px;white-space:nowrap;text-shadow:0 1px 8px #000}
      @media(max-width:760px){.top{top:9px;padding:8px 10px 8px 15px}.top a{display:none}.top button{padding:10px 14px}.film-grid{max-height:none}.film-card{flex-basis:76vw}.film-card video{height:150px}.gallery-grid{display:flex}.memory{flex-basis:76vw}.memory img{height:155px}.bouquet-grid{grid-template-columns:1fr;gap:12px}.bouquet-art{min-height:160px}.bloom svg{width:105px;height:135px}.section-head{margin-bottom:14px}.section-head h2{font-size:35px}section{padding:72px 20px}}
      @media(max-width:760px){.film.reveal-chapter .section-head,.gallery.reveal-chapter .section-head{top:70px;left:16px}.film.reveal-chapter .film-card,.gallery.reveal-chapter .memory{height:100%}}
      .footer{background:#e5edf6;color:#202b35}.footer.reveal-chapter{flex-direction:column;gap:8px;padding:55px 22px 38px}.footer h2{margin:8px 0;font-size:clamp(32px,5vw,48px)}.footer p{color:#33414e;margin:0 0 10px}.footer-icons{display:flex;justify-content:center;align-items:center;gap:18px;color:#315f9c}.modal p{color:#33414e}
      @media(max-width:760px){.bouquet-grid{gap:14px}.bouquet-art{min-height:155px}.bouquet-copy{font-size:14px;line-height:1.55}.bouquet-copy h2{font-size:38px}.dreams.reveal-chapter{padding:16px}.dreams.reveal-chapter .wrap{width:100%}.story-heading{margin-bottom:8px;text-align:left}.story-heading h2{font-size:clamp(33px,8.5vw,42px);margin:6px 0}.story-heading p{font-size:11px;line-height:1.45;margin:6px 0 0}.story-grid{grid-template-columns:1fr;gap:7px}.story-beat{min-height:0;padding:8px 10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;column-gap:9px;align-items:center}.story-art{grid-column:1 / -1;height:54px;margin-bottom:2px;border-radius:11px}.story-topline{display:contents!important}.story-icon{grid-row:2 / span 3;width:30px;height:30px;border-radius:10px}.story-icon svg{width:17px;height:17px}.story-index{font-size:8px;align-self:end}.story-beat h3{font-size:19px;margin:1px 0}.story-beat p{font-size:9px;line-height:1.3;max-width:none}.story-more{display:none}.letter-card{max-height:calc(100svh - 36px);overflow:auto;padding:24px}.letter-card h2{font-size:38px;margin-bottom:10px}.letter-card .note-snippet{padding:9px 0}.letter-card .note-snippet p{font-size:17px}.letter-card p.signoff{margin-top:12px;font-size:13px}}
      @media(max-width:760px){.top{justify-content:center;gap:8px;padding:8px 10px}.brand{display:none}.top a{display:inline-block;margin:0 4px;font-size:10px}.top button{padding:8px 10px;font-size:10px;white-space:nowrap}}
      /* Three scroll-led scenes replace the old tappable story cards. */
      .dreams.reveal-chapter{position:relative;top:auto;height:300svh;min-height:300svh;max-height:none;display:block;overflow:visible;transform:none!important;perspective:none;backface-visibility:visible;opacity:1;border:0;box-shadow:none;background-image:none;padding:0}
      .dreams.reveal-chapter.waiting-page,.dreams.reveal-chapter.turned-page{opacity:1;pointer-events:auto}
      .dream-story-stage{position:sticky;top:0;height:100svh;overflow:hidden;background:linear-gradient(140deg,#e8eff7,#f5f5f0 55%,#dce8f4)}
      .dream-story-track{position:absolute;inset:0;display:flex;flex-direction:column;height:300svh;will-change:transform}
      .dream-scene{position:relative;flex:0 0 100svh;height:100svh;min-height:0;padding:clamp(76px,10vh,110px) clamp(24px,7vw,100px) 34px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:clamp(30px,6vw,88px);align-items:center;overflow:hidden}
      .dream-scene:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.38;background:radial-gradient(ellipse at 15% 80%,#ffffffc7,transparent 42%)}
      .dream-scene:nth-child(2){background:linear-gradient(135deg,#f1eee7,#e8edf2 55%,#d6e4f0)}.dream-scene:nth-child(3){background:linear-gradient(135deg,#172a40,#253e59 56%,#39516d)}
      .dream-visual{height:min(65vh,570px);min-height:330px;width:100%;position:relative;overflow:hidden;border-radius:30px;isolation:isolate;box-shadow:0 28px 70px #263d591e;opacity:.35;transform:scale(.94);transition:opacity .8s ease,transform 1s cubic-bezier(.2,.75,.25,1)}
      .dream-scene.is-current .dream-visual{opacity:1;transform:scale(1)}
      .dream-copy{position:relative;z-index:1;max-width:540px;opacity:.28;transform:translateY(24px);transition:opacity .7s ease,transform .8s cubic-bezier(.2,.75,.25,1)}
      .dream-scene.is-current .dream-copy{opacity:1;transform:translateY(0)}
      .scene-kicker{display:flex;align-items:center;gap:8px;margin-bottom:22px;color:#54718f;font-size:10px;font-weight:700;letter-spacing:.15em;line-height:1.5;text-transform:uppercase}.scene-kicker span{display:grid;place-items:center;width:31px;height:31px;flex:0 0 31px;border:1px solid #6e8cac55;border-radius:50%;font:400 14px 'Instrument Serif',Georgia,serif;letter-spacing:0}
      .dream-copy h2{margin:0 0 19px;color:#223449;font:400 clamp(42px,5.1vw,68px)/.98 'Instrument Serif',Georgia,serif;letter-spacing:-.025em}.dream-copy p{max-width:500px;margin:0 0 13px;color:#405265;font-size:14px;line-height:1.8}.story-cue,.story-ending{display:flex;align-items:center;gap:9px;margin-top:28px;color:#54718f;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}.story-cue svg{animation:cue-down 1.3s ease-in-out infinite}@keyframes cue-down{50%{transform:translateY(5px)}}.story-ending{font:italic 21px 'Instrument Serif',Georgia,serif;letter-spacing:0;text-transform:none;color:#d6e3f0}
      .sky-visual{background:linear-gradient(180deg,#8daed1 0%,#d6e3f0 45%,#f4e6d1 100%)}.sky-visual:before{content:'';position:absolute;left:-12%;right:-12%;bottom:-11%;height:38%;border-radius:50% 50% 0 0;background:linear-gradient(180deg,#adbdc4,#718991);box-shadow:0 -32px 70px #fff5}
      .sky-sunrise{position:absolute;z-index:-1;width:155px;height:155px;left:50%;top:64%;border-radius:50%;background:radial-gradient(circle,#fffce9 0 35%,#fff4d499 52%,transparent 72%);filter:blur(2px);transform:translate(-50%,-50%);animation:sun-breathe 6s ease-in-out infinite alternate}@keyframes sun-breathe{to{top:58%;scale:1.2}}
      .sky-cloud{position:absolute;width:210px;height:30px;top:31%;left:-240px;border-radius:50%;background:#ffffff78;filter:blur(8px);animation:cloud-drift 24s linear infinite}.cloud-two{top:48%;width:165px;animation-duration:32s;animation-delay:-12s;opacity:.65}@keyframes cloud-drift{to{left:calc(100% + 250px)}}
      .sky-horizon{position:absolute;left:0;right:0;bottom:21%;height:1px;background:linear-gradient(90deg,transparent,#fff9,transparent);box-shadow:0 0 25px 8px #fff5}.sky-trail{position:absolute;inset:8% 6% 12%;width:88%;height:80%;overflow:visible}.sky-trail path{fill:none;stroke:#fffbd8d9;stroke-width:2;stroke-dasharray:7 11;stroke-linecap:round;filter:drop-shadow(0 0 5px #fff);animation:trail-draw 5s ease-in-out infinite alternate}@keyframes trail-draw{from{stroke-dashoffset:150}to{stroke-dashoffset:0}}.sky-star{position:absolute;top:21%;right:23%;color:#fff8d8;font-size:25px;filter:drop-shadow(0 0 12px #fff);animation:star-glow 2.6s ease-in-out infinite alternate}@keyframes star-glow{to{opacity:.45;transform:scale(.72)}}
      .visual-label{position:absolute;left:22px;bottom:20px;z-index:2;color:#fff;font-size:9px;font-weight:700;letter-spacing:.2em;text-shadow:0 1px 9px #192e4470}
      .memory-visual{background:linear-gradient(145deg,#e4d7c4,#f1e9dd 47%,#b8c9d6)}.memory-visual:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 48%,#fff9,transparent 52%),linear-gradient(0deg,#32485b24,transparent 45%)}.memory-light{position:absolute;width:300px;height:300px;left:50%;top:48%;border-radius:50%;background:#fff8;filter:blur(45px);transform:translate(-50%,-50%);animation:memory-light 5s ease-in-out infinite alternate}@keyframes memory-light{to{transform:translate(-50%,-50%) scale(1.28);opacity:.6}}
      .memory-polaroids{position:absolute;inset:0;display:grid;place-items:center}.memory-polaroid{position:absolute;width:clamp(155px,19vw,220px);height:clamp(205px,27vw,285px);margin:0;padding:10px 10px 39px;border-radius:4px;background:#fffdf7;box-shadow:0 22px 48px #233b5440;transition:transform 1s cubic-bezier(.2,.75,.25,1)}.memory-polaroid img{width:100%;height:100%;object-fit:cover;display:block;background:#d9e1e8}.memory-polaroid figcaption{position:absolute;left:6px;right:6px;bottom:11px;text-align:center;color:#5b6570;font:italic 17px 'Instrument Serif',Georgia,serif}.memory-1{transform:translate(-18px,8px) rotate(-13deg)}.memory-2{transform:translate(16px,0) rotate(9deg)}.memory-3{transform:translate(0,16px) rotate(1deg)}.is-current .memory-1{animation:memory-one 5s ease-in-out infinite alternate}.is-current .memory-2{animation:memory-two 5.5s ease-in-out infinite alternate}.is-current .memory-3{animation:memory-three 4.6s ease-in-out infinite alternate}@keyframes memory-one{to{transform:translate(-76px,5px) rotate(-20deg)}}@keyframes memory-two{to{transform:translate(72px,-10px) rotate(16deg)}}@keyframes memory-three{to{transform:translate(0,-12px) rotate(-2deg)}}
      .film-visual{background:radial-gradient(ellipse at 55% 44%,#627c96,#263c54 55%,#122338);box-shadow:0 30px 75px #16283c55}.projector-glow{position:absolute;left:50%;top:43%;width:65%;height:60%;border-radius:50%;background:#edc88a32;filter:blur(34px);transform:translate(-50%,-50%);animation:projector-pulse 3s ease-in-out infinite alternate}@keyframes projector-pulse{to{opacity:.5;scale:1.15}}
      .sky-visual{display:block;background:linear-gradient(145deg,#9cb6ce,#d6e1e9 55%,#71879b)}.sky-visual:before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,#152c4430,transparent 50%,#172c4440);opacity:1}.fighter-pair{position:absolute;inset:18px 18px 55px;display:grid;grid-template-columns:1.1fr .9fr;gap:13px}.jet-photo{position:relative;min-width:0;overflow:hidden;margin:0;border:1px solid #fff7;border-radius:18px;background:#324960;box-shadow:0 20px 42px #152b4160}.jet-photo img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.83) contrast(1.03)}.jet-f22 img{object-position:54% center}.jet-f35 img{object-position:52% center}.jet-photo figcaption{position:absolute;inset:auto 0 0;padding:35px 14px 14px;display:flex;flex-direction:column;gap:3px;color:white;background:linear-gradient(transparent,#102237e8)}.jet-photo figcaption strong{font-size:12px;letter-spacing:.13em}.jet-photo figcaption span{font-size:9px;letter-spacing:.06em;color:#d4e0eb}.jet-f22{animation:jet-reveal .9s .1s both}.jet-f35{animation:jet-reveal .9s .28s both}@keyframes jet-reveal{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      .reel{position:absolute;top:14%;width:75px;height:75px;border:8px solid #c5d0da;border-radius:50%;box-shadow:inset 0 0 0 7px #536b83,0 0 25px #fff2;animation:reel-turn 10s linear infinite}.reel:before,.reel:after{content:'';position:absolute;width:13px;height:13px;left:50%;top:50%;border:3px solid #d5dce2;border-radius:50%;transform:translate(-50%,-50%)}.reel:after{transform:translate(-50%,-50%) rotate(60deg) translateY(21px)}.reel-one{left:28%}.reel-two{right:28%;animation-direction:reverse}@keyframes reel-turn{to{rotate:360deg}}
      .story-filmstrip{position:absolute;left:-10%;right:-10%;top:52%;display:flex;gap:8px;padding:14px 0;border-top:7px dashed #d9e1e8;border-bottom:7px dashed #d9e1e8;transform:rotate(-8deg);animation:film-glide 12s linear infinite}.story-filmstrip span{height:83px;flex:0 0 22%;border:4px solid #bdc9d5;background:linear-gradient(140deg,#d6b989,#647d93 53%,#293e56);box-shadow:inset 0 0 22px #14263b55}.story-filmstrip span:nth-child(2n){background:linear-gradient(30deg,#34495e,#aebdca 48%,#7f6c59)}@keyframes film-glide{to{translate:-62px 0}}.film-play{position:absolute;left:50%;top:53%;display:grid;place-items:center;width:58px;height:58px;border:1px solid #fff9;border-radius:50%;color:#fff8e8;background:#1b3048b8;box-shadow:0 0 0 12px #fff1,0 0 38px #edc88a55;transform:translate(-50%,-50%);animation:play-pulse 2.4s ease-in-out infinite alternate}@keyframes play-pulse{to{box-shadow:0 0 0 19px #fff0,0 0 50px #edc88a88}}
      .movie-poster{position:relative;z-index:1;height:min(86%,450px);aspect-ratio:294/306;max-width:78%;margin:auto;padding:10px 10px 27px;background:#f4eee3;box-shadow:0 24px 55px #07152699;transform:rotate(-1.5deg)}.movie-poster img{display:block;width:100%;height:100%;object-fit:contain;background:#fff}.movie-poster figcaption{position:absolute;left:0;right:0;bottom:7px;text-align:center;color:#455262;font:italic 14px 'Instrument Serif',Georgia,serif}.movie-song-player{position:absolute;z-index:2;inset:7% 5%;width:90%;height:86%;border:0;border-radius:16px;background:#0b1725;box-shadow:0 24px 55px #07152699}.song-control{display:inline-flex;align-items:center;gap:9px;margin-top:8px;padding:10px 15px;border:1px solid #536c85;border-radius:99px;background:#243c56;color:#fff;cursor:pointer;box-shadow:0 8px 20px #11233824;transition:transform .2s,background .2s}.song-control:hover{transform:translateY(-2px);background:#304f70}.song-control svg{width:14px;height:14px}.film-scene .dream-copy h2,.film-scene .dream-copy p{color:#eef3f7}.film-scene .scene-kicker{color:#cad9e7}.film-scene .scene-kicker span{border-color:#a8bfd455}
      @media(max-width:760px){.dreams.reveal-chapter{height:300svh;min-height:300svh;padding:0}.dream-story-stage{height:100svh}.dream-scene{padding:76px 20px 26px;grid-template-columns:1fr;grid-template-rows:minmax(190px,35svh) 1fr;gap:18px;align-content:center}.dream-visual{height:100%;min-height:0;max-height:285px;border-radius:22px}.dream-copy{max-width:none;align-self:start}.scene-kicker{font-size:8px;margin-bottom:12px}.scene-kicker span{width:27px;height:27px;flex-basis:27px}.dream-copy h2{font-size:clamp(37px,10vw,48px);margin-bottom:12px}.dream-copy p{font-size:12px;line-height:1.65;margin-bottom:9px}.story-cue{margin-top:16px;font-size:8px}.story-ending{font-size:19px;margin-top:16px}.memory-polaroid{width:min(42vw,175px);height:min(53vw,225px);padding:7px 7px 31px}.memory-polaroid figcaption{font-size:14px;bottom:8px}.fighter-pair{inset:10px 10px 43px;grid-template-columns:1fr 1fr;gap:7px}.jet-photo{border-radius:12px}.jet-photo figcaption{padding:23px 7px 8px}.jet-photo figcaption strong{font-size:8px;letter-spacing:.08em}.jet-photo figcaption span{font-size:7px}.movie-poster{height:88%;max-width:70%;padding:7px 7px 22px}.movie-poster figcaption{font-size:12px;bottom:5px}.movie-song-player{inset:5% 3%;width:94%;height:90%}.song-control{padding:8px 12px;font-size:11px}.reel{width:56px;height:56px;border-width:6px}.story-filmstrip span{height:65px}}
      @media(max-height:700px) and (min-width:761px){.dream-scene{padding-top:75px;padding-bottom:22px;gap:32px}.dream-visual{height:57vh;min-height:260px}.dream-copy h2{font-size:clamp(38px,4.4vw,56px)}.dream-copy p{font-size:12px;line-height:1.6}.scene-kicker{margin-bottom:14px}}
      @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
      /* One continuous birthday scene: memories, note, voice, and wish together. */
      .letter.birthday-finale{height:auto;min-height:100svh;max-height:none;overflow:hidden;padding:clamp(54px,8vh,92px) clamp(20px,5vw,74px) 24px;display:block;background:radial-gradient(ellipse at 8% 18%,#483568 0%,transparent 32%),radial-gradient(ellipse at 90% 72%,#16496c 0%,transparent 36%),linear-gradient(140deg,#100d22,#121a34 55%,#0b2133);color:#f7f4ef}
      .letter.birthday-finale:before{content:'';position:absolute;inset:17px;border:1px solid #c6c4e72e;border-radius:2px 24px 2px 24px;pointer-events:none}
      .letter.birthday-finale:after{content:'✦';position:absolute;top:11%;right:12%;color:#e0c790;font:30px 'Instrument Serif',Georgia,serif;text-shadow:0 0 25px #eccd9c;animation:finale-twinkle 3.5s ease-in-out infinite alternate;pointer-events:none}
      @keyframes finale-twinkle{to{opacity:.38;transform:scale(.72) rotate(35deg)}}
      @keyframes soundBar{from{transform:scaleY(.55)}to{transform:scaleY(1.1)}}@keyframes floatPetal{0%{transform:translateY(100vh) rotate(0deg) scale(.6);opacity:0}20%{opacity:.95}80%{opacity:.85}100%{transform:translateY(-20vh) rotate(360deg) scale(1.1);opacity:0}}.floating-petal{position:fixed;bottom:-20px;font-size:22px;pointer-events:none;z-index:99;animation:floatPetal 4.5s cubic-bezier(.25,1,.5,1) forwards}
      .finale-wrap{position:relative;z-index:2;width:min(100%,1120px);max-height:none;margin:auto;display:flex;flex-direction:column;gap:clamp(22px,4vh,38px)}
      .finale-heading{position:relative;max-width:760px}.finale-heading .finale-kicker{color:#c9b4e3;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase}.finale-kicker span{padding:0 9px;color:#efcb8a}.finale-heading h2{font:400 clamp(50px,8vw,96px)/.86 'Instrument Serif',Georgia,serif;letter-spacing:-.035em;margin:13px 0 12px;color:#fff}.finale-heading h2 em{color:#d7c1ee;font-weight:400}.finale-heading p{max-width:510px;margin:0;color:#c8d2e3;font:italic clamp(16px,2vw,20px)/1.45 'Instrument Serif',Georgia,serif}.finale-heading p span{color:#f1d393}
      .finale-scene{display:grid;grid-template-columns:minmax(260px,.82fr) minmax(0,1.18fr);gap:clamp(26px,6vw,78px);align-items:center}
      .finale-portrait{height:clamp(280px,40vh,395px);position:relative;display:grid;place-items:center;isolation:isolate}.finale-portrait:before{content:'';position:absolute;width:74%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#7197bb66,transparent 70%);filter:blur(9px);z-index:-1}
      .finale-orbit{position:absolute;left:50%;top:48%;width:88%;height:54%;border:1px solid #c7d5eb29;border-radius:50%;pointer-events:none}.finale-orbit-one{transform:translate(-50%,-50%) rotate(-18deg)}.finale-orbit-two{width:70%;height:86%;transform:translate(-50%,-50%) rotate(22deg);border-color:#d7bce927}
      .finale-photo{position:absolute;width:clamp(140px,17vw,200px);height:clamp(190px,24vw,265px);margin:0;padding:8px 8px 26px;background:#f8f4eb;box-shadow:0 22px 55px #0308168c;border-radius:2px;transition:transform .6s cubic-bezier(.2,.75,.25,1)}.finale-photo img{width:100%;height:100%;display:block;object-fit:cover;background:#d5dbe4}.finale-photo-1{transform:translate(-46%,5%) rotate(-11deg)}.finale-photo-2{z-index:1;transform:translate(31%,-6%) rotate(9deg)}.finale-photo-3{z-index:2;transform:translate(-1%,2%) rotate(-1deg)}.finale-portrait:hover .finale-photo-1{transform:translate(-56%,5%) rotate(-15deg)}.finale-portrait:hover .finale-photo-2{transform:translate(42%,-9%) rotate(13deg)}.finale-portrait:hover .finale-photo-3{transform:translate(-1%,-3%) rotate(2deg)}.portrait-caption{position:absolute;z-index:3;bottom:4px;color:#d6ddea;font-size:9px;letter-spacing:.2em;text-transform:uppercase}
      .finale-letter{position:relative;padding:clamp(23px,3vw,38px) clamp(22px,3.5vw,46px);background:linear-gradient(150deg,#fffdf8,#f2eee5);color:#2d3d50;box-shadow:0 22px 70px #02071580;border-radius:2px 20px 2px 20px}.finale-letter:before{content:'';position:absolute;inset:10px;border:1px solid #74869a24;border-radius:1px 13px 1px 13px;pointer-events:none}
      .finale-letter .letter-top{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 12px}.finale-letter .finale-kicker{color:#647b99;font-size:9px;letter-spacing:.17em}.stamp{padding:6px 8px;border:1px solid #aab7c5;color:#6e7d8f;border-radius:2px;font-size:8px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}.finale-letter h3{position:relative;z-index:1;font:400 clamp(30px,4vw,42px)/1 'Instrument Serif',Georgia,serif;color:#263950;margin:0 0 9px}.finale-message{position:relative;z-index:1}.finale-message p{font:clamp(14px,1.45vw,17px)/1.5 'Instrument Serif',Georgia,serif;color:#435366;margin:0;padding:7px 0;border-bottom:1px solid #52698720}.finale-message p:last-child{border-bottom:0}.finale-signoff{position:relative;z-index:1;margin-top:12px;padding-top:11px;border-top:1px solid #52698730;color:#657285;font:italic 15px/1.3 'Instrument Serif',Georgia,serif}.finale-signoff strong{display:inline-flex;align-items:center;gap:5px;margin-top:4px;color:#3b5d84;font:italic 18px 'Instrument Serif',Georgia,serif}.finale-signoff svg{color:#55799e}
      .finale-actions{display:grid;grid-template-columns:1fr 1fr;gap:clamp(18px,4vw,52px);padding:19px 0 8px;border-top:1px solid #d4d9ea2a;border-bottom:1px solid #d4d9ea2a}.finale-voice{min-width:0}.action-kicker{display:flex;align-items:center;gap:9px;color:#d9ddea;font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin-bottom:11px}.voice-dot{width:7px;height:7px;border-radius:50%;background:#a8bfd8;box-shadow:0 0 0 4px #a8bfd826}.voice-dot.is-playing{background:#e5c98f;box-shadow:0 0 0 4px #e5c98f30}
      .letter.birthday-finale .player-wrap{display:flex;align-items:center;gap:12px;width:100%;padding:0;background:transparent;border:0}.letter.birthday-finale .play-btn{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border:1px solid #d0d9e866;border-radius:50%;background:#f7f4ef;color:#243b57;cursor:pointer;transition:transform .2s,background .2s}.letter.birthday-finale .play-btn:hover{transform:scale(1.06);background:#e4d9ed}.letter.birthday-finale .bars{height:38px;flex:1;display:flex;align-items:center;gap:3px;padding:0 2px;cursor:pointer}.letter.birthday-finale .bar{width:3px;min-height:5px;border-radius:4px;background:#a7b3c7;opacity:.7;transition:background .2s}.letter.birthday-finale .bar-filled{background:#e5c98f;opacity:1}.letter.birthday-finale .bars.is-playing .bar{animation:soundBar .75s ease-in-out infinite alternate;transform-origin:center}.letter.birthday-finale .time-tag{color:#d1d8e4;font-size:10px;font-variant-numeric:tabular-nums;white-space:nowrap}
      .finale-wish{display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:12px}.candle-illustration{width:42px;height:55px;position:relative;display:grid;justify-items:center;align-content:start;color:#f4ce8e}.candle-illustration svg{position:relative;z-index:1;filter:drop-shadow(0 0 12px #f3c9779c);animation:candle-flicker 1.3s ease-in-out infinite alternate}.candle-illustration i{position:absolute;bottom:0;width:15px;height:31px;border-radius:3px 3px 2px 2px;background:linear-gradient(90deg,#7497ba,#d6e2ed 55%,#7f9fbd);box-shadow:0 0 18px #90b3d43a}.candle-glow{position:absolute;top:1px;width:33px;height:33px;border-radius:50%;background:#f1cb8f38;filter:blur(7px)}@keyframes candle-flicker{to{transform:rotate(4deg) scale(.94)}}.wish-made .candle-illustration svg{opacity:.35;filter:none;animation:none}.wish-copy .action-kicker{margin:0 0 5px;color:#d5c6e6}.wish-copy p{margin:0;color:#cbd4e1;font:italic 15px/1.35 'Instrument Serif',Georgia,serif}.letter.birthday-finale .wish-btn{min-height:40px;padding:10px 14px;border:1px solid #e5c98f;border-radius:2px 12px 2px 12px;background:#e5c98f;color:#273951;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;cursor:pointer;transition:transform .2s,background .2s}.letter.birthday-finale .wish-btn:hover{transform:translateY(-2px);background:#f2dcae}
      .finale-footer{display:flex;justify-content:center;align-items:center;gap:10px;padding-top:3px;color:#b7c4d7;font-size:9px;letter-spacing:.15em;text-transform:uppercase}.finale-footer svg,.finale-footer span{color:#e2c68d}
      @media(max-width:760px){.letter.birthday-finale{min-height:100svh;padding:72px 20px 26px}.letter.birthday-finale:before{inset:9px;border-radius:2px 17px 2px 17px}.letter.birthday-finale:after{top:5%;right:9%;font-size:23px}.finale-wrap{gap:18px}.finale-heading h2{font-size:clamp(50px,13vw,72px)}.finale-scene{grid-template-columns:1fr;gap:15px}.finale-portrait{height:clamp(210px,56vw,280px)}.finale-photo{width:clamp(125px,38vw,170px);height:clamp(165px,50vw,220px)}.finale-actions{grid-template-columns:1fr;gap:17px;padding:15px 0}.finale-wish{grid-template-columns:45px 1fr auto}.finale-message p{font-size:15px}.finale-footer{font-size:8px;letter-spacing:.09em;flex-wrap:wrap}}
      @media(max-width:390px){.finale-wish{grid-template-columns:38px 1fr}.candle-illustration{width:36px}.finale-wish .wish-btn{grid-column:2;justify-self:start}.finale-actions{gap:13px}.finale-footer{gap:6px}}
      @media(prefers-reduced-motion:reduce){.letter.birthday-finale:after,.letter.birthday-finale .finale-photo,.letter.birthday-finale .candle-illustration svg{animation:none!important;transition:none!important}}
      /* Bright, personal birthday print layout. Flat color and real photos do the work. */
      .letter.birthday-finale{height:auto;min-height:100svh;max-height:none;overflow:visible;padding:clamp(38px,6vh,66px) clamp(20px,5vw,76px) 24px;display:block;background:#f6efdc;color:#17253b}
      .letter.birthday-finale:before{content:none}.letter.birthday-finale:after{content:none}
      .finale-wrap{position:relative;z-index:2;width:min(100%,1120px);max-height:none;margin:auto;display:flex;flex-direction:column;gap:20px}
      .finale-masthead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-top:2px solid #17253b;border-bottom:1px solid #17253b;font-size:9px;font-weight:700;letter-spacing:.13em}.finale-masthead strong{font-size:12px;letter-spacing:.16em}.finale-masthead span{color:#52627a}.finale-masthead time{padding:5px 8px;background:#f1c94b;color:#17253b}
      .finale-heading{max-width:none;position:relative;padding:6px 0 12px;border-bottom:2px solid #17253b}.finale-heading .finale-kicker{color:#3159db;font-size:10px;font-weight:800;letter-spacing:.17em;text-transform:uppercase}.finale-heading h2{font:800 clamp(52px,8.5vw,105px)/.82 'Manrope',sans-serif;letter-spacing:-.09em;margin:14px 0 13px;color:#17253b}.finale-heading h2 em{color:#3159db;font-weight:800;font-style:normal}.finale-heading p{max-width:620px;margin:0;color:#41506a;font:500 clamp(15px,1.8vw,19px)/1.45 'Manrope',sans-serif}.finale-heading p span{color:#f05b43}
      .finale-scene{display:grid;grid-template-columns:minmax(260px,.86fr) minmax(0,1.14fr);gap:clamp(22px,4vw,54px);align-items:center}.finale-portrait{height:clamp(270px,36vw,355px);position:relative;display:grid;place-items:center;isolation:isolate;background:#3159db;overflow:hidden}.finale-portrait:before{content:'19';position:absolute;right:-5px;top:-34px;color:#f1c94b;font:900 160px/.9 'Manrope',sans-serif;letter-spacing:-.12em;z-index:-1}.finale-photo{position:absolute;width:clamp(118px,14vw,164px);height:clamp(160px,18vw,210px);margin:0;padding:5px 5px 21px;background:#fffdf7;border:1px solid #17253b;box-shadow:3px 4px 0 #17253b;transition:transform .25s ease}.finale-photo img{width:100%;height:100%;display:block;object-fit:cover;background:#e2ddcf}.finale-photo-1{transform:translate(-47%,5%) rotate(-8deg)}.finale-photo-2{z-index:1;transform:translate(34%,-8%) rotate(7deg)}.finale-photo-3{z-index:2;transform:translate(-3%,4%) rotate(-1deg)}.finale-portrait:hover .finale-photo-1{transform:translate(-51%,3%) rotate(-10deg)}.finale-portrait:hover .finale-photo-2{transform:translate(39%,-11%) rotate(9deg)}.finale-portrait:hover .finale-photo-3{transform:translate(-3%,0) rotate(1deg)}.portrait-caption{position:absolute;left:12px;bottom:10px;z-index:3;padding:6px 8px;background:#f1c94b;color:#17253b;font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
      .letter.birthday-finale .finale-portrait:before{content:'19';z-index:0}.letter.birthday-finale .finale-photo-1{z-index:1}.letter.birthday-finale .finale-photo-2{z-index:2}.letter.birthday-finale .finale-photo-3{z-index:3}.letter.birthday-finale .portrait-caption{z-index:4}
      .finale-letter{position:relative;padding:clamp(19px,2.5vw,30px);background:#fffdf7;color:#26364d;border:1px solid #17253b;box-shadow:4px 4px 0 #17253b;border-radius:0}.finale-letter:before{content:none}.finale-letter .letter-top{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 12px}.finale-letter .finale-kicker{color:#3159db;font-size:9px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.stamp{padding:5px 7px;border:1px solid #17253b;color:#17253b;border-radius:0;font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}.finale-letter h3{position:relative;z-index:1;font:700 clamp(27px,3vw,36px)/1 'Manrope',sans-serif;color:#17253b;margin:0 0 9px;letter-spacing:-.06em}.finale-message{position:relative;z-index:1}.finale-message p{font:500 clamp(13px,1.3vw,15px)/1.5 'Manrope',sans-serif;color:#40506a;margin:0;padding:7px 0;border-bottom:1px solid #17253b26}.finale-message p:last-child{border-bottom:0}.finale-signoff{position:relative;z-index:1;margin-top:10px;padding-top:10px;border-top:1px solid #17253b;color:#52627a;font:500 12px/1.4 'Manrope',sans-serif}.finale-signoff strong{display:inline-flex;align-items:center;gap:5px;margin-top:3px;color:#3159db;font:800 15px 'Manrope',sans-serif}.finale-signoff svg{color:#f05b43}
      .finale-details{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid #17253b;border-bottom:1px solid #17253b}.finale-details>span{display:grid;grid-template-columns:30px 1fr;align-items:center;column-gap:7px;padding:11px 12px;border-right:1px solid #17253b;font-size:11px;font-weight:800}.finale-details>span:last-child{border-right:0}.finale-details b{grid-row:span 2;color:#3159db;font-size:10px}.finale-details small{grid-column:2;color:#6a7484;font-size:9px;font-weight:500}
      .finale-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0;border:0}.finale-voice,.finale-wish{min-width:0;min-height:104px;padding:15px 17px;background:#3159db;color:#fff}.action-kicker{display:flex;align-items:center;gap:9px;color:#fff;font-size:9px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;margin-bottom:11px}.voice-dot{width:7px;height:7px;border-radius:50%;background:#f1c94b;box-shadow:none}.voice-dot.is-playing{background:#f05b43;box-shadow:0 0 0 4px #f05b4340}
      .letter.birthday-finale .player-wrap{display:flex;align-items:center;gap:12px;width:100%;padding:0;background:transparent;border:0}.letter.birthday-finale .play-btn{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;border:1px solid #fff;border-radius:50%;background:#fff;color:#3159db;cursor:pointer;transition:transform .15s,background .15s}.letter.birthday-finale .play-btn:hover{transform:rotate(-8deg) scale(1.06);background:#f1c94b}.letter.birthday-finale .bars{height:38px;flex:1;display:flex;align-items:center;gap:3px;padding:0 2px;cursor:pointer}.letter.birthday-finale .bar{width:3px;min-height:5px;border-radius:0;background:#ffffff78;opacity:1;transition:background .2s}.letter.birthday-finale .bar-filled{background:#f1c94b}.letter.birthday-finale .bars.is-playing .bar{animation:soundBar .75s ease-in-out infinite alternate;transform-origin:center}.letter.birthday-finale .time-tag{color:#fff;font-size:10px;font-variant-numeric:tabular-nums;white-space:nowrap}
      .finale-wish{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:10px;background:#f05b43;color:#17253b}.candle-illustration{width:36px;height:48px;position:relative;display:grid;justify-items:center;align-content:start;color:#f1c94b}.candle-illustration svg{position:relative;z-index:1;animation:candle-flicker 1.3s ease-in-out infinite alternate}.candle-illustration i{position:absolute;bottom:0;width:14px;height:27px;border:1px solid #17253b;border-radius:2px 2px 0 0;background:#fff3d5}.wish-made .candle-illustration svg{opacity:.3;animation:none}.wish-copy .action-kicker{margin:0 0 5px;color:#17253b}.wish-copy p{margin:0;color:#17253b;font:600 13px/1.35 'Manrope',sans-serif}.letter.birthday-finale .wish-btn{min-height:40px;padding:9px 12px;border:1px solid #17253b;border-radius:0;background:#f1c94b;color:#17253b;font-size:9px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap;cursor:pointer;transition:transform .15s,background .15s}.letter.birthday-finale .wish-btn:hover{transform:translate(-2px,-2px);background:#ffe27d}
      .finale-footer{display:flex;justify-content:center;align-items:center;gap:8px;padding-top:0;color:#687285;font-size:8px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.finale-footer span:nth-child(2){color:#f05b43}
      @media(max-width:760px){.letter.birthday-finale{min-height:100svh;padding:72px 19px 24px}.finale-wrap{gap:16px}.finale-masthead{font-size:8px}.finale-masthead strong{font-size:11px}.finale-heading h2{font-size:clamp(53px,13vw,76px)}.finale-scene{grid-template-columns:1fr;gap:15px}.finale-portrait{height:clamp(230px,62vw,290px)}.finale-photo{width:clamp(125px,36vw,155px);height:clamp(165px,47vw,200px)}.finale-details{grid-template-columns:1fr}.finale-details>span{grid-template-columns:30px 1fr auto;border-right:0;border-bottom:1px solid #17253b;padding:8px 10px}.finale-details>span:last-child{border-bottom:0}.finale-details b{grid-row:span 1}.finale-details small{grid-column:3}.finale-actions{grid-template-columns:1fr;gap:9px}.finale-voice,.finale-wish{min-height:92px;padding:13px 14px}.finale-message p{font-size:14px}}
      @media(max-width:390px){.finale-masthead span{font-size:7px}.finale-wish{grid-template-columns:36px 1fr}.finale-wish .wish-btn{grid-column:2;justify-self:start}.finale-details small{font-size:8px}}
      @media(prefers-reduced-motion:reduce){.letter.birthday-finale:after,.letter.birthday-finale .finale-photo,.letter.birthday-finale .candle-illustration svg{animation:none!important;transition:none!important}}
      /* The opening page shares the birthday issue's bold, tactile print language. */
      .hero{min-height:100svh;height:auto;display:flex;align-items:center;justify-content:center;text-align:left;padding:126px clamp(20px,5vw,76px) 32px;background:#f6efdc;color:#17253b}
      .hero-inner{width:min(100%,1120px);max-width:1120px;position:relative;z-index:1}
      .hero-masthead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-top:2px solid #17253b;border-bottom:1px solid #17253b;font-size:9px;font-weight:700;letter-spacing:.14em}.hero-masthead strong{font-size:12px;letter-spacing:.17em}.hero-masthead span{padding:5px 8px;background:#f1c94b;letter-spacing:.1em}
      .hero-main{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(300px,.92fr);gap:clamp(25px,6vw,82px);align-items:center;padding:clamp(28px,5vh,52px) 0 25px}
      .hero-copy{max-width:690px}.hero-kicker{color:#3159db;font-size:10px;font-weight:800;letter-spacing:.17em;text-transform:uppercase}.hero-copy h1{margin:18px 0 14px;color:#17253b;font:800 clamp(56px,8.4vw,104px)/.83 'Manrope',sans-serif;letter-spacing:-.09em}.hero-copy h1 em{color:#3159db;font-style:normal;font-weight:800}.hero-copy p{max-width:530px;margin:0 0 23px;color:#41506a;font:500 clamp(16px,2vw,21px)/1.45 'Manrope',sans-serif}
      .hero-cta{display:inline-flex;align-items:center;gap:11px;min-height:48px;padding:12px 17px;border:1px solid #17253b;background:#3159db;color:white;box-shadow:3px 3px 0 #17253b;font:800 10px 'Manrope',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:transform .15s,box-shadow .15s}.hero-cta:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #17253b}.hero-cta svg{transform:rotate(-90deg)}
      .hero-art{height:clamp(300px,40vw,430px);position:relative;display:flex;align-items:center;justify-content:center;background:#3159db;border:1px solid #17253b}.hero-art-frame{position:absolute;inset:18px 22px 28px 18px;overflow:hidden;border:1px solid #17253b;background:#cad8e7;box-shadow:4px 4px 0 #17253b;transform:rotate(1.5deg)}.hero-art-frame img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 45%}.hero-art-number{position:absolute;top:-23px;right:-10px;width:75px;height:75px;display:grid;place-items:center;transform:rotate(8deg);border:1px solid #17253b;border-radius:50%;background:#f1c94b;color:#17253b;font:900 27px 'Manrope',sans-serif;letter-spacing:-.08em;box-shadow:3px 3px 0 #17253b}.hero-art-caption{position:absolute;left:8px;bottom:10px;padding:7px 10px;background:#f1c94b;color:#17253b;font-size:9px;font-weight:800;line-height:1.2;letter-spacing:.08em;text-transform:uppercase;transform:rotate(-2deg)}
      .hero-index{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid #17253b;border-bottom:1px solid #17253b}.hero-index>span{display:grid;grid-template-columns:27px 1fr;column-gap:7px;align-content:center;padding:10px 12px;border-right:1px solid #17253b;color:#667186;font-size:10px}.hero-index>span:last-child{border-right:0}.hero-index b{color:#17253b;font-size:9px;letter-spacing:.08em}.hero-index>span:first-letter{color:#3159db}.hero-index>span{line-height:1.5}
      @media(max-width:760px){.hero{min-height:100svh;padding:104px 19px 22px}.hero-masthead{font-size:8px}.hero-masthead strong{font-size:10px}.hero-main{grid-template-columns:1fr;gap:22px;padding:28px 0 19px}.hero-copy h1{font-size:clamp(58px,13vw,82px);margin:13px 0 11px}.hero-copy p{font-size:16px;margin-bottom:17px}.hero-art{height:clamp(220px,58vw,300px)}.hero-art-frame{inset:12px 17px 20px 13px}.hero-index{grid-template-columns:1fr}.hero-index>span{grid-template-columns:27px 1fr auto;align-items:center;padding:7px 5px;border-right:0;border-bottom:1px solid #17253b;font-size:9px}.hero-index>span:last-child{border-bottom:0}.hero-index b{font-size:8px}}
      @media(max-width:390px){.hero{padding-left:16px;padding-right:16px}.hero-masthead{letter-spacing:.09em}.hero-masthead strong{font-size:9px}.hero-art{height:215px}.hero-index>span{grid-template-columns:25px 1fr auto;font-size:8px}}
      .hero-index>span i{grid-row:span 2;color:#3159db;font-style:normal;font-weight:800}.hero-index>span b{grid-column:2}.hero-index>span small{grid-column:2;color:#6a7484;font-size:9px}.finale-details>span strong{grid-column:2;color:#17253b;font-size:11px}.finale-details>span b{grid-row:span 2}.finale-details>span small{grid-column:2}
      @media(max-width:760px){.hero-index>span{display:flex;gap:8px}.hero-index>span i{width:20px;flex:0 0 20px}.hero-index>span b{width:90px;flex:0 0 90px}.hero-index>span small{margin-left:auto;text-align:right}.finale-details>span{grid-template-columns:30px 1fr auto}.finale-details>span b{grid-row:span 2}.finale-details>span strong{grid-column:2}.finale-details>span small{grid-column:3}}
      @media(prefers-reduced-motion:reduce){.hero-cta,.hero-art-frame{transition:none}}
    `}</style>
    <div className="page">
      <nav className="top"><span className="brand">A NOTE FOR TANU</span><div><a href="#movie">The movie</a><a href="#roses">The roses</a><a href="#memories">Photos</a></div><button onClick={()=>document.getElementById('letter')?.scrollIntoView({behavior:'smooth'})}>Open your note</button></nav>
      <header className="hero" id="home">
        <div className="hero-inner">
          <div className="hero-masthead"><strong>THE TANU DAY ISSUE</strong><span>NOV 07 · NO. 19</span></div>
          <div className="hero-main">
            <div className="hero-copy">
              <div className="hero-kicker">Cover story · Poornima Singh Rana</div>
              <h1>Before the candles,<br/><em>your kind of story.</em></h1>
              <p>Geet on repeat. Nineteen blue roses. And the sky you’re working toward.</p>
              <button className="hero-cta" onClick={goToMovie}>{started?'Back to your memories':'Start with the memories'} <ArrowDown size={15}/></button>
            </div>
            <div className="hero-art" aria-label="A bouquet of blue roses for Tanu's 19th birthday">
              <div className="hero-art-frame"><img src="/img/blue-roses-bouquet.jpg" alt="A bouquet of vivid blue roses"/></div>
              <span className="hero-art-number">19</span>
              <span className="hero-art-caption">nineteen blue roses<br/>for nineteen</span>
            </div>
          </div>
          <div className="hero-index"><span><i>01</i><b>THE MOVIE</b><small>Jab We Met, obviously</small></span><span><i>02</i><b>THE ROSES</b><small>Blue. All nineteen.</small></span><span><i>03</i><b>THE DREAM</b><small>Keep climbing, Tanu.</small></span></div>
        </div>
      </header>
      <section className="film reveal-chapter" id="movie" style={{'--clip-count': clips.length} as React.CSSProperties}><div className="wrap"><div className="section-head"><small>Scene one · the Tanu cut</small><h2>Some moments deserve a replay.</h2><p>Scroll through each memory to hear its music.</p>{filmAudioNeedsTap&&<button className="film-sound-button" onClick={enableFilmAudio}>Tap to start the memory music</button>}</div><div className="film-grid">{clips.map((src,i)=><button className="film-card" key={src} onClick={()=>openClip(i)} aria-label={`Play memory ${i+1} with sound`}><video src={src} muted playsInline loop autoPlay preload="metadata"/><div className="film-label"><span>Memory no. {String(i+1).padStart(2,'0')}</span><span><Play size={15}/></span></div></button>)}</div></div></section>
      <section className="bouquet reveal-chapter" id="roses" data-roses-complete={roseCount >= 19}><div className="wrap bouquet-grid"><div className="bouquet-art" aria-label={`A real blue rose bouquet, ${roseCount} of 19 roses added`}><img className="bouquet-photo" src="/img/blue-roses-bouquet.jpg" alt="A bouquet of vibrant blue roses"/>{Array.from({length:roseCount},(_,i)=><span className="rose" key={i} style={{left:`${8+(i*29)%80}%`,top:`${8+(i*37)%78}%`,animationDelay:`${i*.04}s`}}><img src="/img/blue-rose-single.jpg" alt="Blue rose bloom"/></span>)}</div><div className="bouquet-copy"><div className="section-head"><small>For your birthday wish</small><h2>Blue roses,<br/>as promised.</h2></div><p>Add 19 blue roses for your 19th birthday to unlock the next chapter.</p><button className="pill" disabled={roseCount >= 19} onClick={()=>setRoseCount(n=>Math.min(19,n+1))}>{roseCount >= 19 ? 'Your bouquet is complete' : 'Add a blue rose'}{roseCount < 19&&<Sparkles size={15} style={{verticalAlign:'middle',marginLeft:6}}/>}</button><div className="rose-count" aria-live="polite">{roseCount}/19 roses added{roseCount >= 19 ? ' · the next chapter is unlocked' : ' · add roses to continue'}</div><p className="bouquet-credit">Rose photos: Creative Commons & Public Domain.</p></div></div></section>
      <section className="gallery reveal-chapter" id="memories" style={{'--photo-count': photos.length} as React.CSSProperties}><div className="wrap"><div className="section-head"><small>Scene three · the memory wall</small><h2>For the girl who says,<br/><em>“capture me as a memory.”</em></h2><p>Scroll down through every photo. Each frame takes the whole page.</p><div className="gallery-count"><Camera size={13}/> {photos.length} moments and counting</div></div><div className="gallery-grid">{photos.map((p,i)=><button className="memory" key={p.src} onClick={()=>setPhoto(i)} aria-label={`Open photo: ${p.label}`}><img src={p.src} alt={p.label} loading="lazy" decoding="async"/><span>{p.label}</span></button>)}</div></div></section>
      <section className="dreams reveal-chapter" id="dreams"><div className="dream-story-stage"><div className="dream-story-track">
        <article className="dream-scene sky-scene"><div className="dream-visual sky-visual"><div className="fighter-pair"><figure className="jet-photo jet-f22"><img src="/img/f22-raptor.jpg" alt="Two F-22 Raptor stealth fighters flying in formation" loading="lazy"/><figcaption><strong>F-22 RAPTOR</strong><span>Air superiority</span></figcaption></figure><figure className="jet-photo jet-f35"><img src="/img/f35-lightning.jpg" alt="U.S. Air Force F-35A Lightning II taking off" loading="lazy"/><figcaption><strong>F-35 LIGHTNING II</strong><span>Multirole stealth fighter</span></figcaption></figure></div><span className="visual-label">THE SKY SHE'S WORKING TOWARD</span></div><div className="dream-copy"><div className="scene-kicker"><span>01</span> · THE SKY SHE KEEPS LOOKING TOWARD</div><h2>There is a sky you keep looking toward.</h2><p>I know how much this dream means to you. You don’t need the whole map today; every lesson and every brave next step is still bringing you closer.</p><p>I hope you never make the dream smaller just because the journey takes time. Keep going at your own pace. I’ll be cheering for you.</p><div className="story-cue">SCROLL TO THE NEXT SCENE <ArrowDown size={14}/></div></div></article>
        <article className="dream-scene memory-scene"><div className="dream-visual memory-visual" aria-hidden="true"><span className="memory-light"/><div className="memory-polaroids">{photos.slice(0,3).map((p,i)=><figure className={`memory-polaroid memory-${i+1}`} key={p.src}><img src={p.src} alt="" loading="lazy"/><figcaption>{i===0?'a day to keep':i===1?'just as you are':'little things, kept close'}</figcaption></figure>)}</div><span className="visual-label">DAYS THAT BECOME STORIES</span></div><div className="dream-copy"><div className="scene-kicker"><span>02</span> · THE MOMENTS YOU CHOOSE TO KEEP</div><h2>You said, “capture me as a memory.”</h2><p>I hope you never stop asking.</p><p>One day, these little photos will bring back more than how a day looked. They’ll remind you how much you laughed, how closely you noticed everything, and how fully you were there.</p><div className="story-cue">SCROLL TO THE NEXT SCENE <ArrowDown size={14}/></div></div></article>
        <article className="dream-scene film-scene"><div className="dream-visual film-visual">{songPlaying?<iframe className="movie-song-player" src="https://www.youtube-nocookie.com/embed/mt9xg0mmt28?autoplay=1&controls=1&playsinline=1&rel=0" title="Tum Se Hi from Jab We Met, official T-Series video" allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>:<figure className="movie-poster"><img src="/img/jab-we-met-poster.jpg" alt="Jab We Met movie poster featuring Geet and Aditya"/><figcaption>Jab We Met · 2007</figcaption></figure>}<span className="visual-label">GEET & ADITYA · ONE MORE REWATCH</span></div><div className="dream-copy"><div className="scene-kicker"><span>03</span> · THE JOY YOU RETURN TO</div><h2>And then there are the stories that feel like home.</h2><p>Geet, a familiar scene, and you saying the line before she does.</p><p>Some days are for chasing the big dream. Some are for pressing play and letting yourself smile. I hope you always keep space for both. Joy belongs in the life you’re building.</p><button className="song-control" onClick={toggleSong}><Play size={15} fill="currentColor"/>{songPlaying?'Back to Geet & Aditya':'Play “Tum Se Hi”'}</button><div className="story-ending">Keep making room for all of it. The next chapter is yours.</div></div></article>
      </div></div></section>

      <section className="letter birthday-finale reveal-chapter" id="letter">
        <div className="finale-wrap">
          <div className="finale-masthead"><strong>TANU DAY</strong><span>THE 19TH BIRTHDAY ISSUE</span><time>NOV 07</time></div>
          <header className="finale-heading">
            <div className="finale-kicker">Today’s cover story</div>
            <h2>Tanu,<br/>today’s <em>all yours.</em></h2>
            <p>Geet on repeat. Blue roses in full bloom. And one more year closer to the sky you’re working toward.</p>
          </header>

          <div className="finale-scene">
            <div className="finale-portrait" aria-label="A few favorite memories">
              {photos.slice(0, 3).map((p, i) => <figure className={`finale-photo finale-photo-${i + 1}`} key={p.src}><img src={p.src} alt={p.label}/></figure>)}
              <span className="portrait-caption">camera roll favourites · 2026</span>
            </div>

            <article className="finale-letter">
              <div className="letter-top">
                <div className="finale-kicker">A note from Kunal</div>
                <span className="stamp">19 · Nov 7</span>
              </div>
              <h3>Dear Tanu,</h3>
              <div className="finale-message">{notes.map(text => <p key={text}>{text}</p>)}</div>
              <div className="finale-signoff">Always cheering for you,<br/><strong>Kunal <Heart size={14} fill="currentColor"/></strong></div>
            </article>
          </div>

          <div className="finale-details" aria-label="Birthday essentials"><span><b>01</b><strong>Jab We Met</strong><small>one more rewatch</small></span><span><b>02</b><strong>Blue roses</strong><small>nineteen of them</small></span><span><b>03</b><strong>Big skies</strong><small>keep going, Tanu</small></span></div>

          <div className="finale-actions">
            <div className="finale-voice">
              <div className="action-kicker"><span className={`voice-dot ${voicePlaying ? 'is-playing' : ''}`}/> One thing I wanted to say</div>
              <div className="player-wrap">
                <button className="play-btn" onClick={toggleVoice} aria-label={voicePlaying ? 'Pause voice note' : 'Play voice note'}>
                  {voicePlaying ? <Pause size={17} fill="currentColor"/> : <Play size={17} fill="currentColor" style={{marginLeft:2}}/>}
                </button>
                <div className={`bars ${voicePlaying ? 'is-playing' : ''}`} onClick={seekVoice} onKeyDown={e => { if (!audioRef.current || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return; e.preventDefault(); const step = e.key === 'ArrowRight' ? 5 : -5; audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 29.5, audioRef.current.currentTime + step)); setVoiceProgress(audioRef.current.currentTime); }} title="Seek voice note" role="slider" aria-label="Voice note position" aria-valuemin={0} aria-valuemax={Math.round(voiceDuration)} aria-valuenow={Math.round(voiceProgress)} tabIndex={0}>
                  {waveformBars.map((h, i) => {
                    const progressPct = voiceDuration ? voiceProgress / voiceDuration : 0;
                    return <span key={i} className={`bar ${(i / waveformBars.length) <= progressPct ? 'bar-filled' : ''}`} style={{height:`${h}px`}}/>;
                  })}
                </div>
                <span className="time-tag">{formatTime(voiceProgress)} / {formatTime(voiceDuration)}</span>
              </div>
              <audio ref={audioRef} src="/audio/kunal-voice-note.m4a" onTimeUpdate={() => audioRef.current && setVoiceProgress(audioRef.current.currentTime)} onLoadedMetadata={() => audioRef.current && setVoiceDuration(audioRef.current.duration || 29.5)} onEnded={() => setVoicePlaying(false)}/>
            </div>

            <div className={`finale-wish ${candleBlown ? 'wish-made' : ''}`}>
              <div className="candle-illustration" aria-hidden="true"><Flame size={31} strokeWidth={1.4}/><i/></div>
              <div className="wish-copy">
                <div className="action-kicker">{candleBlown ? 'Wish made' : 'Your turn'}</div>
                <p>{candleBlown ? 'Here’s to getting closer to that pilot’s seat.' : 'Take a breath. Make a wish for 19.'}</p>
              </div>
              <button className="wish-btn" onClick={candleBlown ? sendHug : blowCandle}>
                {candleBlown ? <><Heart size={15} fill="currentColor"/> Send love · {hugs}</> : 'Make a wish'}
              </button>
            </div>
          </div>

          <div className="finale-footer"><span>MADE WITH CARE</span><span>·</span><span>HAPPY 19TH, TANU</span></div>
        </div>
        {petals.map(p => <span key={p.id} className="floating-petal" style={{left:`${p.left}%`,animationDelay:`${p.delay}s`}}>{p.char}</span>)}
      </section>

      <footer className="footer reveal-chapter" id="ending"><div className="footer-icons"><Heart size={19} fill="#4779bd" color="#315f9c"/><Plane size={19}/><Clapperboard size={19}/></div><h2>Okay, one more rewatch.</h2><p>Happy birthday, Tanu. Love, Kunal.</p><button className="pill" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back to the beginning <ArrowDown size={14} style={{verticalAlign:'middle',marginLeft:6,transform:'rotate(180deg)'}}/></button></footer>
      {open&&<div className="overlay" onClick={()=>setOpen(null)}><article className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(null)} aria-label="Close"><X/></button><div className="eyebrow">A note for Tanu</div><h2>{open.title}</h2><p>{open.body}</p><button className="pill" onClick={()=>setOpen(null)}>Close note</button></article></div>}
      {photo!==null&&<div className="overlay lightbox" onClick={()=>setPhoto(null)}><div style={{position:'relative'}} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setPhoto(null)} aria-label="Close photo"><X/></button><img src={photos[photo].src} alt={photos[photo].label}/></div></div>}
      {clip!==null&&<div className="overlay video-modal" onClick={closeClip}><div style={{position:'relative'}} onClick={e=>e.stopPropagation()}><button className="close" onClick={closeClip} aria-label="Close video"><X/></button><button className="video-sound-toggle" onClick={()=>setClipMuted(muted=>!muted)} aria-label={clipMuted?'Turn sound on':'Turn sound off'} aria-pressed={!clipMuted}>{clipMuted?<VolumeX size={18}/>:<Volume2 size={18}/>}<span>{clipMuted?'Sound off':'Sound on'}</span></button><video src={clips[clip]} controls autoPlay muted={clipMuted} playsInline style={{width:'min(85vw,850px)',maxHeight:'78vh',borderRadius:16,background:'#111'}}/></div></div>}
    </div>
  </>;
}
