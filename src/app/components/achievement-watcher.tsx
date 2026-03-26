import { useState, useEffect, ReactNode } from 'react';
import { useProgress } from '../contexts/progress-context';
import { AchievementCelebration } from './achievement-celebration';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: string;
}

export function AchievementWatcher({ children }: { children: ReactNode }) {
  const { progress } = useProgress();
  const [queuedAchievements, setQueuedAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [lastAchievementCount, setLastAchievementCount] = useState(0);

  // Watch for new achievements
  useEffect(() => {
    const newAchievements = progress.achievements.slice(lastAchievementCount);
    
    if (newAchievements.length > 0) {
      setQueuedAchievements(prev => [...prev, ...newAchievements]);
      setLastAchievementCount(progress.achievements.length);
    }
  }, [progress.achievements, lastAchievementCount]);

  // Display achievements one at a time
  useEffect(() => {
    if (queuedAchievements.length > 0 && !currentAchievement) {
      setCurrentAchievement(queuedAchievements[0]);
    }
  }, [queuedAchievements, currentAchievement]);

  const handleClose = () => {
    setCurrentAchievement(null);
    setQueuedAchievements(prev => prev.slice(1));
  };

  return (
    <>
      {children}
      <AchievementCelebration 
        achievement={currentAchievement} 
        onClose={handleClose} 
      />
    </>
  );
}
