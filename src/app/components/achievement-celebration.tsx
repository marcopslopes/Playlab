import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/settings-context';
import { useTranslation } from '../hooks/use-translation';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

interface AchievementCelebrationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementCelebration({ achievement, onClose }: AchievementCelebrationProps) {
  const { theme } = useSettings();
  const { t } = useTranslation();

  useEffect(() => {
    if (achievement) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Auto-close after 4 seconds
      const timeout = setTimeout(() => {
        onClose();
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={onClose}
          >
            {/* Achievement Card */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 20,
                duration: 0.5,
              }}
              className="rounded-3xl p-10 text-center max-w-md mx-4"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.15)' : '#FFFFFF',
                backdropFilter: 'blur(20px)',
                boxShadow: theme === 'dark' 
                  ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(125, 157, 156, 0.3)' 
                  : '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(125, 157, 156, 0.2)',
                border: `2px solid ${theme === 'dark' ? 'rgba(125, 157, 156, 0.5)' : 'rgba(125, 157, 156, 0.3)'}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sparkles decoration */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <Sparkles className="w-8 h-8" style={{ color: '#7D9D9C' }} />
              </motion.div>

              {/* Achievement unlocked text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#7D9D9C',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '1.5rem',
                }}
              >
                {t('achievements.unlocked')}
              </motion.p>

              {/* Achievement emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.4,
                  type: 'spring',
                  stiffness: 200,
                }}
                className="text-8xl mb-6"
              >
                {achievement.emoji}
              </motion.div>

              {/* Achievement name */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  marginBottom: '1rem',
                }}
              >
                {achievement.name}
              </motion.h2>

              {/* Achievement description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  fontSize: '1.125rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
                  marginBottom: '2rem',
                }}
              >
                {achievement.description}
              </motion.p>

              {/* Tap to continue hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ delay: 0.7, duration: 2, repeat: Infinity }}
                style={{
                  fontSize: '0.875rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('achievements.tapToContinue')}
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
