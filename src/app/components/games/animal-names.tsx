import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { useGameProgress } from '../../hooks/use-game-progress';

interface LetterItem {
  letter: string;
  sound: string;
  word: string;
  emoji: string;
  translation: string;
}

const LETTERS: LetterItem[] = [
  { letter: 'A', sound: 'ah', word: 'ABELHA', emoji: '🐝', translation: 'bee' },
  { letter: 'B', sound: 'beh', word: 'BALEIA', emoji: '🐋', translation: 'whale' },
  { letter: 'C', sound: 'seh', word: 'CAVALO', emoji: '🐴', translation: 'horse' },
  { letter: 'G', sound: 'geh', word: 'GATO', emoji: '🐱', translation: 'cat' },
  { letter: 'L', sound: 'leh', word: 'LEÃO', emoji: '🦁', translation: 'lion' },
  { letter: 'O', sound: 'oh', word: 'OVELHA', emoji: '🐑', translation: 'sheep' },
  { letter: 'P', sound: 'peh', word: 'PÁSSARO', emoji: '🐦', translation: 'bird' },
  { letter: 'R', sound: 'reh', word: 'RATO', emoji: '🐭', translation: 'mouse' },
  { letter: 'V', sound: 'veh', word: 'VACA', emoji: '🐄', translation: 'cow' },
];

