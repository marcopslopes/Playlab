import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Brain, Lock, Star, Trophy, CheckCircle2, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/settings-context';
import { useProgress } from '../contexts/progress-context';
import { OutdoorBackground } from './outdoor-background';

interface Course {
  id: string;
  title: string;
  ageRange: string;
  description: string;
  games: Game[];
  color: string;
  locked: boolean;
  progress: number; // 0-100
  emoji: string;
}

interface Game {
  id: string;
  title: string;
  type: string;
  completed: boolean;
  stars: number; // 0-3
  locked: boolean;
  emoji: string;
}

const courses: Course[] = [
  {
    id: 'beginner',
    title: 'Pattern Explorers',
    ageRange: 'Ages 3-5',
    description: 'Learn colors, shapes, and simple patterns',
    color: '#7D9D9C',
    locked: false,
    progress: 60,
    emoji: '🌟',
    games: [
      { id: 'pattern-match', title: 'Pattern Match', type: 'Match the patterns', completed: true, stars: 3, locked: false, emoji: '🎨' },
      { id: 'color-sort', title: 'Color Fun', type: 'Sort by color', completed: true, stars: 2, locked: false, emoji: '🌈' },
      { id: 'memory-match', title: 'Memory Match', type: 'Find the pairs', completed: false, stars: 0, locked: false, emoji: '🧠' },
      { id: 'number-counting', title: 'Count 1-2-3', type: 'Tap numbers in order', completed: false, stars: 0, locked: false, emoji: '🔢' },
      { id: 'shape-find', title: 'Shape Hunt', type: 'Find matching shapes', completed: false, stars: 0, locked: true, emoji: '⭐' },
      { id: 'size-order', title: 'Size It Up', type: 'Big to small', completed: false, stars: 0, locked: true, emoji: '📏' },
    ],
  },
  {
    id: 'intermediate',
    title: 'Logic Builders',
    ageRange: 'Ages 5-7',
    description: 'Discover rules and solve puzzles',
    color: '#C08B7E',
    locked: false,
    progress: 25,
    emoji: '🚀',
    games: [
      { id: 'sequence-next', title: 'What\'s Next?', type: 'Predict sequences', completed: true, stars: 2, locked: false, emoji: '🔮' },
      { id: 'rule-finder', title: 'Rule Detective', type: 'Find the rule', completed: false, stars: 0, locked: false, emoji: '🔍' },
      { id: 'category-sort', title: 'Sort & Match', type: 'Group by type', completed: false, stars: 0, locked: true, emoji: '📦' },
      { id: 'odd-one-out', title: 'Odd One Out', type: 'Find the different one', completed: false, stars: 0, locked: true, emoji: '🎯' },
      { id: 'pattern-create', title: 'Make Patterns', type: 'Create your own', completed: false, stars: 0, locked: true, emoji: '✨' },
    ],
  },
  {
    id: 'advanced',
    title: 'Puzzle Masters',
    ageRange: 'Ages 7-9',
    description: 'Master tricky puzzles and challenges',
    color: '#7C8B95',
    locked: true,
    progress: 0,
    emoji: '🏆',
    games: [
      { id: 'multi-pattern', title: 'Super Patterns', type: 'Multiple rules', completed: false, stars: 0, locked: true, emoji: '🌟' },
      { id: 'logic-grid', title: 'Grid Master', type: 'Solve the grid', completed: false, stars: 0, locked: true, emoji: '🎲' },
      { id: 'analogy', title: 'Brain Teasers', type: 'Find connections', completed: false, stars: 0, locked: true, emoji: '🧠' },
      { id: 'deduction', title: 'Super Detective', type: 'Use clues', completed: false, stars: 0, locked: true, emoji: '🕵️' },
      { id: 'transformation', title: 'Shape Shifter', type: 'Rotate & flip', completed: false, stars: 0, locked: true, emoji: '🔄' },
    ],
  },
];

