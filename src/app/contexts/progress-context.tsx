import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Progress data structure
interface GameProgress {
  gameId: string;
  stars: number; // 0-3
  completed: boolean;
  attempts: number;
  bestTime?: number;
  lastPlayed: string; // ISO date string
}

interface CategoryProgress {
  categoryId: string;
  totalStars: number;
  gamesCompleted: number;
  totalGames: number;
  lastPlayed: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: string;
  category?: string;
}

interface ProgressData {
  // User profile
  childName: string;
  age: number;
  companion: string;
  onboardingComplete: boolean;
  
  // Game progress
  games: Record<string, GameProgress>;
  categories: Record<string, CategoryProgress>;
  
  // Overall stats
  totalStars: number;
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  flowersEarned: number;
  streakDays: number;
  lastPlayedDate: string;
  
  // Achievements
  achievements: Achievement[];
}

interface ProgressContextType {
  progress: ProgressData;
  updateGameProgress: (gameId: string, stars: number, completed: boolean) => void;
  addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => void;
  resetProgress: () => void;
  getGameProgress: (gameId: string) => GameProgress | null;
  getCategoryProgress: (categoryId: string) => CategoryProgress;
  getTotalStars: () => number;
  getFlowersEarned: () => number;
}

const defaultProgress: ProgressData = {
  childName: '',
  age: 5,
  companion: 'fox',
  onboardingComplete: false,
  games: {},
  categories: {},
  totalStars: 0,
  totalGamesPlayed: 0,
  totalGamesCompleted: 0,
  flowersEarned: 0,
  streakDays: 0,
  lastPlayedDate: new Date().toISOString(),
  achievements: [],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('cognitiveCalm_progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        
        // Check and update streak
        const updatedProgress = updateDailyStreak(parsed);
        setProgress(updatedProgress);
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  // Helper function to update daily streak
  const updateDailyStreak = (progressData: ProgressData): ProgressData => {
    const now = new Date();
    const today = now.toDateString();
    const lastPlayed = progressData.lastPlayedDate ? new Date(progressData.lastPlayedDate).toDateString() : null;

    if (!lastPlayed) {
      // First time playing
      return {
        ...progressData,
        streakDays: 1,
        lastPlayedDate: now.toISOString(),
      };
    }

    if (lastPlayed === today) {
      // Already played today, keep current streak
      return progressData;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastPlayed === yesterdayStr) {
      // Played yesterday, increment streak
      return {
        ...progressData,
        streakDays: progressData.streakDays + 1,
        lastPlayedDate: now.toISOString(),
      };
    }

    // Streak broken, reset to 1
    return {
      ...progressData,
      streakDays: 1,
      lastPlayedDate: now.toISOString(),
    };
  };

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cognitiveCalm_progress', JSON.stringify(progress));
  }, [progress]);

  const updateGameProgress = (gameId: string, stars: number, completed: boolean) => {
    setProgress((prev) => {
      const now = new Date().toISOString();
      
      // Update streak
      const progressWithStreak = updateDailyStreak(prev);
      
      // Extract category from gameId (e.g., "logic/beginner/pattern-match" -> "logic")
      const categoryId = gameId.split('/')[0];
      
      // Update or create game progress
      const existingGame = prev.games[gameId];
      const newGameProgress: GameProgress = {
        gameId,
        stars: Math.max(stars, existingGame?.stars || 0), // Keep best stars
        completed,
        attempts: (existingGame?.attempts || 0) + 1,
        lastPlayed: now,
      };
      
      // Calculate new totals
      const allGames = { ...prev.games, [gameId]: newGameProgress };
      const totalStars = Object.values(allGames).reduce((sum, game) => sum + game.stars, 0);
      const totalGamesCompleted = Object.values(allGames).filter(g => g.completed).length;
      const flowersEarned = Math.floor(totalStars / 3);
      
      // Update category progress
      const categoryGames = Object.values(allGames).filter(g => g.gameId.startsWith(categoryId));
      const categoryStars = categoryGames.reduce((sum, game) => sum + game.stars, 0);
      const categoryCompleted = categoryGames.filter(g => g.completed).length;
      
      const newCategoryProgress: CategoryProgress = {
        categoryId,
        totalStars: categoryStars,
        gamesCompleted: categoryCompleted,
        totalGames: categoryGames.length,
        lastPlayed: now,
      };
      
      // Check for new achievements
      const newAchievements = [...progressWithStreak.achievements];
      
      // First game achievement
      if (prev.totalGamesCompleted === 0 && completed) {
        newAchievements.push({
          id: 'first-game',
          name: 'First Steps!',
          description: 'Completed your first game',
          emoji: '🎯',
          unlockedAt: now,
        });
      }
      
      // 10 stars achievement
      if (prev.totalStars < 10 && totalStars >= 10) {
        newAchievements.push({
          id: 'star-collector',
          name: 'Star Collector',
          description: 'Earned 10 stars',
          emoji: '⭐',
          unlockedAt: now,
        });
      }
      
      // First flower achievement
      if (prev.flowersEarned === 0 && flowersEarned >= 1) {
        newAchievements.push({
          id: 'first-flower',
          name: 'Green Thumb',
          description: 'Grew your first flower',
          emoji: '🌱',
          unlockedAt: now,
        });
      }
      
      // 5 flowers achievement
      if (prev.flowersEarned < 5 && flowersEarned >= 5) {
        newAchievements.push({
          id: 'garden-starter',
          name: 'Garden Starter',
          description: 'Grew 5 flowers',
          emoji: '🌸',
          unlockedAt: now,
        });
      }
      
      // Perfect game achievement (3 stars)
      if (stars === 3) {
        const perfectGamesCount = Object.values(allGames).filter(g => g.stars === 3).length;
        if (perfectGamesCount === 1) {
          newAchievements.push({
            id: 'perfect-first',
            name: 'Perfect!',
            description: 'Got 3 stars in a game',
            emoji: '✨',
            unlockedAt: now,
          });
        }
        
        // 10 perfect games
        if (perfectGamesCount === 10) {
          newAchievements.push({
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Got 3 stars in 10 games',
            emoji: '💫',
            unlockedAt: now,
          });
        }
      }
      
      // Streak achievements
      if (progressWithStreak.streakDays === 3 && prev.streakDays < 3) {
        newAchievements.push({
          id: 'streak-3',
          name: 'On Fire!',
          description: 'Played 3 days in a row',
          emoji: '🔥',
          unlockedAt: now,
        });
      }
      
      if (progressWithStreak.streakDays === 7 && prev.streakDays < 7) {
        newAchievements.push({
          id: 'streak-7',
          name: 'Week Warrior',
          description: 'Played 7 days in a row',
          emoji: '🌟',
          unlockedAt: now,
        });
      }
      
      // Category completion achievement
      if (categoryCompleted >= 9) {
        const categoryMasterId = `category-master-${categoryId}`;
        if (!newAchievements.some(a => a.id === categoryMasterId)) {
          const categoryNames: Record<string, string> = {
            logic: 'Logic Master',
            math: 'Math Wizard',
            memory: 'Memory Champion',
            focus: 'Focus Expert',
            colors: 'Color Master',
            words: 'Word Master',
            shapes: 'Shape Expert',
            creative: 'Creative Genius',
            languages: 'Language Star',
          };
          
          newAchievements.push({
            id: categoryMasterId,
            name: categoryNames[categoryId] || 'Category Master',
            description: `Completed all ${categoryId} games`,
            emoji: '🏆',
            unlockedAt: now,
            category: categoryId,
          });
        }
      }
      
      // Garden achievements
      if (prev.flowersEarned < 10 && flowersEarned >= 10) {
        newAchievements.push({
          id: 'garden-10',
          name: 'Blooming Garden',
          description: 'Grew 10 flowers',
          emoji: '🌻',
          unlockedAt: now,
        });
      }
      
      if (prev.flowersEarned < 20 && flowersEarned >= 20) {
        newAchievements.push({
          id: 'garden-20',
          name: 'Flower Power',
          description: 'Grew 20 flowers',
          emoji: '🌺',
          unlockedAt: now,
        });
      }
      
      // 50 stars milestone
      if (prev.totalStars < 50 && totalStars >= 50) {
        newAchievements.push({
          id: 'stars-50',
          name: 'Star Champion',
          description: 'Earned 50 stars',
          emoji: '🌠',
          unlockedAt: now,
        });
      }
      
      // 100 stars milestone
      if (prev.totalStars < 100 && totalStars >= 100) {
        newAchievements.push({
          id: 'stars-100',
          name: 'Star Legend',
          description: 'Earned 100 stars',
          emoji: '💖',
          unlockedAt: now,
        });
      }
      
      return {
        ...prev,
        games: allGames,
        categories: {
          ...prev.categories,
          [categoryId]: newCategoryProgress,
        },
        totalStars,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        totalGamesCompleted,
        flowersEarned,
        lastPlayedDate: now,
        achievements: newAchievements,
      };
    });
  };

  const addAchievement = (achievement: Omit<Achievement, 'unlockedAt'>) => {
    setProgress((prev) => {
      // Check if achievement already exists
      if (prev.achievements.some(a => a.id === achievement.id)) {
        return prev;
      }
      
      return {
        ...prev,
        achievements: [
          ...prev.achievements,
          {
            ...achievement,
            unlockedAt: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem('cognitiveCalm_progress');
  };

  const getGameProgress = (gameId: string): GameProgress | null => {
    return progress.games[gameId] || null;
  };

  const getCategoryProgress = (categoryId: string): CategoryProgress => {
    return progress.categories[categoryId] || {
      categoryId,
      totalStars: 0,
      gamesCompleted: 0,
      totalGames: 0,
      lastPlayed: '',
    };
  };

  const getTotalStars = () => progress.totalStars;
  
  const getFlowersEarned = () => progress.flowersEarned;

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateGameProgress,
        addAchievement,
        resetProgress,
        getGameProgress,
        getCategoryProgress,
        getTotalStars,
        getFlowersEarned,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}