export function AnimalNames() {
  const { completeGame } = useGameProgress({ 
    gameId: 'languages/beginner/animal-names', 
    categoryId: 'languages' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [rounds, setRounds] = useState<{ target: LetterItem; options: LetterItem[] }[]>([]);
  const [stars, setStars] = useState(0);

  const TOTAL_ROUNDS = 6;

  useEffect(() => {
    generateRounds();
  }, []);

  const generateRounds = () => {
    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
    const newRounds = [];
    
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const target = shuffled[i];
      
      // Get 3 wrong options
      const wrongOptions = shuffled
        .filter(letter => letter.letter !== target.letter)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [...wrongOptions, target].sort(() => Math.random() - 0.5);
      
      newRounds.push({ target, options });
    }
    
    setRounds(newRounds);
  };

  const handleOptionClick = (optionLetter: string) => {
    if (selectedOption !== null) return;
    
    const correct = optionLetter === rounds[currentRound].target.letter;
    setSelectedOption(optionLetter);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentRound + 1 < TOTAL_ROUNDS) {
        setCurrentRound(currentRound + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // Game complete
        const finalScore = correct ? score + 1 : score;
        const percentage = (finalScore / TOTAL_ROUNDS) * 100;
        
        let earnedStars = 0;
        if (percentage >= 90) earnedStars = 3;
        else if (percentage >= 70) earnedStars = 2;
        else if (percentage >= 50) earnedStars = 1;
        
        setStars(earnedStars);
        
        // Save progress and navigate
        completeGame(3 - earnedStars, earnedStars);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setGameComplete(false);
    setStars(0);
    generateRounds();
  };

  if (rounds.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentData = rounds[currentRound];

  if (gameComplete) {
    return (
      <div 
        className="min-h-screen px-4 py-8 flex items-center justify-center"
        style={{ 
          background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div className="max-w-md w-full text-center">
          <div 
            className="bg-white rounded-3xl p-8"
            style={{
              border: '3px solid #4A90E2',
              boxShadow: '0 8px 32px rgba(74, 144, 226, 0.2)',
            }}
          >
            <Star className="w-20 h-20 mx-auto mb-4" style={{ color: '#FDB022' }} />
            
            <h2 
              className="mb-2"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1F2023',
                textTransform: 'uppercase',
              }}
            >
              MUITO BEM! 🎉
            </h2>
            
            <p className="mb-6" style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              You got <strong>{score} out of {TOTAL_ROUNDS}</strong> correct!
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className="w-12 h-12"
                  style={{
                    fill: star <= stars ? '#FDB022' : 'none',
                    color: star <= stars ? '#FDB022' : '#d1d5db',
                    strokeWidth: 2,
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: '#4A90E2',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                PLAY AGAIN
              </button>

              <Link
                to="/game/languages"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: '#7D9D9C20',
                  color: '#7D9D9C',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7D9D9C30';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7D9D9C20';
                }}
              >
                BACK TO PORTUGUÊS
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen px-4 py-6 relative"
      style={{ 
        fontFamily: 'var(--font-body)',
      }}
    >
      <OutdoorBackground />
      <div className="max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/game/languages" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>BACK</span>
          </Link>

          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#1F2023',
                  textTransform: 'uppercase',
                }}
              >
                ANIMAL NAMES 🐱
              </h1>
              <p style={{ fontSize: '0.9375rem', color: '#6b7280' }}>
                Match the letter sound to the animal
              </p>
            </div>
            
            <div className="text-right">
              <div 
                className="px-4 py-2 rounded-xl mb-2"
                style={{
                  backgroundColor: '#4A90E220',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#4A90E2',
                }}
              >
                {currentRound + 1} / {TOTAL_ROUNDS}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Score: {score}
              </p>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div 
          className="mb-8 p-4 rounded-2xl text-center"
          style={{
            backgroundColor: '#4A90E210',
            border: '2px solid #4A90E230',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Volume2 className="w-5 h-5" style={{ color: '#4A90E2' }} />
            <p 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1F2023',
                textTransform: 'uppercase',
              }}
            >
              MATCH EACH LETTER WITH ITS SOUND
            </p>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Tap the animal that starts with this letter sound!
          </p>
        </div>

        {/* Letter Card */}
        <div className="mb-12">
          <div 
            className="bg-white rounded-3xl p-12 text-center mx-auto max-w-sm"
            style={{
              border: '4px solid #4A90E2',
              boxShadow: '0 8px 32px rgba(74, 144, 226, 0.2)',
            }}
          >
            {/* Speaker Icon */}
            <button
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all"
              style={{
                backgroundColor: '#4A90E220',
                border: '3px dashed #4A90E2',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4A90E230';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4A90E220';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Volume2 className="w-8 h-8" style={{ color: '#4A90E2' }} />
            </button>

            {/* Letter */}
            <h2 
              className="mb-3"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '6rem',
                fontWeight: 700,
                color: '#4A90E2',
                lineHeight: 1,
              }}
            >
              {currentData.target.letter.toLowerCase()}
            </h2>
            
            <p 
              style={{ 
                fontSize: '1.25rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              sounds like "{currentData.target.sound}"
            </p>

            <p 
              className="mt-3"
              style={{ 
                fontSize: '0.875rem',
                color: '#9ca3af',
              }}
            >
              (Audio coming soon with AI)
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentData.options.map((option) => {
            const isSelected = selectedOption === option.letter;
            const isCurrentCorrect = option.letter === currentData.target.letter;
            
            let borderColor = '#e5e7eb';
            let backgroundColor = '#fff';
            let shadow = '0 4px 16px rgba(0, 0, 0, 0.06)';

            if (isSelected) {
              if (isCorrect) {
                borderColor = '#10b981';
                backgroundColor = '#10b98110';
                shadow = '0 8px 24px rgba(16, 185, 129, 0.25)';
              } else {
                borderColor = '#ef4444';
                backgroundColor = '#ef444410';
                shadow = '0 8px 24px rgba(239, 68, 68, 0.25)';
              }
            } else if (selectedOption !== null && isCurrentCorrect) {
              borderColor = '#10b981';
              backgroundColor = '#10b98110';
              shadow = '0 8px 24px rgba(16, 185, 129, 0.25)';
            }

            return (
              <button
                key={option.letter}
                onClick={() => handleOptionClick(option.letter)}
                disabled={selectedOption !== null}
                className="p-6 rounded-2xl transition-all"
                style={{
                  border: `3px solid ${borderColor}`,
                  backgroundColor,
                  boxShadow: shadow,
                  cursor: selectedOption !== null ? 'default' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (selectedOption === null) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOption === null) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = shadow;
                  }
                }}
              >
                <div className="text-5xl mb-2">{option.emoji}</div>
                <p 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#1F2023',
                    textTransform: 'uppercase',
                    marginBottom: '0.25rem',
                  }}
                >
                  {option.word}
                </p>
                <p 
                  style={{ 
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                  }}
                >
                  {option.translation}
                </p>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {selectedOption !== null && (
          <div 
            className="mt-8 p-6 rounded-3xl text-center"
            style={{
              backgroundColor: isCorrect ? '#10b98120' : '#ef444420',
              border: `3px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
            }}
          >
            <p 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: isCorrect ? '#10b981' : '#ef4444',
                textTransform: 'uppercase',
              }}
            >
              {isCorrect ? `✓ SIM! ${currentData.target.word} STARTS WITH "${currentData.target.letter}"!` : `✗ OOPS! TRY AGAIN NEXT TIME!`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}