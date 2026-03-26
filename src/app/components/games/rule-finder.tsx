import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Check, Star, X } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

const colors = ['#7D9D9C', '#C08B7E', '#7C8B95', '#FDB022'];

export function RuleFinder() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'logic/intermediate/rule-finder', 
    categoryId: 'logic' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [objects, setObjects] = useState<any[]>([]);
  const [rule, setRule] = useState('');
  const [options, setOptions] = useState<string[]>([]);
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
    // Pick a random rule
    const rules: Array<'color' | 'size' | 'shape'> = ['color', 'size', 'shape'];
    const selectedRule = rules[Math.floor(Math.random() * rules.length)];
    setRule(selectedRule);
    
    let ruleVal: any;
    if (selectedRule === 'color') {
      ruleVal = colors[Math.floor(Math.random() * colors.length)];
    } else if (selectedRule === 'size') {
      ruleVal = Math.random() < 0.5 ? 'small' : 'large';
    } else {
      ruleVal = Math.random() < 0.5 ? 'circle' : 'square';
    }
    
    // Create items - mix of matching and non-matching
    const itemsList: Item[] = [];
    
    // Add 3-4 matching items
    const matchCount = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < matchCount; i++) {
      itemsList.push(createItem(selectedRule, ruleVal, true));
    }
    
    // Add 3-4 non-matching items
    const nonMatchCount = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < nonMatchCount; i++) {
      itemsList.push(createItem(selectedRule, ruleVal, false));
    }
    
    setItems(itemsList.sort(() => Math.random() - 0.5));
    setSelectedItems([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const createItem = (rule: 'color' | 'size' | 'shape', ruleValue: any, shouldMatch: boolean): Item => {
    let color: string;
    let size: 'small' | 'large';
    let shape: 'circle' | 'square';
    
    if (rule === 'color') {
      color = shouldMatch ? ruleValue : colors.filter(c => c !== ruleValue)[Math.floor(Math.random() * (colors.length - 1))];
      size = Math.random() < 0.5 ? 'small' : 'large';
      shape = Math.random() < 0.5 ? 'circle' : 'square';
    } else if (rule === 'size') {
      size = shouldMatch ? ruleValue : (ruleValue === 'small' ? 'large' : 'small');
      color = colors[Math.floor(Math.random() * colors.length)];
      shape = Math.random() < 0.5 ? 'circle' : 'square';
    } else {
      shape = shouldMatch ? ruleValue : (ruleValue === 'circle' ? 'square' : 'circle');
      color = colors[Math.floor(Math.random() * colors.length)];
      size = Math.random() < 0.5 ? 'small' : 'large';
    }
    
    const svg = shape === 'circle' 
      ? <circle cx="50" cy="50" r="35" />
      : <rect x="15" y="15" width="70" height="70" rx="8" />;
    
    return { color, size, shape, svg };
  };

  const handleItemClick = (idx: number) => {
    if (showFeedback) return;
    
    if (selectedItems.includes(idx)) {
      setSelectedItems(selectedItems.filter(i => i !== idx));
    } else {
      setSelectedItems([...selectedItems, idx]);
    }
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0) return;
    
    // Check if all selected items match the rule
    const allCorrect = selectedItems.every(idx => {
      const item = items[idx];
      if (rule === 'color') return item.color === ruleValue;
      if (rule === 'size') return item.size === ruleValue;
      return item.shape === ruleValue;
    });
    
    // Check if they found all matching items
    const correctIndices = items.map((item, idx) => {
      if (rule === 'color') return item.color === ruleValue ? idx : -1;
      if (rule === 'size') return item.size === ruleValue ? idx : -1;
      return item.shape === ruleValue ? idx : -1;
    }).filter(i => i !== -1);
    
    const foundAll = correctIndices.every(i => selectedItems.includes(i));
    
    const correct = allCorrect && foundAll;
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
        completeGame(3 - stars, stars);
      }
    } else {
      setSelectedItems([]);
      setShowFeedback(false);
    }
  };

  const getRuleDescription = () => {
    if (rule === 'color') {
      const colorName = ruleValue === '#7D9D9C' ? 'GREEN' : 
                        ruleValue === '#C08B7E' ? 'ORANGE' :
                        ruleValue === '#7C8B95' ? 'BLUE' : 'YELLOW';
      return `All ${colorName} shapes`;
    } else if (rule === 'size') {
      return `All ${ruleValue.toUpperCase()} shapes`;
    } else {
      return `All ${ruleValue.toUpperCase()}S`;
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/game/logic" 
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
            FIND THE RULE! 🔍
          </h1>
          
          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            Tap all shapes that match the secret rule!
          </p>

          <div 
            className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8"
          >
            {items.map((item, idx) => {
              const isSelected = selectedItems.includes(idx);
              const itemSize = item.size === 'small' ? 16 : 24;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleItemClick(idx)}
                  className="aspect-square rounded-2xl bg-white flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    border: isSelected ? `4px solid ${item.color}` : '3px solid #e5e7eb',
                    boxShadow: isSelected 
                      ? `0 4px 16px ${item.color}60` 
                      : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <svg 
                    viewBox="0 0 100 100" 
                    className={`w-${itemSize} h-${itemSize}`}
                    style={{ 
                      fill: item.color,
                      width: item.size === 'small' ? '3rem' : '4.5rem',
                      height: item.size === 'small' ? '3rem' : '4.5rem',
                    }}
                  >
                    {item.svg}
                  </svg>
                  
                  {isSelected && (
                    <div 
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: item.color }}
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedItems.length === 0 || showFeedback}
            className="px-12 py-4 rounded-2xl text-white transition-all disabled:opacity-40"
            style={{
              backgroundColor: '#C08B7E',
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: selectedItems.length > 0 ? '0 4px 16px #C08B7E60' : 'none',
              cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            CHECK RULE! ✓
          </button>
        </div>

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
                {isCorrect ? t('games.amazing') : t('games.tryAgain')}
              </p>
              
              <p 
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                  marginBottom: '0.5rem',
                }}
              >
                {isCorrect ? 'You found the rule!' : 'Look for the pattern'}
              </p>
              
              {isCorrect && (
                <p 
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    color: '#C08B7E',
                    fontWeight: 600,
                  }}
                >
                  The rule was: {getRuleDescription()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}