import { useState } from 'react';
import { useNavigate } from 'react-router';
import { OutdoorBackground } from './outdoor-background';
import { useTranslation } from '../hooks/use-translation';

interface Companion {
  id: string;
  emoji: string;
}

const companions: Companion[] = [
  { id: 'owl', emoji: '🦉' },
  { id: 'bunny', emoji: '🐰' },
  { id: 'fox', emoji: '🦊' },
  { id: 'bear', emoji: '🐻' },
  { id: 'cat', emoji: '🐱' },
  { id: 'dog', emoji: '🐶' },
];

export function CompanionSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(null);
  const [hoveredCompanion, setHoveredCompanion] = useState<string | null>(null);

  const handleSelectCompanion = () => {
    if (!selectedCompanion) return;

    const companion = companions.find(c => c.id === selectedCompanion);
    if (companion) {
      localStorage.setItem('userCompanion', JSON.stringify({
        id: companion.id,
        name: t(`companion.companions.${companion.id}.name`),
        emoji: companion.emoji,
        personality: t(`companion.companions.${companion.id}.personality`),
      }));
      localStorage.setItem('hasSeenCompanionSelection', 'true');
      navigate('/daily');
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden px-4 py-8"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <OutdoorBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✨</div>
          <h1 
            className="mb-3"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            {t('companion.chooseTitle')}
          </h1>
          <p 
            style={{ 
              fontSize: '1.25rem',
              color: '#6b7280',
            }}
          >
            {t('companion.chooseSubtitle')}
          </p>
        </div>

        {/* Companion Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {companions.map((companion) => {
            const isSelected = selectedCompanion === companion.id;
            const isHovered = hoveredCompanion === companion.id;
            
            return (
              <button
                key={companion.id}
                onClick={() => setSelectedCompanion(companion.id)}
                onMouseEnter={() => setHoveredCompanion(companion.id)}
                onMouseLeave={() => setHoveredCompanion(null)}
                className="relative p-6 rounded-3xl transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? '#7D9D9C' : 'rgba(255, 255, 255, 0.9)',
                  transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isSelected 
                    ? '0 12px 40px rgba(125, 157, 156, 0.4)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  border: isSelected ? '3px solid #7D9D9C' : '3px solid transparent',
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div 
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#7D9D9C',
                      boxShadow: '0 4px 12px rgba(125, 157, 156, 0.4)',
                    }}
                  >
                    <span className="text-2xl">✓</span>
                  </div>
                )}

                <div 
                  className="text-7xl mb-4 transition-transform duration-300"
                  style={{
                    transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                  }}
                >
                  {companion.emoji}
                </div>
                
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: isSelected ? 'white' : '#1F2023',
                    textTransform: 'uppercase',
                  }}
                >
                  {t(`companion.companions.${companion.id}.name`)}
                </h3>

                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: isSelected ? 'rgba(255, 255, 255, 0.9)' : '#6b7280',
                  }}
                >
                  {t(`companion.companions.${companion.id}.personality`)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleSelectCompanion}
            disabled={!selectedCompanion}
            className="px-12 py-5 rounded-2xl transition-all duration-300"
            style={{
              backgroundColor: selectedCompanion ? '#7D9D9C' : '#cbd5e0',
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: selectedCompanion 
                ? '0 8px 24px rgba(125, 157, 156, 0.4)' 
                : 'none',
              cursor: selectedCompanion ? 'pointer' : 'not-allowed',
              transform: selectedCompanion ? 'scale(1)' : 'scale(0.95)',
              opacity: selectedCompanion ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (selectedCompanion) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCompanion) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {t('companion.selectButton')}
          </button>
          
          {!selectedCompanion && (
            <p 
              className="mt-4"
              style={{ 
                fontSize: '0.9375rem',
                color: '#9ca3af',
              }}
            >
              Choose a friend to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}