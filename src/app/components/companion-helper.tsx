import { useState, useEffect } from 'react';

interface Companion {
  id: string;
  name: string;
  emoji: string;
  personality: string;
}

interface CompanionHelperProps {
  message?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
  autoGreet?: boolean;
}

export function CompanionHelper({ 
  message, 
  position = 'top-right',
  size = 'medium',
  autoGreet = true 
}: CompanionHelperProps) {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isWiggling, setIsWiggling] = useState(false);

  useEffect(() => {
    const savedCompanion = localStorage.getItem('userCompanion');
    if (savedCompanion) {
      setCompanion(JSON.parse(savedCompanion));
    }
  }, []);

  useEffect(() => {
    if (companion && autoGreet) {
      setTimeout(() => {
        showGreeting();
      }, 500);
    }
  }, [companion, autoGreet]);

  useEffect(() => {
    if (message) {
      showCustomMessage(message);
    }
  }, [message]);

  const showGreeting = () => {
    const greetings = [
      "Hi! I'm here with you!",
      "Let's do this together!",
      "You've got this!",
      "Ready to have fun?",
      "I believe in you!",
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setCurrentMessage(randomGreeting);
    setShowMessage(true);
    setIsWiggling(true);
    
    setTimeout(() => {
      setIsWiggling(false);
    }, 600);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const showCustomMessage = (msg: string) => {
    setCurrentMessage(msg);
    setShowMessage(true);
    setIsWiggling(true);
    
    setTimeout(() => {
      setIsWiggling(false);
    }, 600);
    
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const handleClick = () => {
    const encouragements = [
      "You're doing amazing!",
      "Keep going!",
      "So proud of you!",
      "Great job!",
      "You're so smart!",
      "I knew you could do it!",
      "That's wonderful!",
    ];
    const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
    showCustomMessage(randomMsg);
  };

  if (!companion) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const sizeClasses = {
    'small': 'text-3xl',
    'medium': 'text-5xl',
    'large': 'text-7xl',
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 flex flex-col items-center`}
      style={{
        animation: 'float 3s ease-in-out infinite',
      }}
    >
      {/* Companion Character */}
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} cursor-pointer transition-transform hover:scale-110 relative`}
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
          animation: isWiggling ? 'wiggle 0.6s ease-in-out' : 'none',
        }}
        aria-label={`${companion.name} - Click for encouragement`}
      >
        {companion.emoji}
        
        {/* Pulse indicator */}
        <div 
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
          style={{
            backgroundColor: '#7D9D9C',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </button>

      {/* Speech Bubble */}
      {showMessage && (
        <div 
          className="mt-3 px-4 py-2 rounded-2xl max-w-xs relative"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          {/* Speech bubble arrow */}
          <div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid rgba(255, 255, 255, 0.95)',
            }}
          />
          
          <p 
            className="text-center"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#1F2023',
            }}
          >
            {currentMessage}
          </p>
        </div>
      )}
    </div>
  );
}

// Hook to trigger companion messages from any component
export function useCompanionMessage() {
  const [message, setMessage] = useState<string>('');

  const celebrate = () => {
    const celebrations = [
      "Amazing! ⭐",
      "Perfect! 🎉",
      "Wonderful! ✨",
      "You did it! 🌟",
      "Brilliant! 💫",
    ];
    setMessage(celebrations[Math.floor(Math.random() * celebrations.length)]);
  };

  const encourage = () => {
    const encouragements = [
      "Try again! 💪",
      "You can do it! 🌈",
      "Keep trying! 🌸",
      "Almost there! ⭐",
      "Don't give up! 🌟",
    ];
    setMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
  };

  const cheer = (customMsg: string) => {
    setMessage(customMsg);
  };

  return { message, celebrate, encourage, cheer };
}