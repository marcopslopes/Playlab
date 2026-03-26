import { CategoryScreen } from './category-screen';
import { CompanionHelper } from './companion-helper';

const musicCourses = [
  {
    id: 'beginner',
    title: 'Sound Explorers',
    description: 'Ages 3-5 • Listen and discover musical sounds',
    level: 'beginner' as const,
    games: [
      { 
        id: 'listen-repeat', 
        title: 'Listen & Repeat', 
        emoji: '🎵',
        description: 'Echo simple sound patterns'
      },
      { 
        id: 'coming-soon', 
        title: 'Sound Safari', 
        emoji: '🦁',
        description: 'Find and identify different sounds'
      },
      { 
        id: 'coming-soon', 
        title: 'Tap Along', 
        emoji: '👏',
        description: 'Tap to the beat of simple rhythms'
      },
      { 
        id: 'coming-soon', 
        title: 'High & Low', 
        emoji: '🎼',
        description: 'Recognize high and low sounds'
      },
      { 
        id: 'coming-soon', 
        title: 'Instrument Match', 
        emoji: '🎸',
        description: 'Match sounds to instruments'
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'Rhythm Builders',
    description: 'Ages 5-7 • Create and remember musical patterns',
    level: 'intermediate' as const,
    games: [
      { 
        id: 'rhythm-match', 
        title: 'Rhythm Match', 
        emoji: '🥁',
        description: 'Copy rhythmic patterns'
      },
      { 
        id: 'coming-soon', 
        title: 'Melody Memory', 
        emoji: '🎹',
        description: 'Remember short melodies'
      },
      { 
        id: 'coming-soon', 
        title: 'Beat Builder', 
        emoji: '🎶',
        description: 'Create simple drum beats'
      },
      { 
        id: 'coming-soon', 
        title: 'Note Sequence', 
        emoji: '🎵',
        description: 'Play notes in the right order'
      },
      { 
        id: 'coming-soon', 
        title: 'Tempo Tap', 
        emoji: '⏱️',
        description: 'Keep time with different speeds'
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Music Masters',
    description: 'Ages 7-9 • Compose and perform music',
    level: 'advanced' as const,
    games: [
      { 
        id: 'coming-soon', 
        title: 'Make Music', 
        emoji: '🎼',
        description: 'Compose your own melodies'
      },
      { 
        id: 'coming-soon', 
        title: 'Harmony Helper', 
        emoji: ' труба',
        description: 'Combine sounds that go together'
      },
      { 
        id: 'coming-soon', 
        title: 'Song Builder', 
        emoji: '🎤',
        description: 'Create a complete song'
      },
      { 
        id: 'coming-soon', 
        title: 'Music Puzzle', 
        emoji: '🧩',
        description: 'Solve musical challenges'
      },
      { 
        id: 'coming-soon', 
        title: 'Performance', 
        emoji: '🌟',
        description: 'Play a song from memory'
      },
    ],
  },
];

export function MusicCurriculum() {
  return (
    <div>
      <CompanionHelper />
      <CategoryScreen
        categoryId="music"
        categoryName="Music"
        categoryEmoji="🎵"
        categoryColor="#9B59B6" // Purple color for music
        courses={musicCourses}
        description="Explore sounds, rhythms, and melodies through playful musical activities"
      />
    </div>
  );
}