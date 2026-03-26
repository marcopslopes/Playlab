import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';

const shapes = [
  { svg: <circle cx="50" cy="50" r="35" />, emoji: '⭕' },
  { svg: <rect x="15" y="15" width="70" height="70" rx="8" />, emoji: '🟦' },
  { svg: <polygon points="50,20 85,80 15,80" />, emoji: '🔺' },
  { svg: <path d="M50,15 L58,38 L82,38 L63,53 L71,76 L50,61 L29,76 L37,53 L18,38 L42,38 Z" />, emoji: '⭐' },
];

const colors = ['#7D9D9C', '#C08B7E', '#7C8B95', '#FDB022'];

interface SizedShape {
  id: number;
  size: number;
  correctOrder: number;
}

export function SizeOrder() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'logic/beginner/size-order', 
    categoryId: 'logic' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [shapeType, setShapeType] = useState(shapes[0]);
  const [items, setItems] = useState<SizedShape[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(3);
  const [shapeColor, setShapeColor] = useState(colors[0]);
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
    // Random shape and color
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setShapeType(shape);
    setShapeColor(color);
    
    // Create 3-4 items with different sizes
    const count = 3 + Math.floor(Math.random() * 2); // 3 or 4 items
    const sizes = [];
    
    // Generate distinct sizes
    for (let i = 0; i < count; i++) {
      sizes.push(60 + (i * 40)); // 60, 100, 140, 180
    }
    
    // Create items and shuffle
    const itemsList = sizes.map((size, idx) => ({
      id: idx,
      size,
      correctOrder: idx,
    }));
    
    setItems(itemsList.sort(() => Math.random() - 0.5));
    setSelectedItems([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleItemClick = (id: number) => {
    if (showFeedback) return;
    
    if (selectedItems.includes(id)) {
      // Deselect
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      // Select
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSubmit = () => {
    if (selectedItems.length !== items.length) return;
    
    // Check if order is correct (biggest to smallest)
    const orderedItems = selectedItems.map(id => items.find(item => item.id === id)!);
    const isOrderCorrect = orderedItems.every((item, idx) => {
      if (idx === 0) return true;
      return item.size < orderedItems[idx - 1].size;
    });
    
    setIsCorrect(isOrderCorrect);
    setShowFeedback(true);
    
    if (!isOrderCorrect && stars > 0) {
      setStars(stars - 1);
    }
  };

  const handleContinue = () => {
    if (isCorrect) {
      if (currentRound < totalRounds - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        // Game complete
        completeGame(3 - stars, stars);
      }
    } else {
      // Try again
      setSelectedItems([]);
      setShowFeedback(false);
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
            className="mb-3"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            TAP FROM BIG TO SMALL! 📏
          </h1>
          
          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            Tap the shapes in order: BIGGEST first, SMALLEST last
          </p>

          {/* Shapes */}
          <div className="flex items-end justify-center gap-6 mb-8 min-h-[300px] items-center">
            {items.map((item) => {
              const selectionIndex = selectedItems.indexOf(item.id);
              const isSelected = selectionIndex !== -1;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="relative transition-all hover:scale-105"
                  style={{
                    opacity: showFeedback ? 0.5 : 1,
                    pointerEvents: showFeedback ? 'none' : 'auto',
                  }}
                >
                  {/* Selection Number Badge */}
                  {isSelected && (
                    <div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
                      style={{
                        backgroundColor: shapeColor,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <span 
                        className="text-white"
                        style={{ 
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                        }}
                      >
                        {selectionIndex + 1}
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className="rounded-2xl bg-white flex items-center justify-center"
                    style={{
                      width: item.size,
                      height: item.size,
                      border: isSelected ? `4px solid ${shapeColor}` : '3px solid #e5e7eb',
                      boxShadow: isSelected 
                        ? `0 4px 16px ${shapeColor}60` 
                        : '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <svg 
                      viewBox="0 0 100 100" 
                      style={{ 
                        width: item.size * 0.6,
                        height: item.size * 0.6,
                        fill: isSelected ? shapeColor : '#D1D5DB',
                      }}
                    >
                      {shapeType.svg}
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={selectedItems.length !== items.length || showFeedback}
            className="px-12 py-4 rounded-2xl text-white transition-all disabled:opacity-40"
            style={{
              backgroundColor: shapeColor,
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: selectedItems.length === items.length 
                ? `0 4px 16px ${shapeColor}60` 
                : 'none',
              cursor: selectedItems.length === items.length ? 'pointer' : 'not-allowed',
            }}
          >
            CHECK! ✓
          </button>
        </div>

        {/* Feedback Modal */}
        {showFeedback && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleContinue}
          >
            <div 
              className="bg-white rounded-3xl p-12 text-center max-w-md mx-4"
              style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
            >
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: isCorrect ? '#95E1D320' : '#FF6B6B20' }}
              >
                {isCorrect ? (
                  <Check className="w-12 h-12" style={{ color: '#95E1D3' }} strokeWidth={3} />
                ) : (
                  <span style={{ fontSize: '3rem' }}>😅</span>
                )}
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
                {isCorrect ? t('games.wellDone') : t('games.tryAgain')}
              </p>
              
              <p 
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                {isCorrect ? 'You got it right!' : 'Tap to try again'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}