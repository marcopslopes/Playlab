import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useGameProgress } from '../../hooks/use-game-progress';

interface ColorItem {
  name: string;
  value: string;
  emoji: string;
}

const COLORS: ColorItem[] = [
  { name: 'RED', value: '#FF6B6B', emoji: '❤️' },
  { name: 'BLUE', value: '#4DABF7', emoji: '💙' },
  { name: 'YELLOW', value: '#FFD93D', emoji: '💛' },
  { name: 'GREEN', value: '#51CF66', emoji: '💚' },
];

export function ColorMatch() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { completeGame } = useGameProgress({ 
    gameId: 'colors/beginner/color-match', 
    categoryId: 'colors' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [options, setOptions] = useState<ColorItem[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const totalRounds = 5;
  const { message, celebrate, encourage } = useCompanionMessage();

  useEffect(() => {
    generateRound();
  }, [currentRound]);

  const generateRound = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);
    
    // Shuffle options
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
  };

  const handleColorClick = (color: ColorItem) => {
    const correct = color.name === targetColor.name;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      celebrate();
    } else {
      encourage();
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentRound < totalRounds - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        const stars = score;
        completeGame(3 - stars, stars);
      }
    }, 1200);
  };

  return (
    <div 
      className="min-h-screen px-4 py-6 relative"
      style={{ 
        fontFamily: 'var(--font-body)',
      }}
    >
      <OutdoorBackground />
      
      {/* Companion Helper */}
      <CompanionHelper message={message} position="top-right" size="medium" />
      
      <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1 }}>
        <button
          onClick={() => navigate('/game/colors')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontSize: '0.9375rem' }}>BACK</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="mb-4"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            COLOR MATCH 🎨
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">ROUND</div>
              <div 
                className="text-2xl font-bold"
                style={{ color: '#FF6B6B' }}
              >
                {currentRound + 1}/{totalRounds}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">SCORE</div>
              <div className="flex gap-1">
                {Array.from({ length: totalRounds }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{ 
                      color: i < score ? '#FDB022' : '#e5e7eb',
                      fill: i < score ? '#FDB022' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Target Color */}
        <div className="text-center mb-12">
          <p 
            className="mb-6 text-gray-600"
            style={{ fontSize: '1.125rem' }}
          >
            TAP THE COLOR:
          </p>
          
          <div 
            className="w-32 h-32 mx-auto rounded-3xl mb-4"
            style={{ 
              backgroundColor: targetColor.value,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }}
          />
          
          <div 
            className="text-6xl mb-2"
          >
            {targetColor.emoji}
          </div>
          
          <h2 
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            {targetColor.name}
          </h2>
        </div>

        {/* Color Options */}
        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
          {options.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color)}
              disabled={showFeedback}
              className="aspect-square rounded-3xl transition-all hover:scale-105"
              style={{
                backgroundColor: color.value,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                cursor: showFeedback ? 'not-allowed' : 'pointer',
                opacity: showFeedback ? 0.7 : 1,
              }}
            />
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div 
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 50 }}
          >
            <div 
              className="text-8xl"
              style={{
                animation: 'bounce 0.6s ease-in-out',
              }}
            >
              {isCorrect ? '✨' : '💭'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}