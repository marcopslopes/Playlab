import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { OutdoorBackground } from './outdoor-background';
import { CompanionHelper } from './companion-helper';
import { useSettings } from '../contexts/settings-context';
import { useProgress } from '../contexts/progress-context';

// Flower types with their colors and meanings
const FLOWER_TYPES = {
  logic: { emoji: '🌺', color: '#7D9D9C', name: 'Sage Hibiscus' },
  math: { emoji: '🌻', color: '#FDB022', name: 'Golden Sunflower' },
  memory: { emoji: '🌸', color: '#C08B7E', name: 'Clay Blossom' },
  focus: { emoji: '🌷', color: '#7C8B95', name: 'Slate Tulip' },
  colors: { emoji: '🌹', color: '#E94B3C', name: 'Ruby Rose' },
  words: { emoji: '🌼', color: '#E4DCCF', name: 'Oat Daisy' },
  shapes: { emoji: '💐', color: '#A8C5C4', name: 'Mint Bouquet' },
  creative: { emoji: '🌺', color: '#D896A7', name: 'Pink Orchid' },
  languages: { emoji: '🪷', color: '#8B7AA8', name: 'Purple Lotus' },
} as const;

type FlowerType = keyof typeof FLOWER_TYPES;

interface Flower {
  id: string;
  type: FlowerType;
  bloomLevel: number; // 0 = seed, 1 = sprout, 2 = bud, 3 = full bloom
  starsEarned: number;
  position: { row: number; col: number };
}

