import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { useGameProgress } from '../../hooks/use-game-progress';
import { useTranslation } from '../../hooks/use-translation';

const colors = ['#7D9D9C', '#C08B7E', '#7C8B95', '#FDB022'];

interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
  isTarget: boolean;
}

export function FocusTap() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'focus/beginner/focus-tap', 
    categoryId: 'focus' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [targetColor, setTargetColor] = useState('');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const totalRounds = 5;

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (currentRound > 0 && currentRound < totalRounds) {
      setTimeout(() => generateRound(), 800);
    } else if (currentRound === totalRounds) {
      // Game complete! Save progress
      const finalStars = stars - Math.floor(mistakes / 2);
      setTimeout(() => completeGame(mistakes, Math.max(0, finalStars)), 2000);
    }
  }, [currentRound]);

  const generateRound = () => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(target);
    
    // Create 8-12 bubbles
    const bubbleCount = 8 + Math.floor(Math.random() * 5);
    const newBubbles: Bubble[] = [];
    
    // Add 2-3 target bubbles
    const targetCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < targetCount; i++) {
      newBubbles.push({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        color: target,
        isTarget: true,
      });
    }
    
    // Fill with other colors
    while (newBubbles.length < bubbleCount) {
      const otherColors = colors.filter(c => c !== target);
      newBubbles.push({
        id: newBubbles.length,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        color: otherColors[Math.floor(Math.random() * otherColors.length)],
        isTarget: false,
      });
    }
    
    setBubbles(newBubbles);
  };

  const handleBubbleClick = (bubble: Bubble) => {
    if (bubble.isTarget) {
      // Correct!
      setScore(score + 1);
      setBubbles(bubbles.filter(b => b.id !== bubble.id));
      
      // Check if all targets found
      const remainingTargets = bubbles.filter(b => b.isTarget && b.id !== bubble.id);
      if (remainingTargets.length === 0) {
        setCurrentRound(currentRound + 1);
      }
    } else {
      // Wrong!
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      if (newMistakes >= 3 && stars > 0) {
        setStars(stars - 1);
      }
    }
  };

  const getColorName = (color: string) => {
    if (color === '#7D9D9C') return 'GREEN';
    if (color === '#C08B7E') return 'ORANGE';
    if (color === '#7C8B95') return 'BLUE';
    return 'YELLOW';
  };

  return (
    <div 
      className="min-h-screen px-4 sm:px-6 py-6 sm:py-8"
      style={{ 
        background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-4xl mx-auto">
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
                    backgroundColor: round <= currentRound + 1 ? '#7C8B95' : '#e5e7eb',
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

        {currentRound < totalRounds ? (
          <>
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
                TAP ONLY {getColorName(targetColor)}! 🎯
              </h1>
              
              <p 
                className="mb-4 text-gray-600"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.125rem',
                }}
              >
                Find and tap all the {getColorName(targetColor).toLowerCase()} bubbles!
              </p>

              <div 
                className="inline-block px-6 py-3 rounded-2xl"
                style={{
                  backgroundColor: targetColor,
                  boxShadow: `0 4px 16px ${targetColor}60`,
                }}
              >
                <p 
                  className="text-white"
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                  }}
                >
                  {getColorName(targetColor)}
                </p>
              </div>
            </div>

            <div 
              className="relative bg-white rounded-3xl overflow-hidden"
              style={{
                height: '500px',
                border: '3px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              {bubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  onClick={() => handleBubbleClick(bubble)}
                  className="absolute rounded-full transition-all hover:scale-110"
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: '60px',
                    height: '60px',
                    backgroundColor: bubble.color,
                    border: '3px solid white',
                    boxShadow: `0 4px 12px ${bubble.color}60`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>
          </>
        ) : (
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
                🎯 GREAT FOCUS! 🎯
              </p>
              
              <p 
                className="mt-4"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                {t('games.score')}: {score}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}