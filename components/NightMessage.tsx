'use client';

interface NightMessageProps {
  isLightMode: boolean;
}

export default function NightMessage({ isLightMode }: NightMessageProps) {
  return (
    <div style={{
      marginTop: '1rem',
      padding: '1.5rem',
      backgroundColor: isLightMode ? '#ffffff' : '#0a0a0a',
      borderRadius: '8px',
      border: '1px solid #333',
      textAlign: 'center',
      minHeight: '150px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      transition: 'background-color 0.3s ease'
    }}
    onContextMenu={(e) => e.preventDefault()}
    onDragStart={(e) => e.preventDefault()}
    >
      <svg
        width="300"
        height="150"
        viewBox="0 0 300 150"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          pointerEvents: 'none'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Fondo que cambia según el modo */}
        <rect width="300" height="150" fill={isLightMode ? '#ffffff' : '#0a0a0a'} />
        
        {/* Texto - oscuro en modo oscuro (invisible), negro en modo claro (visible) */}
        <text
          x="150"
          y="60"
          textAnchor="middle"
          fontSize="20"
          fill={isLightMode ? '#000000' : '#0a0a0a'}
          fontWeight="bold"
          fontFamily="monospace"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          MUERTE AL
        </text>
        
        <text
          x="150"
          y="90"
          textAnchor="middle"
          fontSize="20"
          fill={isLightMode ? '#000000' : '#0a0a0a'}
          fontWeight="bold"
          fontFamily="monospace"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          LIGHT MODE
        </text>
      </svg>
    </div>
  );
}

