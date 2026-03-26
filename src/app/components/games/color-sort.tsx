import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

const colors = {
  red: { hex: '#C08B7E', name: 'Red' },
  blue: { hex: '#7D9D9C', name: 'Blue' },
  yellow: { hex: '#E4DCCF', name: 'Yellow' },
};

interface Item {
  id: string;
  color: keyof typeof colors;
  placed: boolean;
}

export function ColorSort() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'logic/beginner/color-sort', 
    categoryId: 'logic' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [buckets, setBuckets] = useState<Record<string, string[]>>({
    red: [],
    blue: [],
    yellow: [],
  });
  const [stars, setStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const totalRounds = getRoundsForLevel('beginner'); // Beginner course = 3 rounds
  const { message, celebrate } = useCompanionMessage();

  useEffect(() => {
    generateRound();
  }, [currentRound]);

  const generateRound = () => {
    const difficulty = currentRound + 2; // 2, 3, 4 items per color
    const colorKeys = Object.keys(colors) as (keyof typeof colors)[];
    
    const newItems: Item[] = [];
    colorKeys.forEach((color) => {
      for (let i = 0; i < difficulty; i++) {
        newItems.push({
          id: `${color}-${i}`,
          color,
          placed: false,
        });
      }
    });
    
    // Shuffle items
    setItems(newItems.sort(() => Math.random() - 0.5));
    setBuckets({ red: [], blue: [], yellow: [] });
    setIsComplete(false);
    setMistakes(0);
  };

  const handleItemClick = (item: Item) => {
    if (item.placed) return;
    
    // Place in correct bucket (for this simple version, auto-place correctly)
    const newBuckets = { ...buckets };
    newBuckets[item.color].push(item.id);
    setBuckets(newBuckets);
    
    setItems(items.map(i => i.id === item.id ? { ...i, placed: true } : i));
    
    // Check if complete
    const allPlaced = items.every(i => i.id === item.id || i.placed);
    if (allPlaced) {
      setIsComplete(true);
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
            Color Sorting
          </h1>
          <p style={{ fontSize: '1.0625rem', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280' }}>
            Sort each color into its bucket
          </p>
        </div>

        {/* Buckets */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {(Object.keys(colors) as (keyof typeof colors)[]).map((colorKey) => (
            <div
              key={colorKey}
              className="rounded-3xl p-5 text-center min-h-[220px] flex flex-col"
              style={{
                backgroundColor: theme === 'dark' ? `${colors[colorKey].hex}15` : `${colors[colorKey].hex}20`,
                border: `2px dashed ${colors[colorKey].hex}`,
              }}
            >
              <p 
                className="mb-4"
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: colors[colorKey].hex,
                }}
              >
                {colors[colorKey].name}
              </p>
              
              <div className="flex flex-col gap-2 flex-1">
                {buckets[colorKey].map((itemId) => (
                  <div
                    key={itemId}
                    className="rounded-xl h-12"
                    style={{ backgroundColor: colors[colorKey].hex }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Items to Sort */}
        {!isComplete && (
          <div>
            <p 
              className="text-center mb-6"
              style={{ fontSize: '0.9375rem', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280' }}
            >
              Tap each item to sort it
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {items.filter(item => !item.placed).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="rounded-2xl transition-all hover:scale-105"
                  style={{
                    width: 70,
                    height: 70,
                    backgroundColor: colors[item.color].hex,
                    boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
              ))}
            </div>
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
                    style={{ backgroundColor: colors.blue.hex }}
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
                    color: colors.blue.hex,
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
                    backgroundColor: colors.blue.hex,
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