import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Lightbulb, Lock, Star, CheckCircle2 } from 'lucide-react';

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
    title: 'Memory Starters',
    ageRange: 'Ages 3-5',
    description: 'Remember simple things',
    color: '#C08B7E',
    locked: false,
    progress: 0,
    emoji: '🧠',
    games: [
      { id: 'memory-pairs', title: 'Animal Pairs', type: 'Match the pairs', completed: false, stars: 0, locked: false, emoji: '🐶' },
      { id: 'whats-missing', title: "What's Missing?", type: 'Find the missing item', completed: false, stars: 0, locked: false, emoji: '❓' },
      { id: 'sequence-repeat', title: 'Copy Me!', type: 'Repeat the sequence', completed: false, stars: 0, locked: true, emoji: '🔁' },
    ],
  },
  {
    id: 'intermediate',
    title: 'Memory Champions',
    ageRange: 'Ages 5-7',
    description: 'Remember more at once',
    color: '#7D9D9C',
    locked: false,
    progress: 0,
    emoji: '⭐',
    games: [
      { id: 'grid-memory', title: 'Grid Master', type: 'Remember positions', completed: false, stars: 0, locked: false, emoji: '🎯' },
      { id: 'number-chain', title: 'Number Chain', type: 'Remember numbers', completed: false, stars: 0, locked: true, emoji: '🔢' },
    ],
  },
];

export function MemoryCurriculum() {
  const navigate = useNavigate();
  const [expandedCourse, setExpandedCourse] = useState<string>('beginner');

  const handleGameClick = (courseId: string, gameId: string, locked: boolean) => {
    if (locked) {
      return;
    }
    navigate(`/game/memory/${courseId}/${gameId}`);
  };

  return (
    <div 
      className="min-h-screen px-4 sm:px-6 py-6 sm:py-8"
      style={{ 
        background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/practice" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>BACK TO PRACTICE</span>
          </Link>

          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: '#C08B7E20' }}
            >
              <Lightbulb className="w-10 h-10" style={{ color: '#C08B7E' }} />
            </div>
            
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
              MEMORY 💡
            </h1>
            
            <p 
              className="text-gray-600"
              style={{ fontSize: '1.125rem' }}
            >
              Train your brain to remember more!
            </p>
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden"
              style={{
                border: '3px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                opacity: course.locked ? 0.6 : 1,
              }}
            >
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
                            fontWeight: 700,
                            color: '#1F2023',
                            textTransform: 'uppercase',
                          }}
                        >
                          {course.title}
                        </h2>
                        {course.locked && (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      
                      <p 
                        className="text-gray-500 mb-1"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {course.ageRange}
                      </p>
                      
                      <p 
                        className="text-gray-600"
                        style={{ fontSize: '0.9375rem' }}
                      >
                        {course.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div 
                      className="text-2xl font-bold mb-1"
                      style={{ color: course.color }}
                    >
                      {course.progress}%
                    </div>
                    <div 
                      className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden"
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
                </div>
              </button>

              {expandedCourse === course.id && !course.locked && (
                <div 
                  className="px-6 pb-6"
                  style={{ backgroundColor: '#fafafa' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => handleGameClick(course.id, game.id, game.locked)}
                        disabled={game.locked}
                        className="bg-white rounded-2xl p-5 text-left transition-all hover:scale-105"
                        style={{
                          border: game.completed ? `3px solid ${course.color}` : '3px solid #e5e7eb',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                          opacity: game.locked ? 0.5 : 1,
                          cursor: game.locked ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-3xl">{game.emoji}</div>
                          
                          {game.locked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : game.completed ? (
                            <CheckCircle2 className="w-5 h-5" style={{ color: course.color }} />
                          ) : null}
                        </div>
                        
                        <h3 
                          className="mb-1"
                          style={{ 
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#1F2023',
                            textTransform: 'uppercase',
                          }}
                        >
                          {game.title}
                        </h3>
                        
                        <p 
                          className="mb-3 text-gray-500"
                          style={{ fontSize: '0.8125rem' }}
                        >
                          {game.type}
                        </p>
                        
                        {!game.locked && (
                          <div className="flex gap-1">
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
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}