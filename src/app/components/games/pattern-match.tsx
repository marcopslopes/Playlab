import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useProgress } from '../../contexts/progress-context';
import { getRoundsForLevel } from '../../utils/game-config';

const colors = ['#7D9D9C', '#C08B7E', '#7C8B95', '#E4DCCF'];

const patterns = [
  { pattern: ['red', 'red'], name: 'Two Red' },
  { pattern: ['blue', 'blue'], name: 'Two Blue' },
  { pattern: ['red', 'blue'], name: 'Red Blue' },
  { pattern: ['blue', 'red'], name: 'Blue Red' },
  { pattern: ['red', 'blue', 'red'], name: 'Red Blue Red' },
  { pattern: ['blue', 'red', 'blue'], name: 'Blue Red Blue' },
];

const colorMap: Record<string, string> = {
  red: colors[1], // clay
  blue: colors[0], // sage
  green: colors[2], // slate
  yellow: colors[3], // oat
};

export function PatternMatch() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { updateGameProgress } = useProgress();
  const [currentRound, setCurrentRound] = useState(0);
  const [targetPattern, setTargetPattern] = useState<typeof patterns[0] | null>(null);
  const [options, setOptions] = useState<typeof patterns>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(3);
  const [attempts, setAttempts] = useState(0);
  const totalRounds = getRoundsForLevel('beginner'); // Beginner course = 3 rounds
  const { message, celebrate, encourage } = useCompanionMessage();

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (currentRound > 0) {
      generateRound();
    }
  }, [currentRound]);

  const generateRound = () => {
    const difficulty = Math.min(currentRound + 2, 4); // Start at 2, max 4
    const availablePatterns = patterns.filter(p => p.pattern.length <= difficulty);
    
    const target = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
    setTargetPattern(target);
    
    // Create options including the correct one
    const otherPatterns = availablePatterns.filter(p => p.name !== target.name);
    const shuffled = [...otherPatterns].sort(() => Math.random() - 0.5).slice(0, 2);
    const allOptions = [target, ...shuffled].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !targetPattern) return;
    
    const correct = options[selectedOption].name === targetPattern.name;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(attempts + 1);
    
    if (!correct && stars > 0) {
      setStars(stars - 1);
    }
  };

  const handleOptionClick = (idx: number) => {
    if (showFeedback) return; // Prevent clicking during feedback
    
    setSelectedOption(idx);
    
    // Immediately check the answer
    const correct = options[idx].name === targetPattern.name;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      celebrate();
    } else {
      encourage();
    }
    
    if (!correct && stars > 0) {
      setStars(stars - 1);
    }
  };

  const handleNext = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      // Game completed! Save progress
      updateGameProgress('logic/beginner/pattern-match', stars, true);
      navigate('/game/logic');
    }
  };

  // Don't render until we have data
  if (!targetPattern || options.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{ 
          fontFamily: 'var(--font-body)',
        }}
      >
        <OutdoorBackground />
        <div 
          className="text-gray-500 relative z-10"
          style={{ color: theme === 'dark' ? '#E4DCCF' : '#6b7280' }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen px-6 py-8 relative overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-body)',
      }}
    >
      <OutdoorBackground />
      
      {/* Companion Helper */}
      <CompanionHelper message={message} position="top-right" size="medium" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Progress Bar - Full Width */}
        <div className="mb-6">
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(125, 157, 156, 0.15)' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentRound + 1) / totalRounds) * 100}%`,
                background: 'linear-gradient(to right, #7D9D9C, #A8C5C4)',
              }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link 
            to="/game/logic" 
            className="inline-flex items-center gap-2 transition-colors"
            style={{ color: theme === 'dark' ? '#E4DCCF' : '#6b7280' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>{t('games.back')}</span>
          </Link>

          <div className="flex items-center gap-8">
            {/* Round Counter */}
            <div className="text-center">
              <p
                className="mb-1"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : '#9ca3af',
                }}
              >
                Round
              </p>
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#7D9D9C',
                }}
              >
                {currentRound + 1} of {totalRounds}
              </p>
            </div>
            
            {/* Stars */}
            <div>
              <p 
                className="mb-1 text-center" 
                style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 500, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : '#9ca3af',
                }}
              >
                {t('games.score')}
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className="w-6 h-6"
                    style={{ 
                      color: star <= stars ? '#FDB022' : '#e5e7eb',
                      fill: star <= stars ? '#FDB022' : 'none',
                      filter: star <= stars ? 'drop-shadow(0 2px 4px rgba(253, 176, 34, 0.3))' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-12">
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 600,
              color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
            }}
          >
            Pattern Match
          </h1>
          <p 
            style={{ 
              fontSize: '1.0625rem',
              color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
            }}
          >
            Find the matching pattern
          </p>
        </div>

        {/* Target Pattern */}
        <div 
          className="rounded-3xl p-8 mb-8 text-center"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#fff',
            backdropFilter: 'blur(10px)',
            boxShadow: theme === 'dark' 
              ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
              : '0 4px 20px rgba(0, 0, 0, 0.06)',
          }}
        >
          <p 
            className="mb-6"
            style={{ 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
            }}
          >
            Match This Pattern
          </p>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            {targetPattern.pattern.map((color, idx) => (
              <div
                key={idx}
                className="rounded-2xl"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: colorMap[color],
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Options */}
        {!showFeedback && (
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-3">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className="rounded-2xl p-6 transition-all"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.08)' : '#fff',
                    backdropFilter: 'blur(10px)',
                    border: selectedOption === idx ? `2px solid ${colors[0]}` : `2px solid ${theme === 'dark' ? 'rgba(228, 220, 207, 0.15)' : '#f3f4f6'}`,
                    boxShadow: selectedOption === idx 
                      ? '0 4px 16px rgba(125, 157, 156, 0.2)' 
                      : theme === 'dark'
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                        : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    {option.pattern.map((color, colorIdx) => (
                      <div
                        key={colorIdx}
                        className="rounded-xl"
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: colorMap[color],
                        }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            />
            
            {/* Modal */}
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              <div 
                className="bg-white rounded-3xl p-10 text-center max-w-md w-full"
                style={{ 
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  animation: 'slideUp 0.3s ease-out',
                }}
              >
                {/* Large Icon */}
                <div className="flex justify-center mb-6">
                  {isCorrect ? (
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors[0] }}
                    >
                      <Check className="w-14 h-14 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors[1] }}
                    >
                      <X className="w-14 h-14 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                
                {/* Minimal Text in CAPS */}
                <h2 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: isCorrect ? colors[0] : colors[1],
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '2rem',
                  }}
                >
                  {isCorrect ? t('games.correct') : t('games.tryAgain')}
                </h2>
                
                {/* Continue Button */}
                <button
                  onClick={handleNext}
                  className="px-14 py-5 rounded-2xl transition-all text-white"
                  style={{
                    backgroundColor: colors[0],
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 6px 20px rgba(125, 157, 156, 0.4)',
                    width: '100%',
                  }}
                >
                  {currentRound < totalRounds - 1 ? 'NEXT →' : 'DONE ✓'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}