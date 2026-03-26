import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, Lock, Trophy } from 'lucide-react';
import { useSettings } from '../contexts/settings-context';
import { useProgress } from '../contexts/progress-context';
import { OutdoorBackground } from './outdoor-background';
import { CompanionHelper } from './companion-helper';
import { useMemo } from 'react';

interface Game {
  id: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
}

// Define games for each category
const categoryGames: Record<string, { title: string; color: string; emoji: string; games: Game[] }> = {
  math: {
    title: 'Math Magic',
    emoji: '🔢',
    color: '#7D9D9C',
    games: [
      { id: 'math/beginner/math-fun', title: 'Math Fun', description: 'Simple addition', emoji: '➕', path: '/game/math-fun' },
      { id: 'math/beginner/counting', title: 'Count & Learn', description: 'Count objects', emoji: '🔢', path: '/coming-soon' },
      { id: 'math/intermediate/subtraction', title: 'Take Away', description: 'Subtraction fun', emoji: '➖', path: '/coming-soon' },
    ],
  },
  memory: {
    title: 'Memory Master',
    emoji: '🧠',
    color: '#C08B7E',
    games: [
      { id: 'memory/beginner/memory-pairs', title: 'Memory Pairs', description: 'Find matching cards', emoji: '🎴', path: '/game/memory-pairs' },
      { id: 'memory/beginner/memory-match', title: 'Quick Match', description: 'Match the pairs', emoji: '🃏', path: '/game/memory-match' },
      { id: 'memory/intermediate/sequence', title: 'Sequence Remember', description: 'Repeat the pattern', emoji: '🌟', path: '/coming-soon' },
    ],
  },
  focus: {
    title: 'Focus & Calm',
    emoji: '🎯',
    color: '#7C8B95',
    games: [
      { id: 'focus/beginner/focus-tap', title: 'Focus Tap', description: 'Tap the right bubbles', emoji: '🫧', path: '/game/focus-tap' },
      { id: 'focus/beginner/breathing', title: 'Calm Breathing', description: 'Breathe & relax', emoji: '🌬️', path: '/coming-soon' },
      { id: 'focus/intermediate/meditation', title: 'Mini Meditation', description: 'Find your calm', emoji: '🧘', path: '/coming-soon' },
    ],
  },
  colors: {
    title: 'Color World',
    emoji: '🌈',
    color: '#FDB022',
    games: [
      { id: 'colors/beginner/color-match', title: 'Color Match', description: 'Find the same color', emoji: '🎨', path: '/game/color-match' },
      { id: 'colors/beginner/color-sort', title: 'Color Sort', description: 'Sort by color', emoji: '🌈', path: '/game/color-sort' },
      { id: 'colors/intermediate/color-mix', title: 'Color Mixer', description: 'Mix colors', emoji: '🎨', path: '/coming-soon' },
    ],
  },
  words: {
    title: 'Word Adventures',
    emoji: '📚',
    color: '#7D9D9C',
    games: [
      { id: 'words/beginner/words-find', title: 'Word Builder', description: 'Spell simple words', emoji: '✏️', path: '/game/words-find' },
      { id: 'words/beginner/letter-match', title: 'Letter Match', description: 'Find the letters', emoji: '🔤', path: '/coming-soon' },
      { id: 'words/intermediate/rhyme', title: 'Rhyme Time', description: 'Find rhyming words', emoji: '🎵', path: '/coming-soon' },
    ],
  },
  shapes: {
    title: 'Shape Explorer',
    emoji: '⭐',
    color: '#C08B7E',
    games: [
      { id: 'shapes/beginner/shapes-rotate', title: 'Shape Rotate', description: 'Rotate to match', emoji: '🔄', path: '/game/shapes-rotate' },
      { id: 'shapes/beginner/shape-find', title: 'Shape Hunt', description: 'Find matching shapes', emoji: '🔍', path: '/game/shape-find' },
      { id: 'shapes/intermediate/shape-build', title: 'Shape Builder', description: 'Build with shapes', emoji: '🏗️', path: '/coming-soon' },
    ],
  },
  creative: {
    title: 'Creative Studio',
    emoji: '🎨',
    color: '#FDB022',
    games: [
      { id: 'creative/beginner/creative-draw', title: 'Free Draw', description: 'Draw anything', emoji: '✏️', path: '/game/creative-draw' },
      { id: 'creative/beginner/color-paint', title: 'Paint Fun', description: 'Paint & create', emoji: '🖌️', path: '/coming-soon' },
      { id: 'creative/intermediate/story-create', title: 'Story Time', description: 'Create stories', emoji: '📖', path: '/coming-soon' },
    ],
  },
  languages: {
    title: 'Português',
    emoji: '🇧🇷',
    color: '#7C8B95',
    games: [
      { id: 'languages/beginner/animal-names', title: 'Animal Names', description: 'Learn animal words', emoji: '🐾', path: '/game/animal-names' },
      { id: 'languages/beginner/object-match', title: 'Object Match', description: 'Match objects', emoji: '📦', path: '/game/object-match' },
      { id: 'languages/intermediate/conversations', title: 'Simple Chat', description: 'Basic phrases', emoji: '💬', path: '/coming-soon' },
    ],
  },
};

