import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

const emojis = ['🐶', '🐱', '🐼', '🐸', '🦊', '🐻', '🐰', '🦁'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryMatch() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'logic/beginner/memory-match', 
    categoryId: 'logic' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [stars, setStars] = useState(3);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const totalRounds = getRoundsForLevel('beginner');
  const { message, celebrate, encourage } = useCompanionMessage();

  const colors = ['#7D9D9C', '#C08B7E', '#7C8B95'];

  useEffect(() => {
    generateRound();
  }, [currentRound]);

  const generateRound = () => {
    // Start with 3 pairs, increase each round
    const pairsCount = 3 + currentRound; // 3, 4, 5 pairs
    const selectedEmojis = emojis.slice(0, pairsCount);
    
    // Create pairs
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle and create card objects
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsComplete(false);
    setStars(3);
  };

  const handleCardClick = (cardId: number) => {
    // Don't flip if already flipped or matched, or if two cards are already flipped
    if (
      flippedCards.length === 2 ||
      cards[cardId].isFlipped ||
      cards[cardId].isMatched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        celebrate();
        setTimeout(() => {
          newCards[firstId].isMatched = true;
          newCards[secondId].isMatched = true;
          setCards(newCards);
          setFlippedCards([]);
          
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);
          
          // Check if game is complete
          if (newMatchedPairs === (3 + currentRound)) {
            setIsComplete(true);
          }
        }, 600);
      } else {
        // No match - lose a star
        encourage();
        if (stars > 0) {
          setStars(stars - 1);
        }
        
        // Flip back after delay
        setTimeout(() => {
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      // Game completed! Save progress with current stars
      completeGame(3 - stars, stars);
    }
  };

  const gridCols = currentRound === 0 ? 'grid-cols-3' : currentRound === 1 ? 'grid-cols-4' : 'grid-cols-4';

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
            <span style={{ fontSize: '0.9375rem' }}>{t('games.back')}</span>
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
            Memory Match
          </h1>
          <p style={{ fontSize: '1.0625rem', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280' }}>
            Find all the matching pairs
          </p>
        </div>

        {/* Game Board */}
        {!isComplete && (
          <div className={`grid ${gridCols} gap-4 max-w-2xl mx-auto mb-8`}>
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="aspect-square rounded-2xl transition-all"
                style={{
                  backgroundColor: card.isFlipped || card.isMatched ? (theme === 'dark' ? 'rgba(228, 220, 207, 0.15)' : 'white') : colors[currentRound],
                  boxShadow: card.isFlipped || card.isMatched 
                    ? (theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)') 
                    : (theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)'),
                  transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(0deg)',
                  opacity: card.isMatched ? 0.5 : 1,
                }}
              >
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ fontSize: '3rem' }}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : '?'}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Completion Modal */}
        {isComplete && (
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
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors[0] }}
                  >
                    <Check className="w-14 h-14 text-white" strokeWidth={3} />
                  </div>
                </div>
                
                {/* Minimal Text in CAPS */}
                <h2 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: colors[0],
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '2rem',
                  }}
                >
                  ✨ GREAT! ✨
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