export function LogicCurriculum() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { getGameProgress, progress } = useProgress();
  const [selectedCourse, setSelectedCourse] = useState<string>('beginner');

  // Calculate real progress for courses based on actual game data
  const coursesWithProgress = useMemo(() => {
    // First pass: calculate progress for each course
    const coursesData = courses.map(course => {
      // Update games with real progress data
      const gamesWithProgress = course.games.map((game, index) => {
        const gameId = `logic/${course.id}/${game.id}`;
        const gameProgress = getGameProgress(gameId);
        
        // Determine if game is locked (progressive unlocking)
        // First 2 games are always unlocked, rest unlock after previous is completed
        let isLocked = false;
        if (index > 1) {
          const previousGameId = `logic/${course.id}/${course.games[index - 1].id}`;
          const previousProgress = getGameProgress(previousGameId);
          isLocked = !previousProgress || !previousProgress.completed;
        }
        
        return {
          ...game,
          stars: gameProgress?.stars || 0,
          completed: gameProgress?.completed || false,
          locked: isLocked,
        };
      });

      // Calculate course progress percentage
      const totalStars = gamesWithProgress.reduce((sum, game) => sum + game.stars, 0);
      const maxStars = gamesWithProgress.length * 3;
      const progressPercent = maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0;

      return {
        ...course,
        games: gamesWithProgress,
        progress: progressPercent,
        locked: course.locked, // Will update in second pass
      };
    });

    // Second pass: determine course locks based on previous course progress
    return coursesData.map((course, index) => {
      let courseLocked = course.locked;
      
      if (course.id === 'intermediate' && index > 0) {
        const beginnerProgress = coursesData[0].progress;
        courseLocked = beginnerProgress < 50;
      } else if (course.id === 'advanced' && index > 1) {
        const intermediateProgress = coursesData[1].progress;
        courseLocked = intermediateProgress < 50;
      }

      return {
        ...course,
        locked: courseLocked,
      };
    });
  }, [progress, getGameProgress]);

  const handleGameClick = (courseId: string, gameId: string, locked: boolean) => {
    if (locked) {
      return;
    }
    navigate(`/game/logic/${courseId}/${gameId}`);
  };

  return (
    <div 
      className="min-h-screen px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-body)',
        backgroundColor: theme === 'dark' ? '#1F2023' : '#F5F5F0',
        color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
      }}
    >
      <OutdoorBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/practice" 
            className="inline-flex items-center gap-2 transition-colors mb-8"
            style={{
              color: theme === 'dark' ? '#E4DCCF' : '#6b7280',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>Back to Practice</span>
          </Link>
          
          <div className="text-center">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" 
              style={{ backgroundColor: theme === 'dark' ? 'rgba(125, 157, 156, 0.2)' : '#7D9D9C20' }}
            >
              <Brain className="w-8 h-8" style={{ color: '#7D9D9C' }} />
            </div>
            <h1 
              className="mb-2"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2.25rem',
                fontWeight: 600,
                color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
              }}
            >
              Logic Courses
            </h1>
            <p 
              style={{ 
                fontSize: '1.0625rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
              }}
            >
              Choose a course to begin
            </p>
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-4">
          {coursesWithProgress.map((course) => {
            const isExpanded = selectedCourse === course.id;
            const canExpand = !course.locked;
            
            return (
              <div 
                key={course.id}
                className="rounded-3xl overflow-hidden transition-all"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#fff',
                  backdropFilter: 'blur(10px)',
                  boxShadow: theme === 'dark' 
                    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.06)',
                  opacity: course.locked ? 0.6 : 1,
                }}
              >
                {/* Course Header */}
                <button
                  onClick={() => canExpand && setSelectedCourse(isExpanded ? '' : course.id)}
                  disabled={course.locked}
                  className="w-full p-6 sm:p-7 text-left transition-colors"
                  style={{ 
                    cursor: course.locked ? 'not-allowed' : 'pointer',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!course.locked) {
                      e.currentTarget.style.backgroundColor = theme === 'dark' 
                        ? 'rgba(228, 220, 207, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 flex-1">
                      {/* Course Icon */}
                      <div 
                        className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ 
                          backgroundColor: course.locked ? '#f3f4f6' : `${course.color}20`,
                        }}
                      >
                        {course.locked ? (
                          <Lock className="w-6 h-6 text-gray-400" />
                        ) : (
                          <Brain className="w-6 h-6" style={{ color: course.color }} />
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1">
                        <h2 
                          className="mb-1"
                          style={{ 
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.375rem',
                            fontWeight: 600,
                            color: '#1F2023',
                          }}
                        >
                          {course.title}
                        </h2>
                        
                        <p className="text-gray-500 mb-1" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                          {course.ageRange}
                        </p>
                        
                        <p className="text-gray-600" style={{ fontSize: '0.9375rem' }}>
                          {course.description}
                        </p>

                        {/* Progress Bar */}
                        {course.progress > 0 && !course.locked && (
                          <div className="mt-3 max-w-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs font-semibold" style={{ color: course.color }}>{course.progress}%</span>
                            </div>
                            <div 
                              className="h-1.5 rounded-full overflow-hidden"
                              style={{ backgroundColor: '#f3f4f6' }}
                            >
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${course.progress}%`,
                                  backgroundColor: course.color,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {course.locked && (
                          <div className="mt-2 text-sm text-gray-500">
                            Complete previous course to unlock
                          </div>
                        )}
                      </div>

                      {/* Game Count */}
                      <div className="text-right">
                        <p className="text-gray-400" style={{ fontSize: '0.8125rem' }}>
                          {course.games.filter(g => g.completed).length}/{course.games.length}
                        </p>
                      </div>
                    </div>

                    {/* Expand Arrow */}
                    {!course.locked && (
                      <div className="ml-4">
                        <div 
                          className="transition-transform"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <svg 
                            className="w-5 h-5 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                {/* Games List */}
                {isExpanded && !course.locked && (
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-500 text-center mb-4" style={{ fontSize: '0.875rem' }}>
                      Click a game to start playing
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.games.map((game, idx) => (
                        <button
                          key={game.id}
                          onClick={() => handleGameClick(course.id, game.id, game.locked)}
                          disabled={game.locked}
                          className="relative p-5 rounded-2xl text-left transition-all"
                          style={{
                            backgroundColor: game.completed ? `${course.color}15` : 'white',
                            border: `2px solid ${game.locked ? '#e5e7eb' : game.completed ? course.color : '#f3f4f6'}`,
                            opacity: game.locked ? 0.5 : 1,
                            cursor: game.locked ? 'not-allowed' : 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            if (!game.locked) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.12)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!game.locked) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span 
                                  className="text-xs font-semibold px-2 py-0.5 rounded"
                                  style={{ 
                                    backgroundColor: course.color,
                                    color: 'white',
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                
                                {game.locked && (
                                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                                )}
                                
                                {game.completed && (
                                  <CheckCircle2 className="w-4 h-4" style={{ color: course.color }} />
                                )}
                              </div>
                              
                              <h3 
                                className="mb-1"
                                style={{ 
                                  fontFamily: 'var(--font-display)',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  color: '#1F2023',
                                }}
                              >
                                {game.title}
                              </h3>
                              
                              <p className="text-gray-500" style={{ fontSize: '0.8125rem' }}>
                                {game.type}
                              </p>
                            </div>

                            {/* Stars */}
                            {game.stars > 0 && (
                              <div className="flex gap-0.5">
                                {[1, 2, 3].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-4 h-4"
                                    style={{ 
                                      color: star <= game.stars ? '#FDB022' : '#e5e7eb',
                                      fill: star <= game.stars ? '#FDB022' : 'none',
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}