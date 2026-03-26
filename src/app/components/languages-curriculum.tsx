import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Languages, Lock, Star, Trophy, CheckCircle2, Volume2 } from 'lucide-react';
import { useSettings } from '../contexts/settings-context';
import { OutdoorBackground } from './outdoor-background';
import { CompanionHelper } from './companion-helper';

interface Course {
  id: string;
  title: string;
  ageRange: string;
  description: string;
  games: Game[];
  color: string;
  locked: boolean;
  progress: number;
  emoji: string;
}

interface Game {
  id: string;
  title: string;
  type: string;
  completed: boolean;
  stars: number;
  locked: boolean;
  emoji: string;
}

const courses: Course[] = [
  {
    id: 'beginner',
    title: 'First Words',
    ageRange: 'Ages 3-5',
    description: 'Learn everyday Portuguese objects',
    color: '#4A90E2',
    locked: false,
    progress: 0,
    emoji: '🇵🇹',
    games: [
      { id: 'object-match', title: 'Object Match', type: 'Match pictures & words', completed: false, stars: 0, locked: false, emoji: '📦' },
      { id: 'animal-names', title: 'Animal Names', type: 'Learn animal words', completed: false, stars: 0, locked: false, emoji: '🐱' },
      { id: 'food-fun', title: 'Food Fun', type: 'Everyday food words', completed: false, stars: 0, locked: true, emoji: '🍎' },
      { id: 'color-words', title: 'Color Words', type: 'Portuguese colors', completed: false, stars: 0, locked: true, emoji: '🎨' },
      { id: 'number-count', title: 'Count 1-10', type: 'Numbers in Portuguese', completed: false, stars: 0, locked: true, emoji: '🔢' },
    ],
  },
  {
    id: 'intermediate',
    title: 'Word Builders',
    ageRange: 'Ages 5-7',
    description: 'Expand vocabulary with categories',
    color: '#5BA3F5',
    locked: false,
    progress: 0,
    emoji: '📚',
    games: [
      { id: 'home-objects', title: 'At Home', type: 'Household items', completed: false, stars: 0, locked: false, emoji: '🏠' },
      { id: 'nature-words', title: 'In Nature', type: 'Plants & outdoors', completed: false, stars: 0, locked: true, emoji: '🌿' },
      { id: 'body-parts', title: 'Body Parts', type: 'Learn body words', completed: false, stars: 0, locked: true, emoji: '👋' },
      { id: 'action-verbs', title: 'Action Time', type: 'Simple verbs', completed: false, stars: 0, locked: true, emoji: '🏃' },
    ],
  },
  {
    id: 'advanced',
    title: 'Fluent Explorers',
    ageRange: 'Ages 7-9',
    description: 'Build sentences and cultural knowledge',
    color: '#6BB6FF',
    locked: false,
    progress: 0,
    emoji: '🌍',
    games: [
      { id: 'sentence-build', title: 'Make Sentences', type: 'Build simple sentences', completed: false, stars: 0, locked: false, emoji: '💬' },
      { id: 'describe-it', title: 'Describe It', type: 'Use adjectives', completed: false, stars: 0, locked: true, emoji: '✨' },
      { id: 'portugal-culture', title: 'Portugal Fun', type: 'Cultural vocabulary', completed: false, stars: 0, locked: true, emoji: '🏰' },
    ],
  },
];