export function CategoryScreen() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { getGameProgress, progress } = useProgress();

  const category = categoryId ? categoryGames[categoryId] : null;

  // Calculate progress for each game
  const gamesWithProgress = useMemo(() => {
    if (!category) return [];

    return category.games.map((game, index) => {
      const gameProgress = getGameProgress(game.id);
      
      // Progressive unlocking: first 2 games unlocked, rest unlock after previous is completed
      let isLocked = false;
      if (index > 1) {
        const previousGame = category.games[index - 1];
        const previousProgress = getGameProgress(previousGame.id);
        isLocked = !previousProgress || !previousProgress.completed;
      }

      return {
        ...game,
        stars: gameProgress?.stars || 0,
        completed: gameProgress?.completed || false,
        locked: isLocked,
      };
    });
  }, [category, progress, getGameProgress]);

  // Calculate category completion
  const totalStars = gamesWithProgress.reduce((sum, game) => sum + game.stars, 0);
  const maxStars = gamesWithProgress.length * 3;
  const completionPercent = maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0;

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-8 relative overflow-hidden"
      style={{
        fontFamily: 'var(--font-body)',
      }}
    >
      <CompanionHelper />
      <OutdoorBackground />

      <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <button
          onClick={() => navigate('/practice')}
          className="inline-flex items-center gap-2 mb-6 transition-colors"
          style={{
            color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
            opacity: 0.7,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontSize: '0.9375rem' }}>BACK</span>
        </button>

        {/* Category Title */}
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4">{category.emoji}</div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
              marginBottom: '1rem',
            }}
          >
            {category.title}
          </h1>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              <span>{totalStars} / {maxStars} stars</span>
              <span>{completionPercent}% complete</span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{
                height: '12px',
                backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.1)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPercent}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamesWithProgress.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                if (!game.locked) {
                  navigate(game.path);
                }
              }}
              disabled={game.locked}
              className="rounded-3xl p-6 text-left transition-all"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `2px solid ${theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.1)'}`,
                opacity: game.locked ? 0.5 : 1,
                cursor: game.locked ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!game.locked) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!game.locked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{game.emoji}</div>
                {game.locked ? (
                  <Lock className="w-6 h-6" style={{ color: '#7C8B95' }} />
                ) : game.completed ? (
                  <Trophy className="w-6 h-6" style={{ color: '#FDB022' }} />
                ) : null}
              </div>

              <h3
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                {game.title}
              </h3>

              <p
                className="mb-4"
                style={{
                  fontSize: '0.9375rem',
                  opacity: 0.7,
                }}
              >
                {game.description}
              </p>

              {/* Stars */}
              {!game.locked && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5"
                      style={{
                        fill: star <= game.stars ? '#FDB022' : 'none',
                        color: star <= game.stars ? '#FDB022' : theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : 'rgba(31, 32, 35, 0.2)',
                        strokeWidth: 2,
                      }}
                    />
                  ))}
                </div>
              )}

              {game.locked && (
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#7C8B95',
                    fontStyle: 'italic',
                  }}
                >
                  Complete previous game to unlock
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
