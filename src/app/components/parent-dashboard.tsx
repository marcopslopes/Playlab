import { Link } from 'react-router';
import { ArrowLeft, Star, Trophy, TrendingUp, Award, Calendar, Flower2 } from 'lucide-react';
import { useSettings } from '../contexts/settings-context';
import { useProgress } from '../contexts/progress-context';
import { OutdoorBackground } from './outdoor-background';

export function ParentDashboard() {
  const { theme } = useSettings();
  const { progress } = useProgress();

  const totalGames = 81; // 9 categories × 9 games
  const maxStars = totalGames * 3; // 243 stars total
  const completionPercentage = Math.round((progress.totalGamesCompleted / totalGames) * 100);

  // Map categories from progress
  const categories = [
    { id: 'logic', name: 'Logic', emoji: '🧩' },
    { id: 'math', name: 'Math', emoji: '🔢' },
    { id: 'memory', name: 'Memory', emoji: '💡' },
    { id: 'focus', name: 'Focus', emoji: '🎯' },
    { id: 'colors', name: 'Colors', emoji: '🌈' },
    { id: 'words', name: 'Words', emoji: '📚' },
    { id: 'shapes', name: 'Shapes', emoji: '⭐' },
    { id: 'creative', name: 'Creative', emoji: '🎨' },
    { id: 'languages', name: 'Languages', emoji: '🇵🇹' },
  ];

  const categoryData = categories.map(cat => {
    const catProgress = progress.categories[cat.id] || {
      totalStars: 0,
      gamesCompleted: 0,
      totalGames: 9,
    };
    
    return {
      ...cat,
      completedGames: catProgress.gamesCompleted,
      totalGames: 9,
      earnedStars: catProgress.totalStars,
      totalStars: 27, // 9 games × 3 stars
    };
  });

  return (
    <div 
      className="min-h-screen px-6 py-8 relative overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-body)',
        backgroundColor: theme === 'dark' ? '#1F2023' : '#F5F5F0',
        color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
      }}
    >
      <OutdoorBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 transition-colors"
          style={{ 
            color: theme === 'dark' ? '#E4DCCF' : '#7C8B95',
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontSize: '0.9375rem' }}>BACK</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            Parent Dashboard 📊
          </h1>
          <p 
            style={{ 
              fontSize: '1.125rem',
              color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : 'rgba(31, 32, 35, 0.7)',
            }}
          >
            Track your child's learning journey
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div 
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Star className="w-8 h-8 mx-auto mb-2" style={{ color: '#FDB022', fill: '#FDB022' }} />
            <div 
              className="mb-1"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {progress.totalStars}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Total Stars
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
              out of {maxStars}
            </div>
          </div>

          <div 
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: '#7D9D9C' }} />
            <div 
              className="mb-1"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {progress.totalGamesCompleted}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Games Done
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
              out of {totalGames}
            </div>
          </div>

          <div 
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: '#C08B7E' }} />
            <div 
              className="mb-1"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {completionPercentage}%
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Complete
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
              overall progress
            </div>
          </div>

          <div 
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="text-4xl mb-2">🔥</div>
            <div 
              className="mb-1"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {progress.streakDays}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Day Streak
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
              keep it going!
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div 
          className="rounded-3xl p-6 mb-6"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h2 
            className="mb-6"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            Progress by Category
          </h2>

          <div className="space-y-4">
            {categoryData.map((cat) => {
              const progressPercent = Math.round((cat.completedGames / cat.totalGames) * 100);
              
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.5rem' }}>{cat.emoji}</span>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.125rem',
                          fontWeight: 600,
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div 
                          style={{ 
                            fontSize: '0.875rem',
                            color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : 'rgba(31, 32, 35, 0.7)',
                          }}
                        >
                          {cat.completedGames}/{cat.totalGames} games
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" style={{ color: '#FDB022', fill: '#FDB022' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {cat.earnedStars}/{cat.totalStars}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div 
                    className="h-3 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.1)',
                    }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: '#7D9D9C',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Companion & Garden Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Award className="w-6 h-6 mb-3" style={{ color: '#C08B7E' }} />
            <h3 
              className="mb-2"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 600,
              }}
            >
              Companion
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              {localStorage.getItem('cc-companion') || 'Not selected yet'}
            </p>
          </div>

          <div 
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Calendar className="w-6 h-6 mb-3" style={{ color: '#7D9D9C' }} />
            <h3 
              className="mb-2"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 600,
              }}
            >
              Garden Flowers
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              {Math.floor(progress.totalStars / 3)} flowers blooming 🌸
            </p>
          </div>
        </div>

        {/* Achievements */}
        {progress.achievements.length > 0 && (
          <div 
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h2 
              className="mb-6"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              Achievements ({progress.achievements.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {progress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-2xl p-4 text-center"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.08)' : 'rgba(31, 32, 35, 0.03)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.08)'}`,
                  }}
                >
                  <div className="text-4xl mb-2">{achievement.emoji}</div>
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  >
                    {achievement.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}