'use client';

import { pigpenEncrypt } from '@/lib/pigpen';

interface PigpenCipherProps {
  text: string;
}

export default function PigpenCipher({ text }: PigpenCipherProps) {
  const encrypted = pigpenEncrypt(text);

  return (
    <div style={{ 
      marginTop: '1rem',
      padding: '1.5rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid #333',
      textAlign: 'center',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none'
    }}>
      <div style={{ 
        fontSize: '4rem',
        marginBottom: '1rem',
        lineHeight: '1'
      }}>
        🐷
      </div>
      <div 
        style={{
          fontSize: '3rem',
          letterSpacing: '1rem',
          fontFamily: '"Pigpen HHXX", monospace',
          lineHeight: '2',
          wordBreak: 'break-word',
          color: '#e5e7eb',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          pointerEvents: 'none'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {encrypted.split('').map((char, index) => (
          <span 
            key={index} 
            style={{ 
              display: 'inline-block',
              minWidth: char === ' ' ? '1rem' : '2.5rem',
              textAlign: 'center',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              pointerEvents: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
}

