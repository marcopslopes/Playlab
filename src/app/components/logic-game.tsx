import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X } from 'lucide-react';

type Shape = 'circle' | 'square' | 'triangle' | 'star';
type Color = string;

interface Pattern {
  sequence: { shape: Shape; color: Color }[];
  options: { shape: Shape; color: Color }[];
  correctIndex: number;
  rule: string;
}

const colors = {
  sage: '#7D9D9C',
  clay: '#C08B7E',
  slate: '#7C8B95',
  oat: '#E4DCCF',
};

const colorArray = [colors.sage, colors.clay, colors.slate, colors.oat];

const generatePattern = (difficulty: number): Pattern => {
  const shapes: Shape[] = ['circle', 'square', 'triangle', 'star'];
  
  // Pattern 1: Repeating shape with alternating colors
  if (difficulty === 1) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color1 = colorArray[0];
    const color2 = colorArray[1];
    
    const sequence = [
      { shape, color: color1 },
      { shape, color: color2 },
      { shape, color: color1 },
      { shape, color: color2 },
    ];
    
    const correct = { shape, color: color1 };
    const options = [
      correct,
      { shape, color: color2 },
      { shape: shapes[(shapes.indexOf(shape) + 1) % shapes.length], color: color1 },
      { shape: shapes[(shapes.indexOf(shape) + 2) % shapes.length], color: color2 },
    ].sort(() => Math.random() - 0.5);
    
    return {
      sequence,
      options,
      correctIndex: options.findIndex(opt => opt.shape === correct.shape && opt.color === correct.color),
      rule: 'Colors alternate',
    };
  }
  
  // Pattern 2: Rotating shapes with same color
  if (difficulty === 2) {
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    const startIdx = Math.floor(Math.random() * shapes.length);
    
    const sequence = [
      { shape: shapes[startIdx % shapes.length], color },
      { shape: shapes[(startIdx + 1) % shapes.length], color },
      { shape: shapes[(startIdx + 2) % shapes.length], color },
      { shape: shapes[(startIdx + 3) % shapes.length], color },
    ];
    
    const correct = { shape: shapes[(startIdx + 4) % shapes.length], color };
    const options = [
      correct,
      { shape: shapes[(startIdx + 1) % shapes.length], color },
      { shape: shapes[(startIdx + 2) % shapes.length], color: colorArray[(colorArray.indexOf(color) + 1) % colorArray.length] },
      { shape: shapes[(startIdx + 3) % shapes.length], color: colorArray[(colorArray.indexOf(color) + 2) % colorArray.length] },
    ].sort(() => Math.random() - 0.5);
    
    return {
      sequence,
      options,
      correctIndex: options.findIndex(opt => opt.shape === correct.shape && opt.color === correct.color),
      rule: 'Shapes rotate in order',
    };
  }
  
  // Pattern 3: Complex - alternating shapes and colors
  const shape1 = shapes[0];
  const shape2 = shapes[1];
  const color1 = colorArray[0];
  const color2 = colorArray[2];
  
  const sequence = [
    { shape: shape1, color: color1 },
    { shape: shape2, color: color2 },
    { shape: shape1, color: color1 },
    { shape: shape2, color: color2 },
  ];
  
  const correct = { shape: shape1, color: color1 };
  const options = [
    correct,
    { shape: shape2, color: color2 },
    { shape: shape1, color: color2 },
    { shape: shape2, color: color1 },
  ].sort(() => Math.random() - 0.5);
  
  return {
    sequence,
    options,
    correctIndex: options.findIndex(opt => opt.shape === correct.shape && opt.color === correct.color),
    rule: 'Both shape and color alternate',
  };
};

const ShapeIcon = ({ shape, color, size = 'md' }: { shape: Shape; color: Color; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 48,
    md: 72,
    lg: 96,
  };
  const s = sizeMap[size];
  
  const commonProps = {
    fill: color,
    stroke: 'none',
  };
  
  if (shape === 'circle') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" {...commonProps} />
      </svg>
    );
  }
  
  if (shape === 'square') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <rect x="15" y="15" width="70" height="70" rx="8" {...commonProps} />
      </svg>
    );
  }
  
  if (shape === 'triangle') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <path d="M50 15 L85 85 L15 85 Z" {...commonProps} />
      </svg>
    );
  }
  
  if (shape === 'star') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <path d="M50 15 L61 45 L92 45 L67 63 L78 93 L50 75 L22 93 L33 63 L8 45 L39 45 Z" {...commonProps} />
      </svg>
    );
  }
  
  return null;
};

