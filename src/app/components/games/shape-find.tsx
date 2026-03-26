import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useGameProgress } from '../../hooks/use-game-progress';
import { useTranslation } from '../../hooks/use-translation';

const shapes = [
  { 
    id: 'circle', 
    name: 'CIRCLE', 
    emoji: '⭕',
    svg: <circle cx="50" cy="50" r="35" />,
  },
  { 
    id: 'square', 
    name: 'SQUARE', 
    emoji: '🟦',
    svg: <rect x="15" y="15" width="70" height="70" rx="8" />,
  },
  { 
    id: 'triangle', 
    name: 'TRIANGLE', 
    emoji: '🔺',
    svg: <polygon points="50,20 85,80 15,80" />,
  },
  { 
    id: 'star', 
    name: 'STAR', 
    emoji: '⭐',
    svg: <path d="M50,15 L58,38 L82,38 L63,53 L71,76 L50,61 L29,76 L37,53 L18,38 L42,38 Z" />,
  },
];

const colors = ['#7D9D9C', '#C08B7E', '#7C8B95', '#FDB022'];

export function ShapeFind() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({
    gameId: 'logic/beginner/shape-find', 
    categoryId: 'logic' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [targetShape, setTargetShape] = useState(shapes[0]);
  const [options, setOptions] = useState<typeof shapes>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stars, setStars] = useState(3);
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
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(target);
    
    // Create 6-9 shapes including the correct one
    const gridSize = 6 + Math.floor(Math.random() * 4); // 6-9 shapes
    const optionsList = [];
    
    // Add target shape 1-2 times
    const targetCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < targetCount; i++) {
      optionsList.push({ ...target, uniqueId: `target-${i}` });
    }
    
    // Fill rest with other shapes
    while (optionsList.length < gridSize) {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      optionsList.push({ ...randomShape, uniqueId: `${randomShape.id}-${optionsList.length}` });
    }
    
    // Shuffle
    setOptions(optionsList.sort(() => Math.random() - 0.5));
    setShowFeedback(false);
  };

  const handleShapeClick = (shapeId: string) => {
    if (showFeedback) return;
    
    const correct = shapeId === targetShape.id;
    
    if (correct) {
      setShowFeedback(true);
      
      if (currentRound < totalRounds - 1) {
        setTimeout(() => {
          setCurrentRound(currentRound + 1);
        }, 1200);
      } else {
        // Game complete
        setTimeout(() => {
          completeGame(3 - stars, stars);
        }, 1200);
      }
    } else {
      // Wrong answer - lose a star
      if (stars > 0) {
        setStars(stars - 1);
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
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/game/logic" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>{t('games.back')}</span>
          </Link>

          {/* Progress & Stars */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((round) => (
                <div
                  key={round}
                  className="w-12 h-2 rounded-full"
                  style={{
                    backgroundColor: round <= currentRound + 1 ? '#7D9D9C' : '#e5e7eb',
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

        {/* Game Content */}
        <div className="text-center mb-8">
          <h1 
            className="mb-6"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            FIND THE {targetShape.name}! {targetShape.emoji}
          </h1>

          {/* Target Shape Display */}
          <div className="mb-8">
            <div 
              className="inline-block p-8 rounded-3xl bg-white"
              style={{
                border: '4px solid #7D9D9C',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-24 h-24"
                style={{ fill: '#7D9D9C' }}
              >
                {targetShape.svg}
              </svg>
            </div>
          </div>

          {/* Shapes Grid */}
          <div 
            className="grid gap-4 max-w-2xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(options.length))}, 1fr)`,
            }}
          >
            {options.map((shape) => {
              const shapeColor = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <button
                  key={shape.uniqueId}
                  onClick={() => handleShapeClick(shape.id)}
                  className="aspect-square rounded-2xl bg-white transition-all hover:scale-105"
                  style={{
                    border: '3px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-full h-full p-3"
                    style={{ fill: shapeColor }}
                  >
                    {shape.svg}
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Feedback Modal */}
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
                YES! ✨
              </p>
              
              <p 
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                You found it!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}