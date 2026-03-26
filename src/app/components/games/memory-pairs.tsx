import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { useGameProgress } from '../../hooks/use-game-progress';

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryPairs() {
  const navigate = useNavigate();
  const { completeGame } = useGameProgress({ 
    gameId: 'memory/beginner/memory-pairs', 
    categoryId: 'memory' 
  });
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [stars, setStars] = useState(3);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Use 6 pairs for kids
    const selectedEmojis = emojis.slice(0, 6);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    const shuffled = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setStars(3);
    setIsComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(id)) return;
    if (cards[id].isMatched) return;
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    
    setCards(cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // Match!
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true } 
              : card
          ));
          setFlippedCards([]);
          
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);
          
          if (newMatchedPairs === 6) {
            setIsComplete(true);
            // Calculate stars based on moves
            const finalStars = moves < 12 ? 3 : moves < 18 ? 2 : 1;
            setTimeout(() => completeGame(3 - finalStars, finalStars), 2000);
          }
        }, 600);
      } else {
        // No match - lose star if needed
        if (moves >= 8 && stars === 3) setStars(2);
        if (moves >= 15 && stars === 2) setStars(1);
        
        setTimeout(() => {
          setCards(cards.map(card => 
            newFlipped.includes(card.id) 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
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
            <span style={{ fontSize: '0.9375rem' }}>BACK</span>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p 
                className="text-gray-500"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                }}
              >
                Moves: {moves}
              </p>
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
            FIND THE PAIRS! 💡
          </h1>
          
          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            Tap cards to find matching animals!
          </p>

          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="aspect-square rounded-2xl transition-all hover:scale-105"
                style={{
                  backgroundColor: card.isFlipped || card.isMatched ? '#C08B7E' : 'white',
                  border: '3px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  cursor: card.isMatched ? 'default' : 'pointer',
                  opacity: card.isMatched ? 0.6 : 1,
                }}
              >
                {(card.isFlipped || card.isMatched) && (
                  <div style={{ fontSize: '3rem' }}>{card.emoji}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {isComplete && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div 
              className="bg-white rounded-3xl p-12 text-center max-w-md mx-4"
              style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
            >
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#1F2023',
                  textTransform: 'uppercase',
                }}
              >
                ✨ YOU WIN! ✨
              </p>
              
              <p 
                className="mt-4"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                {moves} moves!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}