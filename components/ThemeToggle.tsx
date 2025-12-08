'use client';

interface ThemeToggleProps {
  isLightMode: boolean;
  onToggle: (isLight: boolean) => void;
}

export default function ThemeToggle({ isLightMode, onToggle }: ThemeToggleProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      display: 'flex',
      gap: '0.25rem',
      alignItems: 'center',
      zIndex: 1000,
      backgroundColor: '#0f1115',
      padding: '0.25rem',
      borderRadius: '10px',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <button
        onClick={() => onToggle(false)}
        style={{
          padding: '0.5rem 0.75rem',
          backgroundColor: isLightMode ? 'transparent' : 'var(--accent)',
          color: isLightMode ? 'var(--muted)' : '#061204',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          fontWeight: isLightMode ? '400' : '700',
          transition: 'all 0.15s ease'
        }}
      >
        🌙
      </button>
      <button
        onClick={() => onToggle(true)}
        style={{
          padding: '0.5rem 0.75rem',
          backgroundColor: isLightMode ? 'var(--accent)' : 'transparent',
          color: isLightMode ? '#061204' : 'var(--muted)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          fontWeight: isLightMode ? '700' : '400',
          transition: 'all 0.15s ease'
        }}
      >
        ☀️
      </button>
    </div>
  );
}

