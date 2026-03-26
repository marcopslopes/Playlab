import { useProgress } from '../contexts/progress-context';
import { useNavigate } from 'react-router';

interface UseGameProgressOptions {
  gameId: string;
  categoryId: string;
  totalRounds?: number;
}

/**
 * Hook for managing game progress tracking
 * Handles star calculation and progress saving
 */
export function useGameProgress({ gameId, categoryId, totalRounds = 5 }: UseGameProgressOptions) {
  const { updateGameProgress, getGameProgress } = useProgress();
  const navigate = useNavigate();

  const savedProgress = getGameProgress(gameId);

  /**
   * Call this when the game is completed
   * @param mistakes - Number of mistakes made (0-3+ for star calculation)
   * @param customStars - Optional: Override star calculation with custom value
   */
  const completeGame = (mistakes: number, customStars?: number) => {
    let stars: number;
    
    if (customStars !== undefined) {
      stars = Math.max(0, Math.min(3, customStars));
    } else {
      // Default star calculation based on mistakes
      if (mistakes === 0) stars = 3;
      else if (mistakes === 1) stars = 2;
      else if (mistakes === 2) stars = 1;
      else stars = 0;
    }

    // Save progress
    updateGameProgress(gameId, stars, true);

    // Navigate back to category
    navigate(`/game/${categoryId}`);
  };

  /**
   * Calculate stars based on current round and mistakes
   */
  const calculateStars = (mistakes: number): number => {
    if (mistakes === 0) return 3;
    if (mistakes === 1) return 2;
    if (mistakes === 2) return 1;
    return 0;
  };

  return {
    completeGame,
    calculateStars,
    savedProgress,
    previousStars: savedProgress?.stars || 0,
    previousAttempts: savedProgress?.attempts || 0,
  };
}
