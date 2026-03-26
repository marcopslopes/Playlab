import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Star as StarIcon, Sparkles, Eraser } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface Connection {
  from: number;
  to: number;
}

export function ConstellationCreator() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { completeGame } = useGameProgress({ 
    gameId: 'creative/advanced/constellation-creator', 
    categoryId: 'creative' 
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [constellationName, setConstellationName] = useState('');
  const [showNaming, setShowNaming] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameStars] = useState(3);
  const totalRounds = getRoundsForLevel('advanced'); // 5 rounds
  const { message, celebrate } = useCompanionMessage();

  // Generate random stars on mount and round change
  useEffect(() => {
    generateStars();
  }, [currentRound]);

  useEffect(() => {
    drawCanvas();
  }, [stars, connections, selectedStar]);

  const generateStars = () => {
    const newStars: Star[] = [];
    const numStars = 8 + Math.floor(Math.random() * 5); // 8-12 stars

    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: i,
        x: 80 + Math.random() * 640, // Keep away from edges
        y: 60 + Math.random() * 380,
        size: 3 + Math.random() * 4,
      });
    }

    setStars(newStars);
    setConnections([]);
    setSelectedStar(null);
    setConstellationName('');
    setShowNaming(false);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with night sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0F172A');
    gradient.addColorStop(1, '#1E293B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections (constellation lines)
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
    ctx.lineWidth = 2;
    connections.forEach(conn => {
      const fromStar = stars.find(s => s.id === conn.from);
      const toStar = stars.find(s => s.id === conn.to);
      
      if (fromStar && toStar) {
        ctx.beginPath();
        ctx.moveTo(fromStar.x, fromStar.y);
        ctx.lineTo(toStar.x, toStar.y);
        ctx.stroke();
      }
    });

    // Draw line from selected star to cursor (visual feedback)
    if (selectedStar !== null) {
      const star = stars.find(s => s.id === selectedStar);
      if (star) {
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        // This line will be drawn to cursor on mouse move
        ctx.setLineDash([]);
      }
    }

    // Draw stars
    stars.forEach(star => {
      // Star glow
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(253, 224, 71, 0.4)');
      gradient.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.fillStyle = selectedStar === star.id ? '#FDE047' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Selection ring
      if (selectedStar === star.id) {
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a star
    for (const star of stars) {
      const distance = Math.sqrt(Math.pow(x - star.x, 2) + Math.pow(y - star.y, 2));
      
      if (distance <= star.size + 10) {
        if (selectedStar === null) {
          // First star selected
          setSelectedStar(star.id);
        } else if (selectedStar === star.id) {
          // Deselect
          setSelectedStar(null);
        } else {
          // Second star - create connection
          const connectionExists = connections.some(
            c => (c.from === selectedStar && c.to === star.id) || (c.from === star.id && c.to === selectedStar)
          );
          
          if (!connectionExists) {
            setConnections([...connections, { from: selectedStar, to: star.id }]);
          }
          setSelectedStar(null);
        }
        return;
      }
    }

    // Clicked on empty space - deselect
    setSelectedStar(null);
  };

  const handleClear = () => {
    setConnections([]);
    setSelectedStar(null);
  };

  const handleComplete = () => {
    if (connections.length > 0) {
      setShowNaming(true);
    }
  };

  const handleSaveConstellation = () => {
    celebrate();
    
    setTimeout(() => {
      if (currentRound + 1 < totalRounds) {
        setCurrentRound(currentRound + 1);
      } else {
        completeGame(gameStars);
        setTimeout(() => navigate('/game/creative'), 500);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <OutdoorBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/game/creative"
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
              <StarIcon
                key={i}
                className={`w-7 h-7 ${i < gameStars ? 'fill-current' : ''}`}
                style={{ color: i < gameStars ? '#FDB022' : theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#d1d5db' }}
              />
            ))}
          </div>
        </div>

        {/* Companion Helper */}
        <CompanionHelper message={message} />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            {/* Title */}
            <div className="text-center mb-6">
              <h1
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                }}
              >
                ⭐ Constellation Creator
              </h1>
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
                }}
              >
                Connect the stars to create your own constellation
              </p>
              <p
                className="mt-3 max-w-lg mx-auto"
                style={{
                  fontSize: '0.9375rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : '#9ca3af',
                  fontStyle: 'italic',
                  lineHeight: '1.5',
                }}
              >
                Ancient sailors used stars to find their way home. What pictures will you find in the night sky? 🌌
              </p>
            </div>

            {/* Progress */}
            <div className="text-center mb-6">
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
                Constellation {currentRound + 1} of {totalRounds}
              </div>
            </div>

            {/* Canvas */}
            <div className="mb-6">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onClick={handleCanvasClick}
                className="mx-auto rounded-3xl shadow-2xl cursor-pointer"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  border: `4px solid ${theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : '#1E293B'}`,
                }}
              />
              <p
                className="text-center mt-3"
                style={{
                  fontSize: '0.875rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.5)' : '#9ca3af',
                  fontStyle: 'italic',
                }}
              >
                Click a star, then click another to connect them ✨
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#FDE047',
                  }}
                >
                  {stars.length}
                </div>
                <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '0.875rem' }}>
                  Stars
                </p>
              </div>
              
              <div className="text-center">
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#93C5FD',
                  }}
                >
                  {connections.length}
                </div>
                <p style={{ color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280', fontSize: '0.875rem' }}>
                  Connections
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClear}
                disabled={connections.length === 0}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : '#f3f4f6',
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  cursor: connections.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: connections.length === 0 ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (connections.length > 0) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (connections.length > 0) e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Eraser className="w-5 h-5" />
                Clear Lines
              </button>

              <button
                onClick={generateStars}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : '#f3f4f6',
                  color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Sparkles className="w-5 h-5" />
                New Stars
              </button>

              <button
                onClick={handleComplete}
                disabled={connections.length === 0}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: '#E74C3C',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  cursor: connections.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: connections.length === 0 ? 0.5 : 1,
                  boxShadow: '0 4px 16px rgba(231, 76, 60, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (connections.length > 0) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (connections.length > 0) e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <StarIcon className="w-5 h-5" />
                Complete
              </button>
            </div>
          </div>
        </div>

        {/* Naming Modal */}
        {showNaming && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          >
            <div
              className="rounded-3xl p-12 text-center max-w-md w-full"
              style={{
                backgroundColor: theme === 'dark' ? '#1E293B' : '#0F172A',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                border: '2px solid rgba(147, 197, 253, 0.3)',
              }}
            >
              <div className="text-7xl mb-4">✨</div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#FDE047',
                }}
              >
                Name Your Constellation
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.0625rem', marginBottom: '1.5rem' }}>
                Every constellation needs a name!
              </p>

              <input
                type="text"
                value={constellationName}
                onChange={(e) => setConstellationName(e.target.value)}
                placeholder="The Great..."
                autoFocus
                className="w-full px-6 py-4 rounded-2xl mb-6 text-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(147, 197, 253, 0.3)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && constellationName.trim()) {
                    handleSaveConstellation();
                  }
                }}
              />

              <button
                onClick={handleSaveConstellation}
                disabled={!constellationName.trim()}
                className="w-full px-10 py-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: '#FDE047',
                  color: '#0F172A',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  cursor: !constellationName.trim() ? 'not-allowed' : 'pointer',
                  opacity: !constellationName.trim() ? 0.5 : 1,
                  boxShadow: '0 4px 16px rgba(253, 224, 71, 0.4)',
                }}
                onMouseEnter={(e) => {
                  if (constellationName.trim()) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (constellationName.trim()) e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Save Constellation ⭐
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}