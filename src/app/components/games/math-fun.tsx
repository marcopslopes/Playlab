import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { useGameProgress } from '../../hooks/use-game-progress';
import { useTranslation } from '../../hooks/use-translation';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
  options: number[];
}

export function MathFun() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'math/beginner/math-fun', 
    categoryId: 'math' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const totalRounds = 5;

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (currentRound > 0 && currentRound < totalRounds) {
      setTimeout(() => generateQuestion(), 1000);
    }
  }, [currentRound]);

  const generateQuestion = () => {
    // Start with easier numbers for young kids
    const maxNumber = currentRound < 2 ? 5 : 10;
    const num1 = 1 + Math.floor(Math.random() * maxNumber);
    
    // Use addition more for younger rounds
    const useAddition = currentRound < 3 ? Math.random() > 0.3 : Math.random() > 0.5;
    
    let num2, operator: '+' | '-', answer;
    
    if (useAddition) {
      num2 = 1 + Math.floor(Math.random() * maxNumber);
      operator = '+';
      answer = num1 + num2;
    } else {
      // For subtraction, ensure num1 >= num2 (no negative results)
      num2 = 1 + Math.floor(Math.random() * Math.min(num1, maxNumber));
      operator = '-';
      answer = num1 - num2;
    }
    
    // Generate options (3 wrong answers + 1 correct)
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = Math.max(0, answer + (Math.floor(Math.random() * 6) - 3));
      if (!options.includes(wrongAnswer) && wrongAnswer >= 0 && wrongAnswer <= 20) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    setQuestion({ num1, num2, operator, answer, options });
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleAnswerClick = (answer: number) => {
    if (showFeedback || !question) return;
    
    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTimeout(() => {
        if (currentRound < totalRounds - 1) {
          setCurrentRound(currentRound + 1);
        } else {
          // Game complete! Save progress
          completeGame(mistakes, stars);
        }
      }, 1200);
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      if (newMistakes >= 3 && stars > 0) {
        setStars(stars - 1);
      }
      
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  if (!question) return null;

  // Generate visual dots for small numbers
  const renderDots = (num: number) => {
    if (num > 10) return null;
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: num }).map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#7D9D9C' }}
          />
        ))}
      </div>
    );
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
                    backgroundColor: round <= currentRound + 1 ? '#FDB022' : '#e5e7eb',
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
            MATH TIME! 🔢
          </h1>
          
          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            What's the answer?
          </p>

          {/* Math Problem */}
          <div 
            className="mb-8 p-8 bg-white rounded-3xl"
            style={{
              border: '3px solid #FDB022',
              boxShadow: '0 4px 16px rgba(253, 176, 34, 0.2)',
            }}
          >
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '4rem',
                    fontWeight: 700,
                    color: '#1F2023',
                  }}
                >
                  {question.num1}
                </p>
                {renderDots(question.num1)}
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  fontWeight: 700,
                  color: '#FDB022',
                }}
              >
                {question.operator}
              </p>

              <div className="text-center">
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '4rem',
                    fontWeight: 700,
                    color: '#1F2023',
                  }}
                >
                  {question.num2}
                </p>
                {renderDots(question.num2)}
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  fontWeight: 700,
                  color: '#7C8B95',
                }}
              >
                =
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  fontWeight: 700,
                  color: '#C08B7E',
                }}
              >
                ?
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isWrong = showFeedback && isSelected && !isCorrect;
              const isRight = showFeedback && option === question.answer;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(option)}
                  disabled={showFeedback}
                  className="p-6 rounded-2xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: isRight 
                      ? '#95E1D3' 
                      : isWrong 
                      ? '#FF6B6B' 
                      : 'white',
                    border: isSelected 
                      ? '4px solid #FDB022' 
                      : '3px solid #e5e7eb',
                    boxShadow: isSelected 
                      ? '0 4px 16px rgba(253, 176, 34, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    cursor: showFeedback ? 'default' : 'pointer',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '3rem',
                      fontWeight: 700,
                      color: isRight || isWrong ? 'white' : '#1F2023',
                    }}
                  >
                    {option}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="mt-8">
              {isCorrect ? (
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#95E1D3',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('games.correct')}
                </p>
              ) : (
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#FF6B6B',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('games.tryAgain')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}