export function Garden() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { getTotalStars, getFlowersEarned } = useProgress();

  // Get real progress data
  const totalStarsEarned = getTotalStars();
  const flowersEarned = getFlowersEarned();
  
  // Generate flowers based on stars earned
  const generateFlowers = (): Flower[] => {
    const flowers: Flower[] = [];
    const categories: FlowerType[] = ['logic', 'math', 'memory', 'focus', 'colors', 'words', 'shapes', 'creative', 'languages'];
    
    // Create a 6x6 grid of flower plots (36 total positions)
    let flowerCount = 0;
    
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (flowerCount < flowersEarned) {
          const categoryIndex = flowerCount % categories.length;
          const starsForThisFlower = 3; // Each flower represents 3 stars
          
          flowers.push({
            id: `flower-${row}-${col}`,
            type: categories[categoryIndex],
            bloomLevel: 3, // Fully bloomed for earned flowers
            starsEarned: starsForThisFlower,
            position: { row, col },
          });
          flowerCount++;
        } else {
          // Empty plot or growing flower
          flowers.push({
            id: `plot-${row}-${col}`,
            type: 'logic', // Default type for empty plots
            bloomLevel: 0, // Not yet grown
            starsEarned: 0,
            position: { row, col },
          });
        }
      }
    }
    
    return flowers;
  };

  const flowers = generateFlowers();
  const starsToNextFlower = 3 - (totalStarsEarned % 3);
  const nextFlowerProgress = ((totalStarsEarned % 3) / 3) * 100;

  return (
    <div 
      className="min-h-screen px-6 py-8 relative overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-body)',
      }}
    >
      <OutdoorBackground />
      
      {/* Companion Helper */}
      <CompanionHelper 
        message="Look at your beautiful garden! Keep learning to grow more flowers! 🌸" 
        position="top-right" 
        size="medium" 
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/practice')}
            className="inline-flex items-center gap-2 transition-colors"
            style={{ color: theme === 'dark' ? '#E4DCCF' : '#6b7280' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" style={{ color: '#7D9D9C' }} />
            <h1 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
              }}
            >
              MY GARDEN
            </h1>
            <Sparkles className="w-6 h-6" style={{ color: '#7D9D9C' }} />
          </div>

          <div style={{ width: '80px' }} /> {/* Spacer for centering */}
        </div>

        {/* Garden Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Total Stars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex justify-center mb-3">
              <Star className="w-8 h-8" style={{ color: '#FDB022', fill: '#FDB022' }} />
            </div>
            <p 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#FDB022',
                marginBottom: '0.25rem',
              }}
            >
              {totalStarsEarned}
            </p>
            <p style={{ fontSize: '0.875rem', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : '#6b7280' }}>
              Stars Earned
            </p>
          </motion.div>

          {/* Total Flowers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="text-5xl mb-2">🌸</div>
            <p 
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#7D9D9C',
                marginBottom: '0.25rem',
              }}
            >
              {flowersEarned}
            </p>
            <p style={{ fontSize: '0.875rem', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : '#6b7280' }}>
              Flowers Blooming
            </p>
          </motion.div>

          {/* Next Flower Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p 
              className="text-center mb-3"
              style={{ 
                fontSize: '0.875rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : '#6b7280',
                fontWeight: 600,
              }}
            >
              Next Flower
            </p>
            <div 
              className="h-3 rounded-full mb-2 overflow-hidden"
              style={{ backgroundColor: theme === 'dark' ? 'rgba(125, 157, 156, 0.2)' : 'rgba(125, 157, 156, 0.15)' }}
            >
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${nextFlowerProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #7D9D9C, #A8C5C4)' }}
              />
            </div>
            <p 
              className="text-center"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#7D9D9C',
              }}
            >
              {starsToNextFlower} {starsToNextFlower === 1 ? 'star' : 'stars'} to go! ⭐
            </p>
          </motion.div>
        </div>

        {/* Garden Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-8"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.05)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            boxShadow: theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="grid grid-cols-6 gap-4">
            {flowers.map((flower, index) => (
              <FlowerPlot 
                key={flower.id} 
                flower={flower} 
                index={index}
                theme={theme}
              />
            ))}
          </div>
        </motion.div>

        {/* Flower Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-3xl p-6"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: theme === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 
            className="mb-4 text-center"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
            }}
          >
            Flower Collection
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(FLOWER_TYPES).map(([key, flower]) => (
              <div
                key={key}
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{
                  backgroundColor: theme === 'dark' ? `${flower.color}15` : `${flower.color}20`,
                }}
              >
                <span className="text-2xl">{flower.emoji}</span>
                <div>
                  <p 
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: flower.color,
                    }}
                  >
                    {flower.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af', textTransform: 'capitalize' }}>
                    {key}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Individual Flower Plot Component
interface FlowerPlotProps {
  flower: Flower;
  index: number;
  theme: 'light' | 'dark';
}

function FlowerPlot({ flower, index, theme }: FlowerPlotProps) {
  const flowerType = FLOWER_TYPES[flower.type];
  const isGrown = flower.bloomLevel > 0;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: 0.5 + (index * 0.02),
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      className="aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: isGrown 
          ? (theme === 'dark' ? `${flowerType.color}15` : `${flowerType.color}20`)
          : (theme === 'dark' ? 'rgba(125, 157, 156, 0.05)' : 'rgba(125, 157, 156, 0.1)'),
        border: isGrown 
          ? `2px solid ${flowerType.color}40` 
          : `2px dashed ${theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : 'rgba(125, 157, 156, 0.3)'}`,
      }}
    >
      {isGrown ? (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.6 + (index * 0.02),
            type: 'spring',
            stiffness: 150,
          }}
          className="text-4xl"
        >
          {flowerType.emoji}
        </motion.div>
      ) : (
        <div 
          className="text-2xl opacity-30"
          style={{ filter: 'grayscale(100%)' }}
        >
          🌱
        </div>
      )}

      {/* Bloom level indicator */}
      {flower.bloomLevel === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: [0, 1, 0], scale: [2, 1.5, 2] }}
          transition={{ 
            delay: 0.7 + (index * 0.02),
            duration: 1.5,
            repeat: 0,
          }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <Sparkles 
            className="w-6 h-6" 
            style={{ color: flowerType.color }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}