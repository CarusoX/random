'use client';

import { useEffect, useState } from 'react';

// Primeros 10 dígitos de pi: 3.1415926535 (sin el punto decimal: 3, 1, 4, 1, 5, 9, 2, 6, 5, 3)
const PI_DIGITS = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

export default function PiClock() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDigit, setCurrentDigit] = useState(PI_DIGITS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % PI_DIGITS.length;
        setCurrentDigit(PI_DIGITS[nextIndex]);
        return nextIndex;
      });
    }, 1000); // Cambia cada segundo

    return () => clearInterval(interval);
  }, []);

  const clockNumber = currentDigit === 0 ? 12 : currentDigit;
  const angle = (clockNumber * 30) % 360;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '1rem'
    }}>
      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        border: '3px solid #22c55e',
        backgroundColor: '#0f1115',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Números del reloj */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
          const numAngle = (index * 30 - 90) * (Math.PI / 180);
          const radius = 80;
          const x = Math.cos(numAngle) * radius;
          const y = Math.sin(numAngle) * radius;
          
          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                color: '#e5e7eb',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Manecilla */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '3px',
            height: '70px',
            backgroundColor: '#22c55e',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            borderRadius: '2px',
            transition: 'transform 0.3s ease',
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
          }}
        />

        {/* Centro del reloj */}
        <div
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            zIndex: 10,
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)'
          }}
        />
      </div>
    </div>
  );
}

