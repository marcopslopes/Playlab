import { useState, useEffect } from 'react';

interface Cloud {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
}

interface Flower {
  id: number;
  left: number;
  bottom: number;
  type: string;
  delay: number;
}

export function InteractiveOutdoorBackground() {
  const [sunPulse, setSunPulse] = useState(false);
  const [clickedClouds, setClickedClouds] = useState<Set<number>>(new Set());
  const [flowers, setFlowers] = useState<Flower[]>([]);

  // Generate flowers based on stars earned
  useEffect(() => {
    const starsEarned = parseInt(localStorage.getItem('totalStars') || '0');
    const flowerCount = Math.min(starsEarned, 50); // Max 50 flowers
    
    const flowerTypes = ['🌸', '🌼', '🌺', '🌻', '🌷', '🌹'];
    const newFlowers: Flower[] = [];
    
    for (let i = 0; i < flowerCount; i++) {
      newFlowers.push({
        id: i,
        left: Math.random() * 100,
        bottom: Math.random() * 25 + 5, // Between 5% and 30% from bottom
        type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
        delay: Math.random() * 2,
      });
    }
    
    setFlowers(newFlowers);
  }, []);

  const handleSunClick = () => {
    setSunPulse(true);
    setTimeout(() => setSunPulse(false), 1000);
  };

  const handleCloudClick = (cloudId: number) => {
    setClickedClouds(prev => new Set(prev).add(cloudId));
    setTimeout(() => {
      setClickedClouds(prev => {
        const next = new Set(prev);
        next.delete(cloudId);
        return next;
      });
    }, 1500);
  };

  const clouds: Cloud[] = [
    { id: 1, left: 10, top: 15, size: 80, duration: 40 },
    { id: 2, left: 60, top: 25, size: 60, duration: 50 },
    { id: 3, left: 35, top: 10, size: 70, duration: 45 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #E8D5B5 100%)',
        }}
      />

      {/* Sun */}
      <button
        onClick={handleSunClick}
        className="absolute pointer-events-auto cursor-pointer transition-all duration-500"
        style={{
          top: '12%',
          right: '15%',
          width: '120px',
          height: '120px',
          transform: sunPulse ? 'scale(1.3)' : 'scale(1)',
        }}
        aria-label="Tap the sun"
      >
        {/* Sun glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6), transparent 70%)',
            filter: 'blur(20px)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
        
        {/* Sun body */}
        <div 
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, #FFD700, #FFA500)',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
          }}
        >
          <span className="text-4xl">☀️</span>
        </div>
      </button>

      {/* Interactive Clouds */}
      {clouds.map((cloud) => {
        const isClicked = clickedClouds.has(cloud.id);
        
        return (
          <button
            key={cloud.id}
            onClick={() => handleCloudClick(cloud.id)}
            className="absolute pointer-events-auto cursor-pointer transition-all duration-300"
            style={{
              left: `${cloud.left}%`,
              top: `${cloud.top}%`,
              width: `${cloud.size}px`,
              height: `${cloud.size * 0.6}px`,
              animation: `float ${cloud.duration}s ease-in-out infinite`,
              animationDelay: `${cloud.id * -2}s`,
              transform: isClicked ? 'scale(1.2)' : 'scale(1)',
            }}
            aria-label={`Cloud ${cloud.id}`}
          >
            <div 
              className="relative w-full h-full transition-all duration-300"
              style={{
                filter: isClicked ? 'brightness(1.3)' : 'brightness(1)',
              }}
            >
              {/* Cloud shape */}
              <div 
                className="absolute rounded-full"
                style={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: isClicked ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                  left: '20%',
                  top: '20%',
                  boxShadow: isClicked ? '0 4px 20px rgba(255, 255, 255, 0.8)' : 'none',
                }}
              />
              <div 
                className="absolute rounded-full"
                style={{
                  width: '40%',
                  height: '50%',
                  backgroundColor: isClicked ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                  left: '0%',
                  top: '25%',
                }}
              />
              <div 
                className="absolute rounded-full"
                style={{
                  width: '50%',
                  height: '55%',
                  backgroundColor: isClicked ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                  right: '0%',
                  top: '30%',
                }}
              />
              
              {/* Happy face when clicked */}
              {isClicked && (
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                  😊
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* Rolling Hills - Layer 3 (Back) */}
      <div 
        className="absolute bottom-0 w-full"
        style={{ height: '35%' }}
      >
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path 
            fill="#7C8B95" 
            fillOpacity="0.3"
            d="M0,192L80,197.3C160,203,320,213,480,197.3C640,181,800,139,960,133.3C1120,128,1280,160,1360,176L1440,192L1440,320L0,320Z"
          />
        </svg>
      </div>

      {/* Rolling Hills - Layer 2 (Middle) */}
      <div 
        className="absolute bottom-0 w-full"
        style={{ height: '30%' }}
      >
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path 
            fill="#C08B7E" 
            fillOpacity="0.4"
            d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
          />
        </svg>
      </div>

      {/* Rolling Hills - Layer 1 (Front with grass) */}
      <div 
        className="absolute bottom-0 w-full"
        style={{ height: '25%' }}
      >
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path 
            fill="#7D9D9C" 
            fillOpacity="0.5"
            d="M0,160L80,181.3C160,203,320,245,480,245.3C640,245,800,203,960,181.3C1120,160,1280,160,1360,160L1440,160L1440,320L0,320Z"
          />
        </svg>
        
        {/* Ground */}
        <div 
          className="absolute bottom-0 w-full"
          style={{
            height: '60%',
            background: 'linear-gradient(to bottom, #E4DCCF, #D4CCBF)',
          }}
        />
        
        {/* Grass details */}
        <div className="absolute bottom-0 w-full h-8 flex items-end justify-around opacity-40">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="w-1"
              style={{
                height: `${Math.random() * 20 + 10}px`,
                backgroundColor: '#7D9D9C',
                transform: `translateX(${Math.random() * 40 - 20}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Growing Flowers */}
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute transition-all duration-1000 pointer-events-auto cursor-pointer hover:scale-125"
          style={{
            left: `${flower.left}%`,
            bottom: `${flower.bottom}%`,
            fontSize: '1.5rem',
            animation: `sway 3s ease-in-out infinite`,
            animationDelay: `${flower.delay}s`,
            opacity: 0.9,
          }}
          onClick={(e) => {
            e.currentTarget.style.transform = 'scale(1.5) rotate(20deg)';
            setTimeout(() => {
              e.currentTarget.style.transform = 'scale(1)';
            }, 500);
          }}
        >
          {flower.type}
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
