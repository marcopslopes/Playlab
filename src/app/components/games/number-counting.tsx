import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

export function NumberCounting() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { completeGame } = useGameProgress({ 
    gameId: 'logic/beginner/number-counting', 
    categoryId: 'logic' 
  });

  const [currentRound, setCurrentRound] = useState(0);
  const [targetNumber, setTargetNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState<number[]>([]);
  const totalRounds = getRoundsForLevel('beginner'); // Beginner course = 3 rounds
  const { message, celebrate, encourage } = useCompanionMessage();

  const colors = ['#7D9D9C', '#C08B7E', '#7C8B95'];

  useEffect(() => {
    generateRound();
  }, [currentRound]);

  const generateRound = () => {
    // Difficulty increases: round 1 = 1-5, round 2 = 1-7, round 3 = 1-10
    const maxNumber = currentRound === 0 ? 5 : currentRound === 1 ? 7 : 10;
    const numberArray = Array.from({ length: maxNumber }, (_, i) => i + 1);
    
    // Shuffle numbers
    const shuffled = numberArray.sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
    setTargetNumber(1);
    setClickedNumbers([]);
    setShowFeedback(false);
  };

  const handleNumberClick = (num: number) => {
    if (showFeedback || clickedNumbers.includes(num)) return;

    if (num === targetNumber) {
      // Correct! Mark as clicked
      const newClicked = [...clickedNumbers, num];
      setClickedNumbers(newClicked);
      
      // Check if this was the last number
      const maxNumber = currentRound === 0 ? 5 : currentRound === 1 ? 7 : 10;
      if (num === maxNumber) {
        // Complete!
        celebrate();
        setIsCorrect(true);
        setShowFeedback(true);
      } else {
        // Move to next number
        setTargetNumber(targetNumber + 1);
      }
    } else {
      // Wrong number
      encourage();
      setIsCorrect(false);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      if (currentRound < totalRounds - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        // Game completed! Save progress
        completeGame();
      }
    } else {
      // Try again - just hide feedback
      setShowFeedback(false);
      setClickedNumbers([]);
      setTargetNumber(1);
    }
  };

  const gridCols = currentRound === 0 ? 'grid-cols-5' : currentRound === 1 ? 'grid-cols-4' : 'grid-cols-5';

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
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Progress Bar */}
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
            <span style={{ fontSize: '0.9375rem' }}>Back</span>
          </Link>
          
          <div className="flex items-center gap-8">
            {/* Round Counter */}
            <div className="text-center">
              <p className="mb-1" style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af' }}>
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
              <p className="mb-1 text-center" style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af' }}>
                Your Score
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
            Number Counting
          </h1>
          <p className="mb-4" style={{ fontSize: '1.0625rem', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280' }}>
            Tap the numbers in order
          </p>
          
          {!showFeedback && (
            <div 
              className="inline-block px-8 py-3 rounded-2xl"
              style={{ 
                backgroundColor: colors[currentRound],
                color: 'white',
              }}
            >
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                FIND: {targetNumber}
              </p>
            </div>
          )}
        </div>

        {/* Numbers Grid */}
        {!showFeedback && (
          <div className={`grid ${gridCols} gap-4 max-w-2xl mx-auto`}>
            {numbers.map((num) => {
              const isClicked = clickedNumbers.includes(num);
              
              return (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  disabled={isClicked}
                  className="aspect-square rounded-2xl transition-all"
                  style={{
                    backgroundColor: isClicked ? (theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#E4DCCF') : (theme === 'dark' ? 'rgba(228, 220, 207, 0.15)' : 'white'),
                    boxShadow: isClicked 
                      ? (theme === 'dark' ? 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 8px rgba(0, 0, 0, 0.1)') 
                      : (theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.08)'),
                    opacity: isClicked ? 0.4 : 1,
                    cursor: isClicked ? 'default' : 'pointer',
                  }}
                >
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      fontSize: '3rem',
                      fontWeight: 700,
                      color: isClicked ? '#999' : colors[currentRound],
                    }}
                  >
                    {num}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-40"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.2s ease-out'
              }}
            />
            
            {/* Modal */}
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              <div 
                className="rounded-3xl p-10 text-center max-w-md w-full"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  boxShadow: theme === 'dark' ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.3)',
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
                  {isCorrect ? '✨ GREAT! ✨' : '❤️ TRY AGAIN ❤️'}
                </h2>
                
                {/* Continue Button */}
                <button
                  onClick={handleNext}
                  className="px-14 py-5 rounded-2xl transition-all text-white"
                  style={{
                    backgroundColor: isCorrect ? colors[0] : colors[1],
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: `0 6px 20px ${isCorrect ? 'rgba(125, 157, 156, 0.4)' : 'rgba(192, 139, 126, 0.4)'}`,
                    width: '100%',
                  }}
                >
                  {isCorrect 
                    ? (currentRound < totalRounds - 1 ? 'NEXT →' : 'DONE ✓')
                    : 'TRY AGAIN'}
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