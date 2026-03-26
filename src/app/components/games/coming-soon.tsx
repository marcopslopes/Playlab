import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { useSettings } from '../../contexts/settings-context';

interface ComingSoonProps {
  gameName: string;
  gameEmoji: string;
  categoryPath: string;
}

export function ComingSoon({ gameName, gameEmoji, categoryPath }: ComingSoonProps) {
  const navigate = useNavigate();
  const { theme } = useSettings();

  return (
    <div 
      className="min-h-screen px-4 py-6 flex items-center justify-center relative"
      style={{ 
        fontFamily: 'var(--font-body)',
      }}
    >
      <OutdoorBackground />
      <div className="max-w-2xl mx-auto text-center relative" style={{ zIndex: 1 }}>
        <button
          onClick={() => navigate(categoryPath)}
          className="inline-flex items-center gap-2 transition-colors mb-12"
          style={{ color: theme === 'dark' ? '#E4DCCF' : '#6b7280' }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontSize: '0.9375rem' }}>BACK</span>
        </button>

        <div className="text-8xl mb-6 animate-bounce">
          {gameEmoji}
        </div>

        <h1 
          className="mb-4"
          style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
            textTransform: 'uppercase',
          }}
        >
          {gameName}
        </h1>

        <div 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8"
          style={{ backgroundColor: theme === 'dark' ? '#7D9D9C15' : '#7D9D9C20' }}
        >
          <Sparkles className="w-5 h-5" style={{ color: '#7D9D9C' }} />
          <span 
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#7D9D9C',
              textTransform: 'uppercase',
            }}
          >
            COMING SOON!
          </span>
        </div>

        <p 
          className="mb-8"
          style={{ fontSize: '1.125rem', maxWidth: '500px', margin: '0 auto', color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280' }}
        >
          This game is being created! Check back soon for a new adventure.
        </p>

        <button
          onClick={() => navigate(categoryPath)}
          className="px-8 py-4 rounded-2xl transition-all hover:scale-105"
          style={{
            backgroundColor: '#7D9D9C',
            color: 'white',
            fontFamily: 'var(--font-display)',
            fontSize: '1.125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(125, 157, 156, 0.3)',
          }}
        >
          BACK TO GAMES
        </button>
      </div>
    </div>
  );
}

// Pre-configured components for each game
export function RainbowSort() {
  return <ComingSoon gameName="Rainbow Sort" gameEmoji="🌈" categoryPath="/curriculum/colors" />;
}

export function ShadeFinder() {
  return <ComingSoon gameName="Same or Different?" gameEmoji="🔍" categoryPath="/curriculum/colors" />;
}

export function ColorBlend() {
  return <ComingSoon gameName="Mix It Up" gameEmoji="🌊" categoryPath="/curriculum/colors" />;
}

export function PaletteMatch() {
  return <ComingSoon gameName="Palette Master" gameEmoji="🎭" categoryPath="/curriculum/colors" />;
}

export function PhonicsMatch() {
  return <ComingSoon gameName="Sound Match" gameEmoji="🎵" categoryPath="/curriculum/words" />;
}

export function WordSpell() {
  return <ComingSoon gameName="Spell It!" gameEmoji="✍️" categoryPath="/curriculum/words" />;
}

export function RhymeTime() {
  return <ComingSoon gameName="Rhyme Time" gameEmoji="🎭" categoryPath="/curriculum/words" />;
}

export function ShapeBuild() {
  return <ComingSoon gameName="Build It!" gameEmoji="🏗️" categoryPath="/curriculum/shapes" />;
}

export function ShapeMatch3D() {
  return <ComingSoon gameName="3D Shapes" gameEmoji="🎲" categoryPath="/curriculum/shapes" />;
}

export function Symmetry() {
  return <ComingSoon gameName="Mirror Match" gameEmoji="🪞" categoryPath="/curriculum/shapes" />;
}

export function ColorByNumber() {
  return <ComingSoon gameName="Color Fun" gameEmoji="🎨" categoryPath="/curriculum/creative" />;
}

