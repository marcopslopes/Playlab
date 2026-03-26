import { motion } from 'motion/react';
import { useSettings } from '../contexts/settings-context';

export function OutdoorBackground() {
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Sky Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? 'linear-gradient(to bottom, #0F1419 0%, #1A1F2E 50%, #2A2F3E 100%)'
            : 'linear-gradient(to bottom, #A8D5E2 0%, #E8DCC8 50%, #F5EFE7 100%)',
        }}
      />

      {/* Moon (dark mode) or Sun (light mode) */}
      {isDark ? (
        <>
          {/* Moon */}
          <div 
            className="absolute"
            style={{
              top: '8%',
              right: '15%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #FFF9E6 0%, #E8DCC8 60%, #C0B8A8 100%)',
              boxShadow: '0 0 80px rgba(232, 220, 200, 0.4)',
            }}
          />
          
          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 60}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div 
          className="absolute"
          style={{
            top: '8%',
            right: '15%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFF4D6 0%, #FFE8A3 40%, #FDB022 100%)',
            boxShadow: '0 0 60px rgba(253, 176, 34, 0.4)',
          }}
        />
      )}

      {/* Animated Clouds (only in light mode) */}
      {!isDark && (
        <>
          <motion.div
            className="absolute"
            style={{
              top: '12%',
              width: '200px',
              height: '80px',
            }}
            animate={{
              x: ['-200px', 'calc(100vw + 200px)'],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Cloud />
          </motion.div>

          <motion.div
            className="absolute"
            style={{
              top: '22%',
              width: '160px',
              height: '60px',
            }}
            animate={{
              x: ['-160px', 'calc(100vw + 160px)'],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
              delay: 10,
            }}
          >
            <Cloud />
          </motion.div>

          <motion.div
            className="absolute"
            style={{
              top: '18%',
              width: '140px',
              height: '50px',
            }}
            animate={{
              x: ['-140px', 'calc(100vw + 140px)'],
            }}
            transition={{
              duration: 70,
              repeat: Infinity,
              ease: 'linear',
              delay: 25,
            }}
          >
            <Cloud />
          </motion.div>
        </>
      )}

      {/* Rolling Hills - Back Layer */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ height: '45%' }}
      >
        <path
          d="M0,200 Q360,100 720,200 T1440,200 L1440,400 L0,400 Z"
          fill={isDark ? '#1A3A3A' : '#7D9D9C'}
          opacity={isDark ? '0.4' : '0.3'}
        />
      </svg>

      {/* Rolling Hills - Middle Layer */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 350"
        preserveAspectRatio="none"
        style={{ height: '40%' }}
      >
        <path
          d="M0,150 Q360,80 720,150 T1440,150 L1440,350 L0,350 Z"
          fill={isDark ? '#244545' : '#9BB5A8'}
          opacity={isDark ? '0.5' : '0.5'}
        />
      </svg>

      {/* Rolling Hills - Front Layer */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        style={{ height: '35%' }}
      >
        <path
          d="M0,120 Q360,60 720,120 T1440,120 L1440,300 L0,300 Z"
          fill={isDark ? '#3A4A5A' : '#C08B7E'}
          opacity={isDark ? '0.5' : '0.4'}
        />
      </svg>

      {/* Ground Layer */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 250"
        preserveAspectRatio="none"
        style={{ height: '28%' }}
      >
        <path
          d="M0,100 Q360,50 720,100 T1440,100 L1440,250 L0,250 Z"
          fill={isDark ? '#2A3342' : '#E4DCCF'}
          opacity={isDark ? '0.6' : '0.8'}
        />
      </svg>

      {/* Simple grass dots for detail */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-around opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '3px',
              height: `${Math.random() * 15 + 10}px`,
              backgroundColor: isDark ? '#4A6060' : '#7D9D9C',
              borderRadius: '3px',
              marginTop: `${Math.random() * 20}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Cloud() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 80" fill="none">
      <ellipse cx="50" cy="50" rx="35" ry="25" fill="white" opacity="0.8" />
      <ellipse cx="80" cy="45" rx="40" ry="28" fill="white" opacity="0.8" />
      <ellipse cx="110" cy="50" rx="35" ry="25" fill="white" opacity="0.8" />
      <ellipse cx="140" cy="55" rx="30" ry="20" fill="white" opacity="0.8" />
    </svg>
  );
}