import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Power, Sparkles, Check } from 'lucide-react';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [foundLetter, setFoundLetter] = useState(false);
  const [foundNumber, setFoundNumber] = useState(false);

  // Check if onboarding is already complete
  useEffect(() => {
    const isComplete = localStorage.getItem('onboardingComplete');
    const hasCompanion = localStorage.getItem('hasSeenCompanionSelection');
    
    if (isComplete === 'true' && hasCompanion === 'true') {
      navigate('/daily');
    } else if (isComplete === 'true') {
      navigate('/choose-companion');
    }
  }, [navigate]);

  // Keyboard controls for letter step (Step 2)
  useEffect(() => {
    if (step !== 2) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        setFoundLetter(true);
        setTimeout(() => setStep(3), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step]);

  // Keyboard controls for number step (Step 3)
  useEffect(() => {
    if (step !== 3) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '5') {
        setFoundNumber(true);
        setTimeout(() => setStep(4), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step]);

  const handlePowerOn = () => {
    setIsPoweredOn(true);
    setTimeout(() => setStep(1), 1500);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setTimeout(() => setStep(2), 800);
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/choose-companion');
  };

  // Step 0: Power On Screen
  if (step === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: isPoweredOn 
            ? 'linear-gradient(to bottom, #1F2023, #2a2d31)' 
            : '#000',
          transition: 'background 1.5s ease-out',
        }}
      >
        {!isPoweredOn ? (
          <button
            onClick={handlePowerOn}
            className="group"
          >
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
              style={{
                backgroundColor: '#7D9D9C',
                boxShadow: '0 0 40px rgba(125, 157, 156, 0.4)',
              }}
            >
              <Power className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
            <p 
              className="mt-6 text-white/80"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                textTransform: 'uppercase',
              }}
            >
              TAP TO START
            </p>
          </button>
        ) : (
          <div className="text-center">
            <Sparkles 
              className="w-16 h-16 mx-auto mb-4 animate-pulse" 
              style={{ color: '#7D9D9C' }}
            />
            <p 
              className="text-white/60"
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                animation: 'fadeIn 0.8s ease-out',
              }}
            >
              Starting up...
            </p>
          </div>
        )}
      </div>
    );
  }

  // Step 1: Interactive Color Learning
  if (step === 1) {
    const colors = [
      { color: '#FF6B6B', emoji: '🔴', label: 'RED' },
      { color: '#4ECDC4', emoji: '🔵', label: 'BLUE' },
      { color: '#95E1D3', emoji: '🟢', label: 'GREEN' },
      { color: '#FDB022', emoji: '🟡', label: 'YELLOW' },
    ];

    return (
      <div 
        className="min-h-screen flex items-center justify-center px-6"
        style={{ 
          background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
          animation: 'fadeIn 0.8s ease-out',
        }}
      >
        <div className="max-w-3xl w-full text-center">
          <h1 
            className="mb-12"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            TAP A COLOR! 🎨
          </h1>

          <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
            {colors.map((item) => (
              <button
                key={item.color}
                onClick={() => handleColorSelect(item.color)}
                className="aspect-square rounded-3xl transition-all hover:scale-105"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 8px 24px ${item.color}60`,
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
                    {item.emoji}
                  </div>
                  <p 
                    className="text-white"
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Find the Letter M
  if (step === 2) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-6"
        style={{ 
          background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        }}
      >
        <div className="max-w-3xl w-full text-center">
          <h1 
            className="mb-6"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            FIND THE LETTER M! ⌨️
          </h1>
          
          <p 
            className="mb-12 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.25rem',
            }}
          >
            Look at your keyboard and press the M key
          </p>

          <div className="max-w-md mx-auto">
            <div 
              className="aspect-square rounded-3xl bg-white flex items-center justify-center transition-all"
              style={{
                border: `6px solid ${foundLetter ? '#95E1D3' : (selectedColor || '#7D9D9C')}`,
                boxShadow: foundLetter 
                  ? '0 8px 32px rgba(149, 225, 211, 0.6)' 
                  : '0 4px 16px rgba(0, 0, 0, 0.08)',
                backgroundColor: foundLetter ? '#95E1D320' : 'white',
              }}
            >
              {foundLetter ? (
                <div className="text-center">
                  <Check 
                    className="w-24 h-24 mx-auto mb-4" 
                    style={{ color: '#95E1D3' }}
                  />
                  <p 
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#95E1D3',
                      textTransform: 'uppercase',
                    }}
                  >
                    YOU FOUND IT! ✨
                  </p>
                </div>
              ) : (
                <p 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '12rem',
                    fontWeight: 700,
                    color: selectedColor || '#7D9D9C',
                    lineHeight: 1,
                  }}
                >
                  M
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Find the Number 5
  if (step === 3) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-6"
        style={{ 
          background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        }}
      >
        <div className="max-w-3xl w-full text-center">
          <h1 
            className="mb-6"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            FIND THE NUMBER 5! 🔢
          </h1>
          
          <p 
            className="mb-12 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.25rem',
            }}
          >
            Look at your keyboard and press the 5 key
          </p>

          <div className="max-w-md mx-auto">
            <div 
              className="aspect-square rounded-3xl bg-white flex items-center justify-center transition-all"
              style={{
                border: `6px solid ${foundNumber ? '#FDB022' : (selectedColor || '#7D9D9C')}`,
                boxShadow: foundNumber 
                  ? '0 8px 32px rgba(253, 176, 34, 0.6)' 
                  : '0 4px 16px rgba(0, 0, 0, 0.08)',
                backgroundColor: foundNumber ? '#FDB02220' : 'white',
              }}
            >
              {foundNumber ? (
                <div className="text-center">
                  <Check 
                    className="w-24 h-24 mx-auto mb-4" 
                    style={{ color: '#FDB022' }}
                  />
                  <p 
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#FDB022',
                      textTransform: 'uppercase',
                    }}
                  >
                    AWESOME! ⭐
                  </p>
                </div>
              ) : (
                <p 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '12rem',
                    fontWeight: 700,
                    color: selectedColor || '#7D9D9C',
                    lineHeight: 1,
                  }}
                >
                  5
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Celebration!
  if (step === 4) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-6"
        style={{ 
          background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        }}
      >
        <div className="max-w-2xl w-full text-center">
          <div 
            className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center"
            style={{ 
              backgroundColor: selectedColor || '#7D9D9C',
              boxShadow: `0 8px 32px ${selectedColor || '#7D9D9C'}60`,
              animation: 'bounce 1s ease-in-out infinite',
            }}
          >
            <Sparkles className="w-16 h-16 text-white" strokeWidth={2.5} />
          </div>
          
          <h1 
            className="mb-4"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '3rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            ✨ YOU DID IT! ✨
          </h1>
          
          <p 
            className="mb-12 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.5rem',
            }}
          >
            You know your keyboard!
          </p>

          <button
            onClick={handleFinishOnboarding}
            className="px-16 py-6 rounded-3xl transition-all text-white hover:scale-105"
            style={{
              backgroundColor: selectedColor || '#7D9D9C',
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: `0 8px 24px ${selectedColor || '#7D9D9C'}60`,
            }}
          >
            START LEARNING! 🚀
          </button>
        </div>
      </div>
    );
  }

  return null;
}