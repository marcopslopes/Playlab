import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Volume2, Check, X, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

const colors = ['#9B59B6', '#E74C3C', '#3498DB', '#2ECC71', '#F39C12'];

// Sound patterns (represented visually and with sound descriptions)
const soundPatterns = [
  { 
    sequence: [0], 
    name: 'Single Beep',
    sounds: ['beep'],
  },
  { 
    sequence: [0, 0], 
    name: 'Double Beep',
    sounds: ['beep', 'beep'],
  },
  { 
    sequence: [0, 1], 
    name: 'Beep Boop',
    sounds: ['beep', 'boop'],
  },
  { 
    sequence: [1, 0], 
    name: 'Boop Beep',
    sounds: ['boop', 'beep'],
  },
  { 
    sequence: [0, 1, 0], 
    name: 'Beep Boop Beep',
    sounds: ['beep', 'boop', 'beep'],
  },
  { 
    sequence: [1, 1, 0], 
    name: 'Boop Boop Beep',
    sounds: ['boop', 'boop', 'beep'],
  },
];

export function ListenRepeat() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { completeGame } = useGameProgress({ 
    gameId: 'music/beginner/listen-repeat', 
    categoryId: 'music' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [targetPattern, setTargetPattern] = useState<typeof soundPatterns[0] | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const totalRounds = getRoundsForLevel('beginner'); // Beginner course = 3 rounds
  const { message, celebrate, encourage } = useCompanionMessage();

  // Generate new round
  useEffect(() => {
    if (currentRound < totalRounds) {
      generateNewPattern();
    }
  }, [currentRound]);

  const generateNewPattern = () => {
    // Pick patterns based on round difficulty
    let availablePatterns;
    if (currentRound === 0) {
      availablePatterns = soundPatterns.slice(0, 2); // Single and double beep
    } else if (currentRound === 1) {
      availablePatterns = soundPatterns.slice(0, 4); // Up to 2-sound patterns
    } else {
      availablePatterns = soundPatterns; // All patterns
    }
    
    const pattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
    setTargetPattern(pattern);
    setUserSequence([]);
    setShowFeedback(false);
  };

  const playSound = async () => {
    if (!targetPattern || isPlaying) return;
    
    setIsPlaying(true);
    
    // Visual feedback for "playing" sound
    for (let i = 0; i < targetPattern.sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      // In a real implementation, this would play actual sounds
    }
    
    setIsPlaying(false);
  };

  const handleSoundButton = (soundIndex: number) => {
    if (showFeedback || !targetPattern) return;
    
    const newSequence = [...userSequence, soundIndex];
    setUserSequence(newSequence);
    
    // Check if sequence matches so far
    const isMatchingSoFar = newSequence.every((sound, idx) => sound === targetPattern.sequence[idx]);
    
    if (!isMatchingSoFar) {
      // Wrong immediately
      setIsCorrect(false);
      setShowFeedback(true);
      setMistakes(mistakes + 1);
      if (mistakes >= 2) setStars(Math.max(1, stars - 1));
      encourage();
      
      setTimeout(() => {
        setShowFeedback(false);
        setUserSequence([]);
      }, 1500);
      return;
    }
    
    // Check if complete and correct
    if (newSequence.length === targetPattern.sequence.length) {
      setIsCorrect(true);
      setShowFeedback(true);
      celebrate();
      
      setTimeout(() => {
        if (currentRound + 1 < totalRounds) {
          setCurrentRound(currentRound + 1);
        } else {
          // Game complete
          completeGame(stars);
          setTimeout(() => navigate('/game/music'), 500);
        }
      }, 1500);
    }
  };

  if (!targetPattern) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <OutdoorBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/game/music"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Back</span>
          </Link>

          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`w-7 h-7 ${i < stars ? 'fill-current' : ''}`}
                style={{ color: i < stars ? '#FDB022' : theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db' }}
              />
            ))}
          </div>
        </div>

        {/* Companion Helper */}
        <CompanionHelper message={message} />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Title */}
            <div className="text-center mb-8">
              <h1
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                🎵 Listen & Repeat
              </h1>
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
                }}
              >
                Listen carefully, then repeat the pattern
              </p>
            </div>

            {/* Progress */}
            <div className="text-center mb-8">
              <div
                className="inline-block px-6 py-3 rounded-2xl"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                Round {currentRound + 1} of {totalRounds}
              </div>
            </div>

            {/* Play Sound Button */}
            <div className="text-center mb-12">
              <button
                onClick={playSound}
                disabled={isPlaying}
                className="relative group"
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  backgroundColor: '#9B59B6',
                  border: 'none',
                  cursor: isPlaying ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 32px rgba(155, 89, 182, 0.4)',
                  transition: 'all 0.3s ease',
                  transform: isPlaying ? 'scale(0.95)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (!isPlaying) e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isPlaying) e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Volume2 className="w-20 h-20 text-white mx-auto" />
                <div
                  className="mt-2"
                  style={{
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {isPlaying ? 'Playing...' : 'Listen'}
                </div>
                
                {/* Animation ring when playing */}
                {isPlaying && (
                  <div
                    className="absolute inset-0 rounded-full border-4 border-white animate-ping"
                    style={{ opacity: 0.5 }}
                  />
                )}
              </button>
            </div>

            {/* User Input Buttons */}
            <div className="mb-8">
              <p
                className="text-center mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                Now you try:
              </p>
              
              <div className="flex justify-center gap-6">
                {/* Beep button */}
                <button
                  onClick={() => handleSoundButton(0)}
                  disabled={showFeedback}
                  className="relative"
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '24px',
                    backgroundColor: colors[0],
                    border: 'none',
                    cursor: showFeedback ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 24px rgba(155, 89, 182, 0.3)',
                    transition: 'all 0.2s ease',
                    opacity: showFeedback ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!showFeedback) e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!showFeedback) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    🔵
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    Beep
                  </div>
                </button>

                {/* Boop button */}
                <button
                  onClick={() => handleSoundButton(1)}
                  disabled={showFeedback}
                  className="relative"
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '24px',
                    backgroundColor: colors[1],
                    border: 'none',
                    cursor: showFeedback ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 24px rgba(231, 76, 60, 0.3)',
                    transition: 'all 0.2s ease',
                    opacity: showFeedback ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!showFeedback) e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!showFeedback) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    🔴
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    Boop
                  </div>
                </button>
              </div>

              {/* Current sequence display */}
              <div className="text-center mt-6">
                <div className="flex justify-center gap-2">
                  {userSequence.map((sound, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: sound === 0 ? colors[0] : colors[1],
                        color: 'white',
                        fontSize: '1.25rem',
                      }}
                    >
                      {sound === 0 ? '🔵' : '🔴'}
                    </div>
                  ))}
                  {/* Placeholder dots */}
                  {userSequence.length < targetPattern.sequence.length &&
                    [...Array(targetPattern.sequence.length - userSequence.length)].map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="w-8 h-8 rounded-full border-2"
                        style={{
                          borderColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db',
                          borderStyle: 'dashed',
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedback && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div
              className="rounded-3xl p-12 text-center max-w-md w-full"
              style={{
                backgroundColor: theme === 'dark' ? '#2A2C30' : '#fff',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {isCorrect ? (
                <>
                  <div className="text-7xl mb-4">🎉</div>
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 600,
                      color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                    }}
                  >
                    Perfect!
                  </h2>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '1.0625rem' }}>
                    You matched the pattern! 🎵
                  </p>
                </>
              ) : (
                <>
                  <div className="text-7xl mb-4">💫</div>
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 600,
                      color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                    }}
                  >
                    Try Again
                  </h2>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '1.0625rem' }}>
                    Listen carefully and try once more!
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