export function LogicGame() {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(0);
  const [pattern, setPattern] = useState<Pattern>(() => generatePattern(1));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const totalRounds = 3;
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Timer
  useEffect(() => {
    if (!isTimerActive || showFeedback) return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up - auto submit
      handleSubmit();
    }
  }, [timeLeft, isTimerActive, showFeedback]);

  const handleSubmit = () => {
    if (selectedOption === null) {
      setIsCorrect(false);
    } else {
      const correct = selectedOption === pattern.correctIndex;
      setIsCorrect(correct);
      if (correct) setScore(score + 1);
    }
    setShowFeedback(true);
    setIsTimerActive(false);
  };

  const handleNext = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(currentRound + 1);
      setPattern(generatePattern(currentRound + 2));
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeLeft(30);
      setIsTimerActive(true);
    } else {
      // Game complete
      navigate('/practice');
    }
  };

  return (
    <div 
      className="min-h-screen px-6 py-8"
      style={{ 
        background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/practice" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>Back</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {/* Progress dots */}
            <div className="flex gap-2">
              {[...Array(totalRounds)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: i < currentRound ? colors.sage : i === currentRound ? colors.clay : '#d1d5db',
                  }}
                />
              ))}
            </div>
            
            {/* Timer */}
            <div 
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: timeLeft < 10 ? '#fef2f2' : '#fff',
                border: `2px solid ${timeLeft < 10 ? colors.clay : colors.sage}`,
              }}
            >
              <span 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  color: timeLeft < 10 ? colors.clay : colors.slate,
                  fontWeight: 600,
                }}
              >
                {timeLeft}s
              </span>
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
              color: '#1F2023',
            }}
          >
            Pattern Detective
          </h1>
          <p className="text-gray-600" style={{ fontSize: '1.0625rem' }}>
            What comes next in the sequence?
          </p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>
            Round {currentRound + 1} of {totalRounds}
          </p>
        </div>

        {/* Pattern Display */}
        <div 
          className="bg-white rounded-3xl p-8 mb-8"
          style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)' }}
        >
          <p 
            className="text-center mb-6 text-gray-500"
            style={{ fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            The Sequence
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            {pattern.sequence.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div 
                  className="rounded-2xl p-4 transition-transform hover:scale-105"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <ShapeIcon shape={item.shape} color={item.color} size="md" />
                </div>
              </div>
            ))}
            
            {/* Question mark */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className="rounded-2xl p-4 w-[104px] h-[104px] flex items-center justify-center"
                style={{ 
                  backgroundColor: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                }}
              >
                <span 
                  style={{ 
                    fontSize: '3rem',
                    color: '#9ca3af',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  ?
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        {!showFeedback && (
          <div className="mb-8">
            <p 
              className="text-center mb-6 text-gray-600"
              style={{ fontSize: '0.9375rem', fontWeight: 500 }}
            >
              Choose the correct answer:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pattern.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className="bg-white rounded-2xl p-6 transition-all hover:shadow-lg"
                  style={{
                    border: selectedOption === idx ? `3px solid ${colors.sage}` : '3px solid transparent',
                    boxShadow: selectedOption === idx 
                      ? '0 8px 24px rgba(125, 157, 156, 0.2)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transform: selectedOption === idx ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <div className="flex justify-center">
                    <ShapeIcon shape={option.shape} color={option.color} size="md" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div 
            className="rounded-3xl p-8 mb-8 text-center"
            style={{
              backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2',
              border: `2px solid ${isCorrect ? colors.sage : colors.clay}`,
            }}
          >
            <div className="flex justify-center mb-4">
              {isCorrect ? (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.sage }}
                >
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.clay }}
                >
                  <X className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            
            <h2 
              className="mb-2"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: isCorrect ? '#166534' : '#991b1b',
              }}
            >
              {isCorrect ? 'Great job!' : 'Not quite right'}
            </h2>
            
            <p className="mb-6" style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
              {pattern.rule}
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'white' }}>
                <ShapeIcon 
                  shape={pattern.options[pattern.correctIndex].shape} 
                  color={pattern.options[pattern.correctIndex].color} 
                  size="md" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-12 py-4 rounded-xl transition-all"
              style={{
                backgroundColor: selectedOption !== null ? colors.sage : '#d1d5db',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                opacity: selectedOption !== null ? 1 : 0.5,
                cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
                boxShadow: selectedOption !== null ? '0 4px 12px rgba(125, 157, 156, 0.3)' : 'none',
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-4 rounded-xl transition-all"
              style={{
                backgroundColor: colors.sage,
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.0625rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(125, 157, 156, 0.3)',
              }}
            >
              {currentRound < totalRounds - 1 ? 'Next Pattern' : 'Complete Session'}
            </button>
          )}
        </div>

        {/* Score */}
        {showFeedback && currentRound === totalRounds - 1 && (
          <div className="text-center mt-8">
            <p className="text-gray-600" style={{ fontSize: '0.9375rem' }}>
              Final Score: <span style={{ fontWeight: 600, color: colors.sage }}>{score}/{totalRounds}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
