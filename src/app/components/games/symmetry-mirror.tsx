import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Star, Eraser, Palette } from 'lucide-react';
import { OutdoorBackground } from '../outdoor-background';
import { CompanionHelper, useCompanionMessage } from '../companion-helper';
import { useSettings } from '../../contexts/settings-context';
import { useTranslation } from '../../hooks/use-translation';
import { useGameProgress } from '../../hooks/use-game-progress';
import { getRoundsForLevel } from '../../utils/game-config';

const brushColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6', '#E67E22'];

interface DrawPoint {
  x: number;
  y: number;
  color: string;
}

export function SymmetryMirror() {
  const navigate = useNavigate();
  const { theme } = useSettings();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({ 
    gameId: 'creative/intermediate/symmetry-mirror', 
    categoryId: 'creative' 
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(brushColors[0]);
  const [drawPoints, setDrawPoints] = useState<DrawPoint[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [stars] = useState(3);
  const totalRounds = getRoundsForLevel('intermediate'); // 4 rounds
  const { message, celebrate } = useCompanionMessage();

  useEffect(() => {
    drawCanvas();
  }, [drawPoints]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = theme === 'dark' ? 'rgba(228, 220, 207, 0.05)' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw all points (left side and mirrored right side)
    drawPoints.forEach(point => {
      // Left side (original)
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Right side (mirrored)
      const mirroredX = canvas.width - point.x;
      ctx.beginPath();
      ctx.arc(mirroredX, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Only allow drawing on left half
    if (x > canvas.width / 2) return null;

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setDrawPoints([...drawPoints, { ...coords, color: currentColor }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e);
    if (coords) {
      setDrawPoints([...drawPoints, { ...coords, color: currentColor }]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (coords) {
      setIsDrawing(true);
      setDrawPoints([...drawPoints, { ...coords, color: currentColor }]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e);
    if (coords) {
      setDrawPoints([...drawPoints, { ...coords, color: currentColor }]);
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setDrawPoints([]);
  };

  const handleComplete = () => {
    celebrate();
    
    setTimeout(() => {
      if (currentRound + 1 < totalRounds) {
        setCurrentRound(currentRound + 1);
        setDrawPoints([]);
      } else {
        completeGame(stars);
        setTimeout(() => navigate('/game/creative'), 500);
      }
    }, 1000);
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
                ✨ Symmetry Mirror
              </h1>
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : '#6b7280',
                }}
              >
                Draw on the left - watch it mirror on the right!
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
                Symmetry is found in nature: butterflies, flowers, and faces all have matching sides! 🦋
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
                Drawing {currentRound + 1} of {totalRounds}
              </div>
            </div>

            {/* Canvas */}
            <div className="mb-6">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="mx-auto rounded-3xl shadow-2xl cursor-crosshair"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.05)' : '#ffffff',
                  border: `4px solid ${theme === 'dark' ? 'rgba(228, 220, 207, 0.2)' : '#e5e7eb'}`,
                  touchAction: 'none',
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
                Draw only on the left side to see the magic! ✨
              </p>
            </div>

            {/* Color Palette */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Palette className="w-5 h-5" style={{ color: theme === 'dark' ? '#E4DCCF' : '#1F2023' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  }}
                >
                  Choose Color:
                </span>
              </div>
              
              <div className="flex justify-center gap-3 flex-wrap">
                {brushColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className="transition-all"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      backgroundColor: color,
                      border: `4px solid ${currentColor === color ? '#FDB022' : theme === 'dark' ? 'rgba(228, 220, 207, 0.3)' : '#e5e7eb'}`,
                      cursor: 'pointer',
                      boxShadow: currentColor === color ? '0 4px 12px rgba(253, 176, 34, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transform: currentColor === color ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentColor !== color) e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (currentColor !== color) e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClear}
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
                <Eraser className="w-5 h-5" />
                Clear
              </button>

              <button
                onClick={handleComplete}
                disabled={drawPoints.length === 0}
                className="px-10 py-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: '#9B59B6',
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  cursor: drawPoints.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: drawPoints.length === 0 ? 0.5 : 1,
                  boxShadow: '0 4px 16px rgba(155, 89, 182, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (drawPoints.length > 0) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (drawPoints.length > 0) e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {currentRound + 1 < totalRounds ? 'Next Drawing' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}