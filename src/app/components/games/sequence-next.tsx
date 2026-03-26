import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

const colors = ['#7D9D9C', '#C08B7E', '#7C8B95', '#FDB022'];

const shapes = [
  { svg: <circle cx="50" cy="50" r="35" />, id: 'circle', emoji: '⭕' },
  { svg: <rect x="15" y="15" width="70" height="70" rx="8" />, id: 'square', emoji: '🟦' },
  { svg: <polygon points="50,20 85,80 15,80" />, id: 'triangle', emoji: '🔺' },
];

interface SequenceItem {
  type: 'color' | 'shape' | 'number';
  value: any;
}

export function SequenceNext() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'logic/intermediate/sequence-next', 
    categoryId: 'logic' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [options, setOptions] = useState<SequenceItem[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<SequenceItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(3);
  const totalRounds = getRoundsForLevel('intermediate'); // Intermediate course = 4 rounds

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (currentRound > 0 && currentRound < totalRounds) {
      setTimeout(() => generateRound(), 600);
    }
  }, [currentRound]);

  const generateRound = () => {
    const sequenceType = Math.random() < 0.5 ? 'color' : 'shape';
    
    if (sequenceType === 'color') {
      // Repeating color pattern like: red, blue, red, blue, ?
      const colorA = colors[Math.floor(Math.random() * colors.length)];
      let colorB = colors[Math.floor(Math.random() * colors.length)];
      while (colorB === colorA) {
        colorB = colors[Math.floor(Math.random() * colors.length)];
      }
      
      const pattern = [colorA, colorB, colorA, colorB];
      const answer = colorA;
      
      setSequence(pattern.map(c => ({ type: 'color', value: c })));
      setCorrectAnswer({ type: 'color', value: answer });
      
      // Create options
      const wrongColors = colors.filter(c => c !== answer);
      setOptions([
        { type: 'color', value: answer },
        { type: 'color', value: wrongColors[0] },
        { type: 'color', value: wrongColors[1] },
      ].sort(() => Math.random() - 0.5));
      
    } else {
      // Repeating shape pattern
      const shapeA = shapes[Math.floor(Math.random() * shapes.length)];
      let shapeB = shapes[Math.floor(Math.random() * shapes.length)];
      while (shapeB.id === shapeA.id) {
        shapeB = shapes[Math.floor(Math.random() * shapes.length)];
      }
      
      const pattern = [shapeA, shapeB, shapeA, shapeB];
      const answer = shapeA;
      
      setSequence(pattern.map(s => ({ type: 'shape', value: s })));
      setCorrectAnswer({ type: 'shape', value: answer });
      
      // Create options
      setOptions([
        { type: 'shape', value: answer },
        ...shapes.filter(s => s.id !== answer.id).map(s => ({ type: 'shape', value: s })),
      ].sort(() => Math.random() - 0.5));
    }
    
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleOptionClick = (idx: number) => {
    if (showFeedback) return;
    
    setSelectedOption(idx);
    
    const selected = options[idx];
    let correct = false;
    
    if (selected.type === 'color') {
      correct = selected.value === correctAnswer?.value;
    } else {
      correct = selected.value.id === correctAnswer?.value.id;
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (!correct && stars > 0) {
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
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const renderSequenceItem = (item: SequenceItem, idx: number) => {
    if (item.type === 'color') {
      return (
        <div
          key={idx}
          className="w-20 h-20 rounded-2xl"
          style={{
            backgroundColor: item.value,
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        />
      );
    } else {
      return (
        <div
          key={idx}
          className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center"
          style={{
            border: '3px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <svg 
            viewBox="0 0 100 100" 
            className="w-14 h-14"
            style={{ fill: '#C08B7E' }}
          >
            {item.value.svg}
          </svg>
        </div>
      );
    }
  };

  const renderOption = (item: SequenceItem, idx: number) => {
    const isSelected = selectedOption === idx;
    
    if (item.type === 'color') {
      return (
        <button
          key={idx}
          onClick={() => handleOptionClick(idx)}
          className="w-24 h-24 rounded-2xl transition-all hover:scale-105"
          style={{
            backgroundColor: item.value,
            border: isSelected ? '4px solid #1F2023' : '3px solid white',
            boxShadow: isSelected 
              ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        />
      );
    } else {
      return (
        <button
          key={idx}
          onClick={() => handleOptionClick(idx)}
          className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center transition-all hover:scale-105"
          style={{
            border: isSelected ? '4px solid #1F2023' : '3px solid #e5e7eb',
            boxShadow: isSelected 
              ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <svg 
            viewBox="0 0 100 100" 
            className="w-16 h-16"
            style={{ fill: '#C08B7E' }}
          >
            {item.value.svg}
          </svg>
        </button>
      );
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
            WHAT COMES NEXT? 🔮
          </h1>
          
          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            Look at the pattern and pick what comes next!
          </p>

          {/* Sequence Display */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 p-6 rounded-3xl bg-white"
              style={{
                border: '3px solid #C08B7E40',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              {sequence.map((item, idx) => renderSequenceItem(item, idx))}
              
              {/* Question Mark */}
              <div 
                className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center"
                style={{
                  border: '3px dashed #C08B7E',
                }}
              >
                <span 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#C08B7E',
                  }}
                >
                  ?
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <p 
            className="mb-4 text-gray-500"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            TAP YOUR ANSWER:
          </p>
          
          <div className="flex items-center justify-center gap-6">
            {options.map((item, idx) => renderOption(item, idx))}
          </div>
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
                  <X className="w-12 h-12" style={{ color: '#FF6B6B' }} strokeWidth={3} />
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
                {isCorrect ? t('games.correct') : t('games.tryAgain')}
              </p>
              
              <p 
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                {isCorrect ? 'You found the pattern!' : 'Look at the pattern again'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}