export function LanguagesCurriculum() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const [expandedCourse, setExpandedCourse] = useState<string>('beginner');

  const handleGameClick = (courseId: string, gameId: string, locked: boolean) => {
    if (locked) {
      return;
    }
    navigate(`/game/${gameId}`);
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
      <CompanionHelper />
      <OutdoorBackground />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8">
          <Link 
            to="/practice" 
            className="inline-flex items-center gap-2 transition-colors mb-6"
            style={{
              color: theme === 'dark' ? '#E4DCCF' : '#6b7280',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>BACK TO PRACTICE</span>
          </Link>

          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: theme === 'dark' ? 'rgba(74, 144, 226, 0.2)' : '#4A90E220' }}
            >
              <Languages className="w-10 h-10" style={{ color: '#4A90E2' }} />
            </div>
            
            <h1 
              className="mb-3"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 700,
                color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                textTransform: 'uppercase',
              }}
            >
              PORTUGUÊS 🇵🇹
            </h1>
            
            <p 
              style={{ 
                fontSize: '1.125rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
              }}
            >
              Learn Portuguese (Portugal) with fun exercises!
            </p>

            {/* Audio Info Banner */}
            <div 
              className="mt-6 mx-auto max-w-2xl px-6 py-4 rounded-2xl"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(74, 144, 226, 0.15)' : '#4A90E210',
                border: `2px solid ${theme === 'dark' ? 'rgba(74, 144, 226, 0.3)' : '#4A90E230'}`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <Volume2 className="w-5 h-5" style={{ color: '#4A90E2' }} />
                <p 
                  style={{ 
                    fontSize: '0.9375rem', 
                    color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  }}
                >
                  <strong>Coming Soon:</strong> Listen to native Portuguese pronunciation with AI voice
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : '#fff',
                backdropFilter: 'blur(10px)',
                border: `3px solid ${theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : '#e5e7eb'}`,
                boxShadow: theme === 'dark' 
                  ? '0 4px 16px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 16px rgba(0, 0, 0, 0.08)',
                opacity: course.locked ? 0.6 : 1,
              }}
            >
              {/* Course Header */}
              <button
                onClick={() => !course.locked && setExpandedCourse(expandedCourse === course.id ? '' : course.id)}
                className="w-full p-6 text-left transition-colors hover:bg-gray-50"
                disabled={course.locked}
                style={{ cursor: course.locked ? 'not-allowed' : 'pointer' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${course.color}20` }}
                    >
                      {course.emoji}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 
                          style={{ 
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: '#1F2023',
                          }}
                        >
                          {course.title}
                        </h2>
                        <span 
                          className="px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${course.color}20`,
                            color: course.color,
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                          }}
                        >
                          {course.ageRange}
                        </span>
                      </div>
                      
                      <p 
                        className="text-gray-600"
                        style={{ fontSize: '0.9375rem' }}
                      >
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {course.locked && (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Games List */}
              {expandedCourse === course.id && !course.locked && (
                <div 
                  className="px-6 pb-6 pt-2"
                  style={{ borderTop: '2px solid #f3f4f6' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => handleGameClick(course.id, game.id, game.locked)}
                        disabled={game.locked}
                        className="group relative p-5 rounded-2xl text-left transition-all"
                        style={{
                          backgroundColor: game.locked ? '#f9fafb' : '#fff',
                          border: game.locked ? '2px solid #e5e7eb' : `2px solid ${course.color}30`,
                          cursor: game.locked ? 'not-allowed' : 'pointer',
                          opacity: game.locked ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!game.locked) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = course.color;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!game.locked) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = `${course.color}30`;
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{game.emoji}</span>
                            <div>
                              <h3 
                                style={{ 
                                  fontFamily: 'var(--font-display)',
                                  fontSize: '1.125rem',
                                  fontWeight: 600,
                                  color: game.locked ? '#9ca3af' : '#1F2023',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {game.title}
                              </h3>
                              <p 
                                style={{ 
                                  fontSize: '0.8125rem',
                                  color: '#6b7280',
                                }}
                              >
                                {game.type}
                              </p>
                            </div>
                          </div>

                          {game.locked && (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        {/* Stars */}
                        {!game.locked && (
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map((star) => (
                              <Star
                                key={star}
                                className="w-4 h-4"
                                style={{
                                  fill: star <= game.stars ? '#FDB022' : 'none',
                                  color: star <= game.stars ? '#FDB022' : '#d1d5db',
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {game.completed && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 
                              className="w-5 h-5" 
                              style={{ color: course.color }}
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div 
          className="mt-8 p-6 rounded-3xl text-center"
          style={{
            backgroundColor: '#fff',
            border: '3px solid #e5e7eb',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: '#4A90E2' }} />
          <h3 
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1F2023',
              marginBottom: '0.5rem',
            }}
          >
            LEARNING PORTUGUESE
          </h3>
          <p style={{ fontSize: '0.9375rem', color: '#6b7280' }}>
            Complete games to unlock more vocabulary! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}