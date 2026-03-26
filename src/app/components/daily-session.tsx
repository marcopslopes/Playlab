import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { OutdoorBackground } from './outdoor-background';
import { InteractiveSpheresBackground } from './interactive-spheres-background';
import { useSettings } from '../contexts/settings-context';
import { useTranslation } from '../hooks/use-translation';
import { useVoice } from '../contexts/voice-context';
import { useProgress } from '../contexts/progress-context';

interface Companion {
  id: string;
  name: string;
  emoji: string;
  personality: string;
}

export function DailySession() {
  const navigate = useNavigate();
  const { theme, childName, language } = useSettings();
  const { t } = useTranslation();
  const [companion, setCompanion] = useState<Companion | null>(null);
  const { volume, speed, muted } = useVoice();
  const { progress } = useProgress();
  const hasSpoken = useRef(false);

  useEffect(() => {
    // Load companion from localStorage
    const savedCompanion = localStorage.getItem('userCompanion');
    if (savedCompanion) {
      setCompanion(JSON.parse(savedCompanion));
    }
  }, []);

  useEffect(() => {
    if (hasSpoken.current) return;
    if (muted) return;
    if (!companion) return;

    hasSpoken.current = true;

    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const companionName = companion.name;
    const companionPersonality = companion.personality;
    const stars = progress.totalStars;
    const streak = progress.streakDays;

    let blobUrl: string | null = null;

    const playGreeting = async () => {
      try {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childName, companionName, companionPersonality, language, timeOfDay, stars, streak }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('audio')) return;

        const blob = await res.blob();
        blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);
        audio.volume = volume;
        audio.playbackRate = speed;
        audio.play().catch(() => {
          // Autoplay may be blocked — silently ignore
        });
      } catch {
        // Network error — silently skip
      }
    };

    playGreeting();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [companion, muted, volume, speed, childName, language]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('daily.greetingMorning');
    if (hour < 18) return t('daily.greetingAfternoon');
    return t('daily.greetingEvening');
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Cloud blob animation
    class CloudBlob {
      x: number;
      y: number;
      baseRadius: number;
      radius: number;
      speedX: number;
      speedY: number;
      time: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * 0.6);
        this.baseRadius = 60 + Math.random() * 100;
        this.radius = this.baseRadius;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.time = Math.random() * Math.PI * 2;
        this.color = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.time += 0.01;
        this.radius = this.baseRadius + Math.sin(this.time) * 15;

        // Wrap around edges
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.y > canvas.height * 0.6 + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height * 0.6 + this.radius;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const clouds = Array.from({ length: 8 }, () => new CloudBlob());

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      clouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-body)',
      }}
    >
      <OutdoorBackground />
      <InteractiveSpheresBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-8">
        {/* Companion floating in corner */}
        {companion && (
          <div 
            className="absolute top-8 right-8 flex flex-col items-center"
            style={{
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <div 
              className="text-6xl mb-2 transition-transform hover:scale-125 cursor-pointer"
              onClick={() => {
                // Companion reacts when clicked
                const messages = [
                  t('companion.messages.0'),
                  t('companion.messages.1'),
                  t('companion.messages.2'),
                  t('companion.messages.3'),
                ];
                alert(messages[Math.floor(Math.random() * messages.length)]);
              }}
            >
              {companion.emoji}
            </div>
            <div 
              className="px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#7D9D9C',
                  textTransform: 'uppercase',
                }}
              >
                {companion.name.split(' ').slice(1).join(' ') || companion.name.split(' ')[0]}
              </p>
            </div>
          </div>
        )}
        
        <div className="w-full max-w-2xl text-center">
          {/* Welcome Message */}
          <div className="mb-12">
            <div className="text-5xl mb-4">👋</div>
            <h1 
              className="mb-3"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#1F2023',
              }}
            >
              {getGreeting()}, {childName}!
            </h1>
            <p 
              style={{ 
                fontSize: '1.125rem',
                color: '#6b7280',
                fontWeight: 400,
              }}
            >
              {t('daily.readyForPractice')}
            </p>
          </div>

          {/* Play Button */}
          <div className="mb-16">
            <button
              onClick={() => navigate('/categories')}
              className="group relative inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                width: 140,
                height: 140,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              {/* Outer glow ring */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(125, 157, 156, 0.2), transparent 70%)',
                  filter: 'blur(30px)',
                  animation: 'pulse 3s ease-in-out infinite',
                }}
              />
              
              {/* Button circle */}
              <div 
                className="relative rounded-full flex items-center justify-center transition-all"
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: '#7D9D9C',
                  boxShadow: '0 8px 32px rgba(125, 157, 156, 0.3)',
                }}
              >
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>

            <p 
              className="mt-6"
              style={{ 
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#7D9D9C',
              }}
            >
              {t('daily.startPractice')}
            </p>
          </div>

          {/* Simple Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#7D9D9C',
                  marginBottom: '0.5rem',
                }}
              >
                24
              </p>
              <p 
                style={{ 
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  fontWeight: 500,
                }}
              >
                {t('daily.starsEarned')}
              </p>
            </div>

            <div className="text-center">
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#C08B7E',
                  marginBottom: '0.5rem',
                }}
              >
                7
              </p>
              <p 
                style={{ 
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  fontWeight: 500,
                }}
              >
                {t('daily.dayStreak')}
              </p>
            </div>

            <div className="text-center">
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#7C8B95',
                  marginBottom: '0.5rem',
                }}
              >
                12
              </p>
              <p 
                style={{ 
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  fontWeight: 500,
                }}
              >
                {t('daily.completed')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Landscape Curves */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg 
          viewBox="0 0 1440 320" 
          className="w-full"
        >
          <path 
            fill="#7D9D9C" 
            fillOpacity="0.3"
            d="M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,106.7C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg 
          viewBox="0 0 1440 320" 
          className="w-full -mt-32"
        >
          <path 
            fill="#C08B7E" 
            fillOpacity="0.25"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,224C672,224,768,192,864,165.3C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg 
          viewBox="0 0 1440 200" 
          className="w-full -mt-20"
        >
          <path 
            fill="#E4DCCF" 
            fillOpacity="0.6"
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,112C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          />
        </svg>
      </div>
    </div>
  );
}