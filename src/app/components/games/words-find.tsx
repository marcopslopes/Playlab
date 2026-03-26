import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { useGameProgress } from '../../hooks/use-game-progress';
import { useTranslation } from '../../hooks/use-translation';

const wordSets = [
  { word: 'CAT', letters: ['C', 'A', 'T', 'D', 'O', 'G'], emoji: '🐱' },
  { word: 'DOG', letters: ['D', 'O', 'G', 'C', 'A', 'T'], emoji: '🐶' },
  { word: 'SUN', letters: ['S', 'U', 'N', 'M', 'O', 'R'], emoji: '☀️' },
  { word: 'STAR', letters: ['S', 'T', 'A', 'R', 'M', 'O', 'N'], emoji: '⭐' },
  { word: 'TREE', letters: ['T', 'R', 'E', 'E', 'S', 'U', 'N'], emoji: '🌳' },
];

export function WordsFind() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({
    gameId: 'words/beginner/words-find', 
    categoryId: 'words' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [currentWord, setCurrentWord] = useState(wordSets[0]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stars, setStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const totalRounds = 5;

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (currentRound > 0 && currentRound < totalRounds) {
      setTimeout(() => generateRound(), 600);
    }
  }, [currentRound]);

  const generateRound = () => {
    const word = wordSets[currentRound % wordSets.length];
    setCurrentWord(word);
    setShuffledLetters([...word.letters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
    setShowFeedback(false);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (showFeedback) return;
    
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);
    
    // Remove from available letters
    const newShuffled = [...shuffledLetters];
    newShuffled.splice(index, 1);
    setShuffledLetters(newShuffled);
    
    // Check if word is complete
    if (newSelected.length === currentWord.word.length) {
      const formedWord = newSelected.join('');
      const correct = formedWord === currentWord.word;
      
      if (correct) {
        setShowFeedback(true);
        setTimeout(() => {
          if (currentRound < totalRounds - 1) {
            setCurrentRound(currentRound + 1);
          } else {
            // Game complete! Save progress
            completeGame(mistakes, stars);
          }
        }, 1500);
      } else {
        // Wrong - reset
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        
        if (newMistakes >= 3 && stars > 0) {
          setStars(stars - 1);
        }
        
        setTimeout(() => {
          setSelectedLetters([]);
          setShuffledLetters([...currentWord.letters].sort(() => Math.random() - 0.5));
        }, 800);
      }
    }
  };

  const handleUndo = () => {
    if (selectedLetters.length === 0 || showFeedback) return;
    
    const lastLetter = selectedLetters[selectedLetters.length - 1];
    setSelectedLetters(selectedLetters.slice(0, -1));
    setShuffledLetters([...shuffledLetters, lastLetter]);
  };

  return (
    <div 
      className="min-h-screen px-4 sm:px-6 py-6 sm:py-8"
      style={{ 
        background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/practice" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>{t('games.back')}</span>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((round) => (
                <div
                  key={round}
                  className="w-12 h-2 rounded-full"
                  style={{
                    backgroundColor: round <= currentRound + 1 ? '#C08B7E' : '#e5e7eb',
                  }}
                />
              ))}
            </div>

            <div className="flex gap-1">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className="w-6 h-6"
                  style={{ 
                    color: star <= stars ? '#FDB022' : '#e5e7eb',
                    fill: star <= stars ? '#FDB022' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 
            className="mb-3"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            SPELL THE WORD! 📚
          </h1>
          
          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            Tap letters to spell: <strong>{currentWord.word}</strong>
          </p>

          {/* Target Word with Emoji */}
          <div className="mb-8">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {currentWord.emoji}
            </div>
          </div>

          {/* Selected Letters Display */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3">
              {currentWord.word.split('').map((_, idx) => (
                <div
                  key={idx}
                  className="w-16 h-20 rounded-2xl bg-white flex items-center justify-center"
                  style={{
                    border: '3px solid #C08B7E',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {selectedLetters[idx] && (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#C08B7E',
                      }}
                    >
                      {selectedLetters[idx]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Available Letters */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {shuffledLetters.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLetterClick(letter, idx)}
                  className="w-16 h-16 rounded-2xl bg-white transition-all hover:scale-105"
                  style={{
                    border: '3px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#1F2023',
                    }}
                  >
                    {letter}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Undo Button */}
          {selectedLetters.length > 0 && (
            <button
              onClick={handleUndo}
              className="px-8 py-3 rounded-2xl transition-all hover:scale-105"
              style={{
                backgroundColor: '#7C8B9520',
                color: '#7C8B95',
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              ← UNDO
            </button>
          )}
        </div>

        {showFeedback && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div 
              className="bg-white rounded-3xl p-12 text-center max-w-md mx-4"
              style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
            >
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: '#95E1D320' }}
              >
                <Check className="w-12 h-12" style={{ color: '#95E1D3' }} strokeWidth={3} />
              </div>
              
              <p 
                className="mb-2"
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#1F2023',
                  textTransform: 'uppercase',
                }}
              >
                PERFECT! ✨
              </p>
              
              <p 
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                You spelled {currentWord.word}!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}