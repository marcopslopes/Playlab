import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Star, Sparkles } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

// Color mixing combinations
const colorMixes = [
  { color1: '#3498DB', color2: '#F1C40F', result: '#2ECC71', name1: 'Blue', name2: 'Yellow', resultName: 'Green', emoji: '🌿' },
  { color1: '#E74C3C', color2: '#3498DB', result: '#9B59B6', name1: 'Red', name2: 'Blue', resultName: 'Purple', emoji: '💜' },
  { color1: '#E74C3C', color2: '#F1C40F', result: '#E67E22', name1: 'Red', name2: 'Yellow', resultName: 'Orange', emoji: '🍊' },
  { color1: '#E74C3C', color2: '#FFFFFF', result: '#FFB6C1', name1: 'Red', name2: 'White', resultName: 'Pink', emoji: '🌸' },
  { color1: '#3498DB', color2: '#2ECC71', result: '#1ABC9C', name1: 'Blue', name2: 'Green', resultName: 'Teal', emoji: '🦋' },
];

export function ColorMixingLab() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'creative/beginner/color-mixing-lab', 
    categoryId: 'creative' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedColor1, setSelectedColor1] = useState<string | null>(null);
  const [selectedColor2, setSelectedColor2] = useState<string | null>(null);
  const [mixedColor, setMixedColor] = useState<string | null>(null);
  const [isMixing, setIsMixing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [targetMix, setTargetMix] = useState<typeof colorMixes[0] | null>(null);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const totalRounds = getRoundsForLevel('beginner'); // 3 rounds
  const { message, celebrate, encourage } = useCompanionMessage();

  // Generate new round
  useEffect(() => {
    if (currentRound < totalRounds) {
      generateNewRound();
    }
  }, [currentRound]);

  const generateNewRound = () => {
    const mix = colorMixes[Math.floor(Math.random() * colorMixes.length)];
    setTargetMix(mix);
    
    // Create available colors (the two needed colors + 2 random others)
    const otherColors = ['#9B59B6', '#E67E22', '#1ABC9C', '#FFB6C1', '#2ECC71', '#FFFFFF']
      .filter(c => c !== mix.color1 && c !== mix.color2);
    const randomOthers = otherColors.sort(() => Math.random() - 0.5).slice(0, 2);
    const colors = [mix.color1, mix.color2, ...randomOthers].sort(() => Math.random() - 0.5);
    
    setAvailableColors(colors);
    setSelectedColor1(null);
    setSelectedColor2(null);
    setMixedColor(null);
    setShowFeedback(false);
  };

  const handleColorSelect = (color: string) => {
    if (isMixing || showFeedback) return;
    
    if (!selectedColor1) {
      setSelectedColor1(color);
    } else if (!selectedColor2 && color !== selectedColor1) {
      setSelectedColor2(color);
    }
  };

  const handleMix = async () => {
    if (!selectedColor1 || !selectedColor2 || !targetMix) return;
    
    setIsMixing(true);
    
    // Animation delay for mixing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if correct combination
    const correctCombo = 
      (selectedColor1 === targetMix.color1 && selectedColor2 === targetMix.color2) ||
      (selectedColor1 === targetMix.color2 && selectedColor2 === targetMix.color1);
    
    if (correctCombo) {
      setMixedColor(targetMix.result);
      setIsCorrect(true);
      celebrate();
      setShowFeedback(true);
      setIsMixing(false);
      
      setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound(currentRound + 1);
        } else {
          completeGame(stars);
          setTimeout(() => navigate('/game/creative'), 500);
        }
      }, 2000);
    } else {
      // Show a mixed color (random) but mark as incorrect
      setMixedColor('#8B8B8B'); // Gray for wrong mix
      setIsCorrect(false);
      setMistakes(mistakes + 1);
      if (mistakes >= 2) setStars(Math.max(1, stars - 1));
      encourage();
      setShowFeedback(true);
      setIsMixing(false);
      
      setTimeout(() => {
        setSelectedColor1(null);
        setSelectedColor2(null);
        setMixedColor(null);
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setSelectedColor1(null);
    setSelectedColor2(null);
    setMixedColor(null);
  };

  if (!targetMix) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <OutdoorBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/game/creative"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{t('games.back')}</span>
          </Link>

          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`w-7 h-7 ${i < stars ? 'fill-current' : ''}`}
                style={{ color: i < stars ? '#FDB022' : theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db' }}
              />
            ))}
          </div>
        </div>

        {/* Companion Helper */}
        <CompanionHelper message={message} />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            {/* Title */}
            <div className="text-center mb-8">
              <h1
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                🌈 Color Mixing Lab
              </h1>
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
                }}
              >
                Mix colors to make: <strong>{targetMix.resultName} {targetMix.emoji}</strong>
              </p>
              <p
                className="mt-3 max-w-md mx-auto"
                style={{
                  fontSize: '0.9375rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : '#9ca3af',
                  fontStyle: 'italic',
                  lineHeight: '1.5',
                }}
              >
                Real artists mix colors like this! Painters use primary colors to create all the colors of nature. 🎨
              </p>
            </div>

            {/* Progress */}
            <div className="text-center mb-10">
              <div
                className="inline-block px-6 py-3 rounded-2xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                Round {currentRound + 1} of {totalRounds}
              </div>
            </div>

            {/* Mixing Station */}
            <div className="mb-10">
              <div className="flex items-center justify-center gap-6 mb-8">
                {/* First Color Blob */}
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-full mx-auto mb-3 flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: selectedColor1 || (theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#f3f4f6'),
                      border: `4px ${selectedColor1 ? 'solid' : 'dashed'} ${
                        selectedColor1 || (theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db')
                      }`,
                      boxShadow: selectedColor1 ? '0 8px 24px rgba(0, 0, 0, 0.2)' : 'none',
                    }}
                  >
                    {!selectedColor1 && (
                      <span style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af', fontSize: '2rem' }}>
                        ?
                      </span>
                    )}
                  </div>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '0.875rem' }}>
                    Color 1
                  </p>
                </div>

                {/* Plus Sign */}
                <div style={{ fontSize: '3rem', color: theme === 'dark' ? '#E4DCCF' : '#1F2023', fontWeight: 700 }}>
                  +
                </div>

                {/* Second Color Blob */}
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-full mx-auto mb-3 flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: selectedColor2 || (theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#f3f4f6'),
                      border: `4px ${selectedColor2 ? 'solid' : 'dashed'} ${
                        selectedColor2 || (theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db')
                      }`,
                      boxShadow: selectedColor2 ? '0 8px 24px rgba(0, 0, 0, 0.2)' : 'none',
                    }}
                  >
                    {!selectedColor2 && (
                      <span style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af', fontSize: '2rem' }}>
                        ?
                      </span>
                    )}
                  </div>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '0.875rem' }}>
                    Color 2
                  </p>
                </div>

                {/* Equals Sign */}
                <div style={{ fontSize: '3rem', color: theme === 'dark' ? '#E4DCCF' : '#1F2023', fontWeight: 700 }}>
                  =
                </div>

                {/* Result */}
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-full mx-auto mb-3 flex items-center justify-center transition-all relative overflow-hidden"
                    style={{
                      backgroundColor: mixedColor || (theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#f3f4f6'),
                      border: `4px solid ${mixedColor || (theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db')}`,
                      boxShadow: mixedColor ? '0 8px 24px rgba(0, 0, 0, 0.2)' : 'none',
                    }}
                  >
                    {!mixedColor && (
                      <span style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af', fontSize: '2rem' }}>
                        ?
                      </span>
                    )}
                    {isMixing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '0.875rem' }}>
                    Result
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleMix}
                  disabled={!selectedColor1 || !selectedColor2 || isMixing || showFeedback}
                  className="px-10 py-4 rounded-2xl transition-all"
                  style={{
                    backgroundColor: '#2ECC71',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    cursor: (!selectedColor1 || !selectedColor2 || isMixing || showFeedback) ? 'not-allowed' : 'pointer',
                    opacity: (!selectedColor1 || !selectedColor2 || isMixing || showFeedback) ? 0.5 : 1,
                    boxShadow: '0 4px 16px rgba(46, 204, 113, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedColor1 && selectedColor2 && !isMixing && !showFeedback) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedColor1 && selectedColor2 && !isMixing && !showFeedback) {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isMixing ? 'Mixing...' : 'Mix Colors!'}
                </button>

                <button
                  onClick={handleReset}
                  disabled={isMixing || showFeedback}
                  className="px-8 py-4 rounded-2xl transition-all"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : '#f3f4f6',
                    color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    cursor: (isMixing || showFeedback) ? 'not-allowed' : 'pointer',
                    opacity: (isMixing || showFeedback) ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isMixing && !showFeedback) e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isMixing && !showFeedback) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <p
                className="text-center mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                Choose Your Colors:
              </p>
              
              <div className="flex justify-center gap-4">
                {availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleColorSelect(color)}
                    disabled={isMixing || showFeedback || color === selectedColor1 || color === selectedColor2}
                    className="transition-all"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '20px',
                      backgroundColor: color,
                      border: `4px solid ${
                        color === selectedColor1 || color === selectedColor2 
                          ? '#FDB022' 
                          : theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#e5e7eb'
                      }`,
                      cursor: (isMixing || showFeedback || color === selectedColor1 || color === selectedColor2) 
                        ? 'not-allowed' 
                        : 'pointer',
                      opacity: (color === selectedColor1 || color === selectedColor2) ? 0.5 : 1,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMixing && !showFeedback && color !== selectedColor1 && color !== selectedColor2) {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMixing && !showFeedback) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedback && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              className="rounded-3xl p-12 text-center max-w-md w-full"
              style={{
                backgroundColor: theme === 'dark' ? '#2A2C30' : '#fff',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {isCorrect ? (
                <>
                  <div className="text-7xl mb-4">{targetMix.emoji}</div>
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 600,
                      color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                    }}
                  >
                    You discovered {targetMix.resultName}!
                  </h2>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '1.0625rem' }}>
                    What a beautiful color you created! 🌈
                  </p>
                </>
              ) : (
                <>
                  <div className="text-7xl mb-4">🌿</div>
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 600,
                      color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                    }}
                  >
                    Keep Exploring!
                  </h2>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '1.0625rem' }}>
                    That made a different color. Try mixing again! 💫
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}