export function StoryMaker() {
  return <ComingSoon gameName="Story Time" gameEmoji="📚" categoryPath="/curriculum/creative" />;
}

export function PatternDesign() {
  return <ComingSoon gameName="Pattern Artist" gameEmoji="🎭" categoryPath="/curriculum/creative" />;
}

export function WhatsMissing() {
  return <ComingSoon gameName="What's Missing?" gameEmoji="❓" categoryPath="/curriculum/memory" />;
}

export function SequenceRepeat() {
  return <ComingSoon gameName="Copy Me!" gameEmoji="🔁" categoryPath="/curriculum/memory" />;
}

export function GridMemory() {
  return <ComingSoon gameName="Grid Master" gameEmoji="🎯" categoryPath="/curriculum/memory" />;
}

export function NumberChain() {
  return <ComingSoon gameName="Number Chain" gameEmoji="🔢" categoryPath="/curriculum/memory" />;
}

export function FocusShape() {
  return <ComingSoon gameName="Shape Focus" gameEmoji="⭐" categoryPath="/curriculum/focus" />;
}

export function ListenCareful() {
  return <ComingSoon gameName="Listen Careful" gameEmoji="👂" categoryPath="/curriculum/focus" />;
}

export function SpotChange() {
  return <ComingSoon gameName="Spot the Change" gameEmoji="🔍" categoryPath="/curriculum/focus" />;
}

export function StayCalm() {
  return <ComingSoon gameName="Stay Calm" gameEmoji="🧘" categoryPath="/curriculum/focus" />;
}

export function NumberBefore() {
  return <ComingSoon gameName="What Comes Before?" gameEmoji="⬅️" categoryPath="/curriculum/math" />;
}

export function ShapeCount() {
  return <ComingSoon gameName="Count the Shapes" gameEmoji="📊" categoryPath="/curriculum/math" />;
}

export function NumberLine() {
  return <ComingSoon gameName="Number Line" gameEmoji="📏" categoryPath="/curriculum/math" />;
}

export function BiggerSmaller() {
  return <ComingSoon gameName="Bigger or Smaller?" gameEmoji="⚖️" categoryPath="/curriculum/math" />;
}

export function QuickMath() {
  return <ComingSoon gameName="Quick Math" gameEmoji="⚡" categoryPath="/curriculum/math" />;
}

export function WordProblems() {
  return <ComingSoon gameName="Story Problems" gameEmoji="📖" categoryPath="/curriculum/math" />;
}

// Portuguese Language Games
export function AnimalNames() {
  return <ComingSoon gameName="Animal Names" gameEmoji="🐱" categoryPath="/curriculum/languages" />;
}

export function FoodFun() {
  return <ComingSoon gameName="Food Fun" gameEmoji="🍎" categoryPath="/curriculum/languages" />;
}

export function ColorWords() {
  return <ComingSoon gameName="Color Words" gameEmoji="🎨" categoryPath="/curriculum/languages" />;
}

export function NumberCount() {
  return <ComingSoon gameName="Count 1-10" gameEmoji="🔢" categoryPath="/curriculum/languages" />;
}

export function HomeObjects() {
  return <ComingSoon gameName="At Home" gameEmoji="🏠" categoryPath="/curriculum/languages" />;
}

export function NatureWords() {
  return <ComingSoon gameName="In Nature" gameEmoji="🌿" categoryPath="/curriculum/languages" />;
}

export function BodyParts() {
  return <ComingSoon gameName="Body Parts" gameEmoji="👋" categoryPath="/curriculum/languages" />;
}

export function ActionVerbs() {
  return <ComingSoon gameName="Action Time" gameEmoji="🏃" categoryPath="/curriculum/languages" />;
}

export function SentenceBuild() {
  return <ComingSoon gameName="Make Sentences" gameEmoji="💬" categoryPath="/curriculum/languages" />;
}

export function DescribeIt() {
  return <ComingSoon gameName="Describe It" gameEmoji="✨" categoryPath="/curriculum/languages" />;
}

export function PortugalCulture() {
  return <ComingSoon gameName="Portugal Fun" gameEmoji="🏰" categoryPath="/curriculum/languages" />;
}