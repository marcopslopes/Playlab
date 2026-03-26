import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Star, Volume2, RotateCcw } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useGameProgress } from '../../hooks/use-game-progress';

interface ObjectItem {
  id: string;
  portuguese: string;
  english: string;
  emoji: string;
  category: string;
}

const OBJECTS: ObjectItem[] = [
  // Animals
  { id: 'gato', portuguese: 'GATO', english: 'cat', emoji: '🐱', category: 'animals' },
  { id: 'cao', portuguese: 'CÃO', english: 'dog', emoji: '🐕', category: 'animals' },
  { id: 'passaro', portuguese: 'PÁSSARO', english: 'bird', emoji: '🐦', category: 'animals' },
  { id: 'peixe', portuguese: 'PEIXE', english: 'fish', emoji: '🐟', category: 'animals' },
  
  // Food
  { id: 'maca', portuguese: 'MAÇÃ', english: 'apple', emoji: '🍎', category: 'food' },
  { id: 'banana', portuguese: 'BANANA', english: 'banana', emoji: '🍌', category: 'food' },
  { id: 'laranja', portuguese: 'LARANJA', english: 'orange', emoji: '🍊', category: 'food' },
  { id: 'uva', portuguese: 'UVA', english: 'grape', emoji: '🍇', category: 'food' },
  
  // Objects
  { id: 'bola', portuguese: 'BOLA', english: 'ball', emoji: '⚽', category: 'objects' },
  { id: 'livro', portuguese: 'LIVRO', english: 'book', emoji: '📚', category: 'objects' },
  { id: 'carro', portuguese: 'CARRO', english: 'car', emoji: '🚗', category: 'objects' },
  { id: 'casa', portuguese: 'CASA', english: 'house', emoji: '🏠', category: 'objects' },
  
  // Nature
  { id: 'flor', portuguese: 'FLOR', english: 'flower', emoji: '🌸', category: 'nature' },
  { id: 'arvore', portuguese: 'ÁRVORE', english: 'tree', emoji: '🌳', category: 'nature' },
  { id: 'sol', portuguese: 'SOL', english: 'sun', emoji: '☀️', category: 'nature' },
  { id: 'estrela', portuguese: 'ESTRELA', english: 'star', emoji: '⭐', category: 'nature' },
];

export function ObjectMatch() {
  const { completeGame } = useGameProgress({ 
    gameId: 'languages/beginner/object-match', 
    categoryId: 'languages' 
  });

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [rounds, setRounds] = useState<{ target: ObjectItem; options: ObjectItem[] }[]>([]);
  const [stars, setStars] = useState(0);
  const { message, celebrate, encourage } = useCompanionMessage();

  const TOTAL_ROUNDS = 8;

  useEffect(() => {
    generateRounds();
  }, []);

  const generateRounds = () => {
    const shuffled = [...OBJECTS].sort(() => Math.random() - 0.5);
    const newRounds = [];
    
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const target = shuffled[i];
      
      // Get 3 wrong options from different categories if possible
      const wrongOptions = shuffled
        .filter(obj => obj.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [...wrongOptions, target].sort(() => Math.random() - 0.5);
      
      newRounds.push({ target, options });
    }
    
    setRounds(newRounds);
  };

  const handleOptionClick = (optionId: string) => {
    if (selectedOption !== null) return;
    
    const correct = optionId === rounds[currentRound].target.id;
    setSelectedOption(optionId);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      celebrate();
    } else {
      encourage();
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
            <Star className="w-20 h-20 mx-auto mb-4" style={{ color: '#4A90E2' }} />
            
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
              BEM FEITO! 🎉
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
                <RotateCcw className="w-5 h-5" />
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
      
      {/* Companion Helper */}
      <CompanionHelper message={message} position="top-left" size="medium" />
      
      <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1 }}>
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
                OBJECT MATCH 📦
              </h1>
              <p style={{ fontSize: '0.9375rem', color: '#6b7280' }}>
                Match the Portuguese word to the picture
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

        {/* Question */}
        <div className="mb-12">
          <div 
            className="bg-white rounded-3xl p-8 text-center"
            style={{
              border: '3px solid #4A90E2',
              boxShadow: '0 8px 32px rgba(74, 144, 226, 0.15)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Volume2 className="w-6 h-6" style={{ color: '#4A90E2' }} />
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                (Audio coming soon with AI)
              </p>
            </div>

            <h2 
              className="mb-2"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '3.5rem',
                fontWeight: 700,
                color: '#1F2023',
                letterSpacing: '0.02em',
              }}
            >
              {currentData.target.portuguese}
            </h2>
            
            <p style={{ fontSize: '1rem', color: '#9ca3af' }}>
              ({currentData.target.english})
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-6">
          {currentData.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCurrentCorrect = option.id === currentData.target.id;
            
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
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={selectedOption !== null}
                className="p-8 rounded-3xl transition-all"
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
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                  }
                }}
              >
                <div className="text-7xl mb-3">{option.emoji}</div>
                <p 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  {option.english}
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
              {isCorrect ? '✓ CORRECT! BEM FEITO!' : '✗ TRY AGAIN NEXT TIME!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}