'use client';

import { useMemo, useState } from 'react';

const faceColors = {
  front: '#16a34a',
  back: '#f97316',
  right: '#3b82f6',
  left: '#e11d48',
  top: '#eab308',
  bottom: '#a855f7',
};

type Rotation = { x: number; y: number };

const presetRotations: Rotation[] = [
  { x: -20, y: -30 },
  { x: -10, y: 30 },
  { x: 20, y: -60 },
  { x: 30, y: 120 },
];

export default function RubiksCube() {
  const [rotationIndex, setRotationIndex] = useState(0);

  const rotation = useMemo(() => presetRotations[rotationIndex], [rotationIndex]);

  const handleRotate = () => {
    setRotationIndex((prev) => (prev + 1) % presetRotations.length);
  };

  return (
    <div className="cube-panel">
      <div className="cube-header">
        <span>Scramble a 20 movimientos de la solución</span>
        <button type="button" onClick={handleRotate} className="cube-rotate">
          Girar vista
        </button>
      </div>
      <div className="cube-scene">
        <div className="cube" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
          <CubeFace position="front" color={faceColors.front} label="Frente" />
          <CubeFace position="back" color={faceColors.back} label="Atrás" />
          <CubeFace position="right" color={faceColors.right} label="Derecha" />
          <CubeFace position="left" color={faceColors.left} label="Izquierda" />
          <CubeFace position="top" color={faceColors.top} label="Arriba" />
          <CubeFace position="bottom" color={faceColors.bottom} label="Abajo" />
        </div>
      </div>
      <p className="cube-caption">
        El patrón ya ha sido mezclado con una secuencia óptima. No necesitas saber la secuencia exacta, solo el
        mínimo de movimientos restantes para dejarlo perfecto.
      </p>
    </div>
  );
}

interface CubeFaceProps {
  position: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
  color: string;
  label: string;
}

function CubeFace({ position, color, label }: CubeFaceProps) {
  return (
    <div className={`cube-face ${position}`} style={{ backgroundColor: color }}>
      <div className="face-grid">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className="face-cell" />
        ))}
      </div>
      <span className="face-label">{label}</span>
    </div>
  );
}
