import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

const drumColor = '#E74C3C';

// Rhythm patterns (0 = rest, 1 = beat)
const rhythmPatterns = [
  { pattern: [1, 1, 1, 1], name: 'Steady Beat', tempo: 600 },
  { pattern: [1, 0, 1, 0], name: 'On & Off', tempo: 500 },
  { pattern: [1, 1, 0, 1], name: 'Quick Start', tempo: 550 },
  { pattern: [1, 0, 0, 1], name: 'Slow Motion', tempo: 700 },
  { pattern: [1, 1, 1, 0], name: 'Triple Time', tempo: 500 },
  { pattern: [1, 0, 1, 1], name: 'Skip Beat', tempo: 550 },
];

export function RhythmMatch() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'music/intermediate/rhythm-match', 
    categoryId: 'music' 
  });
  const [currentRound, setCurrentRound] = useState(0);
  const [targetRhythm, setTargetRhythm] = useState<typeof rhythmPatterns[0] | null>(null);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBeat, setRecordingBeat] = useState(0);
  const totalRounds = getRoundsForLevel('intermediate'); // Intermediate course = 4 rounds
  const { message, celebrate, encourage } = useCompanionMessage();

  // Generate new round
  useEffect(() => {
    if (currentRound < totalRounds) {
      generateNewRhythm();
    }
  }, [currentRound]);

  const generateNewRhythm = () => {
    const rhythm = rhythmPatterns[Math.floor(Math.random() * rhythmPatterns.length)];
    setTargetRhythm(rhythm);
    setUserPattern([]);
    setShowFeedback(false);
    setIsRecording(false);
    setRecordingBeat(0);
  };

  const playRhythm = async () => {
    if (!targetRhythm || isPlaying) return;
    
    setIsPlaying(true);
    
    for (let i = 0; i < targetRhythm.pattern.length; i++) {
      setCurrentBeat(i);
      await new Promise(resolve => setTimeout(resolve, targetRhythm.tempo));
    }
    
    setCurrentBeat(-1);
    setIsPlaying(false);
  };

  const startRecording = () => {
    if (!targetRhythm) return;
    setIsRecording(true);
    setUserPattern([]);
    setRecordingBeat(0);
    
    // Auto-advance through beats
    const interval = setInterval(() => {
      setRecordingBeat(prev => {
        if (prev >= targetRhythm.pattern.length - 1) {
          clearInterval(interval);
          setIsRecording(false);
          return prev;
        }
        return prev + 1;
      });
    }, targetRhythm.tempo);
  };

  const handleDrumTap = () => {
    if (!isRecording || !targetRhythm) return;
    
    const newPattern = [...userPattern];
    // Fill with 0s up to current beat if needed
    while (newPattern.length < recordingBeat) {
      newPattern.push(0);
    }
    newPattern.push(1);
    setUserPattern(newPattern);
  };

  // Check answer when recording completes
  useEffect(() => {
    if (!isRecording && userPattern.length > 0 && targetRhythm) {
      // Fill remaining beats with 0s
      const finalPattern = [...userPattern];
      while (finalPattern.length < targetRhythm.pattern.length) {
        finalPattern.push(0);
      }
      
      // Check if patterns match
      const matches = finalPattern.every((beat, idx) => beat === targetRhythm.pattern[idx]);
      
      setIsCorrect(matches);
      setShowFeedback(true);
      
      if (matches) {
        celebrate();
        setTimeout(() => {
          if (currentRound + 1 < totalRounds) {
            setCurrentRound(currentRound + 1);
          } else {
            completeGame(stars);
            setTimeout(() => navigate('/game/music'), 500);
          }
        }, 1500);
      } else {
        setMistakes(mistakes + 1);
        if (mistakes >= 2) setStars(Math.max(1, stars - 1));
        encourage();
        setTimeout(() => {
          setShowFeedback(false);
          setUserPattern([]);
          setRecordingBeat(0);
        }, 1500);
      }
    }
  }, [isRecording]);

  if (!targetRhythm) return null;

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
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{t('games.back')}</span>
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
                🥁 Rhythm Match
              </h1>
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
                }}
              >
                Listen to the rhythm, then tap it back
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

            {/* Pattern Display */}
            <div className="mb-10">
              <div className="flex justify-center gap-4 mb-6">
                {targetRhythm.pattern.map((beat, idx) => (
                  <div
                    key={idx}
                    className="transition-all duration-200"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      backgroundColor: currentBeat === idx && isPlaying
                        ? drumColor
                        : beat === 1
                        ? theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                        : 'transparent',
                      border: `3px ${beat === 1 ? 'solid' : 'dashed'} ${
                        currentBeat === idx && isPlaying 
                          ? drumColor 
                          : theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db'
                      }`,
                      transform: currentBeat === idx && isPlaying ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: currentBeat === idx && isPlaying ? '0 6px 20px rgba(231, 76, 60, 0.4)' : 'none',
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={playRhythm}
                  disabled={isPlaying || isRecording}
                  className="px-8 py-4 rounded-2xl transition-all"
                  style={{
                    backgroundColor: '#9B59B6',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    cursor: isPlaying || isRecording ? 'not-allowed' : 'pointer',
                    opacity: isPlaying || isRecording ? 0.6 : 1,
                    boxShadow: '0 4px 16px rgba(155, 89, 182, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isPlaying && !isRecording) e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isPlaying && !isRecording) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isPlaying ? 'Playing...' : 'Listen'}
                </button>

                <button
                  onClick={startRecording}
                  disabled={isRecording || isPlaying || showFeedback}
                  className="px-8 py-4 rounded-2xl transition-all"
                  style={{
                    backgroundColor: drumColor,
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    cursor: isRecording || isPlaying || showFeedback ? 'not-allowed' : 'pointer',
                    opacity: isRecording || isPlaying || showFeedback ? 0.6 : 1,
                    boxShadow: '0 4px 16px rgba(231, 76, 60, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isRecording && !isPlaying && !showFeedback) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isRecording && !isPlaying && !showFeedback) {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isRecording ? 'Recording...' : 'Your Turn'}
                </button>
              </div>
            </div>

            {/* Drum Pad */}
            {isRecording && (
              <div className="text-center mb-8">
                <button
                  onClick={handleDrumTap}
                  className="relative group"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    backgroundColor: drumColor,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(231, 76, 60, 0.4)',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontSize: '3rem',
                      fontWeight: 700,
                    }}
                  >
                    🥁
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                    }}
                  >
                    Tap Here!
                  </div>
                </button>

                {/* Recording progress */}
                <div className="flex justify-center gap-4 mt-6">
                  {targetRhythm.pattern.map((_, idx) => (
                    <div
                      key={idx}
                      className="transition-all"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundColor: idx === recordingBeat && isRecording
                          ? drumColor
                          : idx < recordingBeat
                          ? userPattern[idx] === 1
                            ? drumColor
                            : theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                          : 'transparent',
                        border: `3px solid ${
                          idx === recordingBeat 
                            ? drumColor 
                            : theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db'
                        }`,
                        transform: idx === recordingBeat && isRecording ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
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
                    Perfect Rhythm!
                  </h2>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '1.0625rem' }}>
                    You matched the beat! 🥁
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
                    {t('games.tryAgain')}
                  </h2>
                  <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '1.0625rem' }}>
                    Listen carefully and feel the rhythm!
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
