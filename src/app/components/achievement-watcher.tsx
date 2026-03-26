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
  // Initialise from localStorage so the jump from [] → stored achievements on first render
  // is not treated as new achievements to celebrate.
  const [lastAchievementCount, setLastAchievementCount] = useState(() => {
    try {
      const saved = localStorage.getItem('cognitiveCalm_progress');
      if (saved) return (JSON.parse(saved).achievements?.length ?? 0);
    } catch {}
    return 0;
  });

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
