import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Brain, Lightbulb, Target, BookOpen, Shapes, Sparkles, Shuffle, RotateCcw, Calculator, Palette, Languages, Settings, BarChart, Flower2, Music } from 'lucide-react';
import { useSettings } from '../contexts/settings-context';
import { useTranslation } from '../hooks/use-translation';

const categories = [
  {
    id: 'logic',
    icon: Brain,
    color: '#7D9D9C',
    route: '/game/logic',
    emoji: '🧩',
  },
  {
    id: 'memory',
    icon: Lightbulb,
    color: '#C08B7E',
    route: '/game/memory',
    emoji: '💡',
  },
  {
    id: 'focus',
    icon: Target,
    color: '#7C8B95',
    route: '/game/focus',
    emoji: '🎯',
  },
  {
    id: 'words',
    icon: BookOpen,
    color: '#C08B7E',
    route: '/game/words',
    emoji: '📚',
  },
  {
    id: 'math',
    icon: Calculator,
    color: '#FDB022',
    route: '/game/math',
    emoji: '🔢',
  },
  {
    id: 'colors',
    icon: Palette,
    color: '#FF6B6B',
    route: '/game/colors',
    emoji: '🌈',
  },
  {
    id: 'shapes',
    icon: Shapes,
    color: '#7D9D9C',
    route: '/game/shapes',
    emoji: '⭐',
  },
  {
    id: 'creative',
    icon: Sparkles,
    color: '#7C8B95',
    route: '/game/creative',
    emoji: '🎨',
  },
  {
    id: 'music',
    icon: Music,
    color: '#9B59B6',
    route: '/game/music',
    emoji: '🎵',
  },
  {
    id: 'languages',
    icon: Languages,
    color: '#4A90E2',
    route: '/game/languages',
    emoji: '🇵🇹',
  },
];

export function ChoosePractice() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();

  const handleStartSession = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if (randomCategory?.route) {
      navigate(randomCategory.route);
    } else {
      alert(`${t(`categories.items.${randomCategory?.id}.title`)} games coming soon!`);
    }
  };

  const handleShuffle = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    navigate(randomCategory.route);
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('onboardingComplete');
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen px-4 sm:px-6 py-6 sm:py-8"
      style={{ 
        background: theme === 'dark' 
          ? 'linear-gradient(to bottom, #1F2023, #2A2C30)' 
          : 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/daily" 
              className="inline-flex items-center gap-2 transition-colors"
              style={{
                color: theme === 'dark' ? '#E4DCCF' : '#6b7280',
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span style={{ fontSize: '0.9375rem' }}>{t('nav.home')}</span>
            </Link>
            
            {/* Parent Controls */}
            <div className="flex items-center gap-2">
              <Link
                to="/garden"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: '#7D9D9C20',
                  color: '#7D9D9C',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                <Flower2 className="w-4 h-4" />
                <span>{t('nav.garden')}</span>
              </Link>
              
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: '#C08B7E20',
                  color: '#C08B7E',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                <BarChart className="w-4 h-4" />
                <span>{t('nav.dashboard')}</span>
              </Link>
              
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: '#7C8B9520',
                  color: '#7C8B95',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                <Settings className="w-4 h-4" />
                <span>{t('nav.settings')}</span>
              </Link>
              
              <button
                onClick={handleResetOnboarding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: '#7D9D9C20',
                  color: '#7D9D9C',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('nav.restart')}</span>
              </button>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 
              className="mb-3"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2.25rem',
                fontWeight: 600,
                color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
              }}
            >
              {t('categories.title')}
            </h1>
            <p 
              style={{ 
                fontSize: '1.0625rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
              }}
            >
              {t('categories.subtitle')}
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <button
                key={category.id}
                onClick={() => navigate(category.route)}
                className="group relative rounded-3xl p-8 text-center transition-all active:scale-95"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#fff',
                  border: '3px solid transparent',
                  boxShadow: theme === 'dark' 
                    ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.06)',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.border = `3px solid ${category.color}`;
                  e.currentTarget.style.boxShadow = `0 8px 32px ${category.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '3px solid transparent';
                  e.currentTarget.style.boxShadow = theme === 'dark'
                    ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.06)';
                }}
              >
                {/* Icon */}
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: `${category.color}20`,
                  }}
                >
                  <Icon className="w-8 h-8" style={{ color: category.color }} />
                </div>

                {/* Category Info */}
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  }}
                >
                  {t(`categories.items.${category.id}.title`)}
                </h2>

                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
                  }}
                >
                  {t(`categories.items.${category.id}.description`)}
                </p>

                {/* Coming Soon Badge */}
                {!category.route && (
                  <div 
                    className="mt-4 inline-block px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: '#f3f4f6',
                      fontSize: '0.8125rem',
                      color: '#9ca3af',
                      fontWeight: 500,
                    }}
                  >
                    {t('categories.comingSoon')}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartSession}
            className="px-12 py-4 rounded-2xl transition-all"
            style={{
              backgroundColor: '#7D9D9C',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 600,
              opacity: 1,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
            }}
          >
            {t('categories.startPractice')}
          </button>
        </div>
      </div>
    </div>
  );
}