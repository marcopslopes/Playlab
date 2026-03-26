import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, RotateCw, Check, Star } from 'lucide-react';
import { useGameProgress } from '../../hooks/use-game-progress';
import { useTranslation } from '../../hooks/use-translation';

const shapes = [
  { 
    id: 'arrow',
    svg: (rotation: number) => (
      <polygon 
        points="50,20 80,50 65,50 65,80 35,80 35,50 20,50" 
        transform={`rotate(${rotation} 50 50)`}
      />
    ),
  },
  { 
    id: 'triangle',
    svg: (rotation: number) => (
      <polygon 
        points="50,25 75,70 25,70" 
        transform={`rotate(${rotation} 50 50)`}
      />
    ),
  },
];

export function ShapesRotate() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({
    gameId: 'shapes/beginner/shapes-rotate', 
    categoryId: 'shapes' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentShape, setCurrentShape] = useState(shapes[0]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stars, setStars] = useState(3);
  const [attempts, setAttempts] = useState(0);
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
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const rotations = [0, 90, 180, 270];
    const target = rotations[Math.floor(Math.random() * rotations.length)];
    
    setCurrentShape(shape);
    setTargetRotation(target);
    setCurrentRotation(0);
    setShowFeedback(false);
  };

  const handleRotate = () => {
    if (showFeedback) return;
    setCurrentRotation((currentRotation + 90) % 360);
  };

  const handleCheck = () => {
    if (showFeedback) return;
    
    const correct = currentRotation === targetRotation;
    setAttempts(attempts + 1);
    
    if (correct) {
      setShowFeedback(true);
      setTimeout(() => {
        if (currentRound < totalRounds - 1) {
          setCurrentRound(currentRound + 1);
        } else {
          // Game complete! Save progress
          completeGame(3 - stars, stars);
        }
      }, 1500);
    } else {
      if (stars > 0 && attempts >= 2) {
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
            MATCH THE SHAPE! ⭐
          </h1>
          
          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            Rotate your shape to match the target!
          </p>

          {/* Target Shape */}
          <div className="mb-8">
            <p 
              className="mb-4 text-gray-500"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
              }}
            >
              TARGET:
            </p>
            <div 
              className="inline-block p-8 rounded-3xl bg-white"
              style={{
                border: '3px solid #7D9D9C',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-32 h-32"
                style={{ fill: '#7D9D9C' }}
              >
                {currentShape.svg(targetRotation)}
              </svg>
            </div>
          </div>

          {/* Your Shape */}
          <div className="mb-8">
            <p 
              className="mb-4 text-gray-500"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
              }}
            >
              YOUR SHAPE:
            </p>
            <div 
              className="inline-block p-8 rounded-3xl bg-white"
              style={{
                border: '3px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-32 h-32 transition-all duration-300"
                style={{ fill: '#C08B7E' }}
              >
                {currentShape.svg(currentRotation)}
              </svg>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRotate}
              className="px-8 py-4 rounded-2xl transition-all hover:scale-105 flex items-center gap-3"
              style={{
                backgroundColor: '#7D9D9C20',
                color: '#7D9D9C',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: '3px solid #7D9D9C',
              }}
            >
              <RotateCw className="w-6 h-6" />
              ROTATE
            </button>

            <button
              onClick={handleCheck}
              className="px-8 py-4 rounded-2xl text-white transition-all hover:scale-105"
              style={{
                backgroundColor: '#7D9D9C',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '0 4px 16px #7D9D9C60',
              }}
            >
              CHECK! ✓
            </button>
          </div>
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
                PERFECT MATCH! ✨
              </p>
              
              <p 
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                Great rotation!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}