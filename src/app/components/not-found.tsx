import { Link } from 'react-router';
import { Home, Frown } from 'lucide-react';

export function NotFound() {
  return (
    <div 
      className="min-h-screen px-4 py-8 flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(to bottom, #F8F6F3, #EAE6DF)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-md w-full text-center">
        <div 
          className="bg-white rounded-3xl p-8"
          style={{
            border: '3px solid #7C8B95',
            boxShadow: '0 8px 32px rgba(124, 139, 149, 0.2)',
          }}
        >
          <Frown className="w-20 h-20 mx-auto mb-4" style={{ color: '#7C8B95' }} />
          
          <h1 
            className="mb-2"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            404
          </h1>
          
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1F2023',
              textTransform: 'uppercase',
            }}
          >
            PAGE NOT FOUND
          </h2>
          
          <p className="mb-8" style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Oops! This page doesn't exist.
          </p>

          <Link
            to="/practice"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl transition-all"
            style={{
              backgroundColor: '#7D9D9C',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(125, 157, 156, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Home className="w-5 h-5" />
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
