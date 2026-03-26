import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Trash2, Check } from 'lucide-react';
import { useGameProgress } from '../../hooks/use-game-progress';
import { useTranslation } from '../../hooks/use-translation';

const colors = ['#7D9D9C', '#C08B7E', '#7C8B95', '#FDB022', '#FF6B6B'];

const prompts = [
  { text: 'Draw a happy face! 😊', emoji: '😊' },
  { text: 'Draw a house! 🏠', emoji: '🏠' },
  { text: 'Draw the sun! ☀️', emoji: '☀️' },
  { text: 'Draw a flower! 🌸', emoji: '🌸' },
  { text: 'Draw a heart! ❤️', emoji: '❤️' },
];

export function CreativeDraw() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { completeGame } = useGameProgress({
    gameId: 'creative/beginner/creative-draw', 
    categoryId: 'creative' 
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    
    // Initialize canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDone = () => {
    setShowComplete(true);
    // Everyone gets 3 stars for completing a creative task!
    completeGame(0, 3);
  };

  return (
    <div 
      className="min-h-screen px-4 sm:px-6 py-6 sm:py-8"
      style={{ 
        background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/practice" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontSize: '0.9375rem' }}>{t('games.back')}</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 
            className="mb-3"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            {currentPrompt.text}
          </h1>
          
          <div style={{ fontSize: '4rem', margin: '1rem 0' }}>
            {currentPrompt.emoji}
          </div>

          <p 
            className="mb-8 text-gray-600"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
            }}
          >
            Use your finger or mouse to draw!
          </p>
        </div>

        {/* Canvas */}
        <div className="mb-6">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full rounded-3xl cursor-crosshair"
            style={{
              border: '4px solid #7C8B95',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              touchAction: 'none',
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Color Palette */}
        <div className="mb-6">
          <p 
            className="text-center mb-3 text-gray-500"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
            }}
          >
            PICK A COLOR:
          </p>
          <div className="flex items-center justify-center gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className="w-14 h-14 rounded-full transition-all hover:scale-110"
                style={{
                  backgroundColor: color,
                  border: currentColor === color ? '4px solid #1F2023' : '3px solid white',
                  boxShadow: currentColor === color 
                    ? `0 4px 16px ${color}80` 
                    : '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={clearCanvas}
            className="px-6 py-3 rounded-2xl transition-all hover:scale-105 flex items-center gap-2"
            style={{
              backgroundColor: '#FF6B6B20',
              color: '#FF6B6B',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              border: '3px solid #FF6B6B',
            }}
          >
            <Trash2 className="w-5 h-5" />
            CLEAR
          </button>

          <button
            onClick={handleDone}
            className="px-8 py-3 rounded-2xl text-white transition-all hover:scale-105 flex items-center gap-2"
            style={{
              backgroundColor: '#7C8B95',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: '0 4px 16px #7C8B9560',
            }}
          >
            <Check className="w-5 h-5" />
            I'M DONE!
          </button>
        </div>

        {showComplete && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div 
              className="bg-white rounded-3xl p-12 text-center max-w-md mx-4"
              style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
            >
              <p 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#1F2023',
                  textTransform: 'uppercase',
                }}
              >
                🎨 BEAUTIFUL! 🎨
              </p>
              
              <p 
                className="mt-4"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  color: '#7C8B95',
                }}
              >
                You're so creative!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}