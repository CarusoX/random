'use client';

import { useMemo, useState } from 'react';

const faceColors = {
  front: '#16a34a',   // green
  back: '#f97316',    // orange
  right: '#3b82f6',   // blue
  left: '#e11d48',    // red
  top: '#eab308',     // yellow
  bottom: '#ffffff',  // white
};

type Rotation = { x: number; y: number };

const presetRotations: Rotation[] = [
  { x: -20, y: -30 },
  { x: -10, y: 30 },
  { x: 20, y: -60 },
  { x: 30, y: 120 },
];

// Representación del cubo mezclado a 20 movimientos
// Cada array representa una cara (3x3 = 9 stickers)
// Los valores son índices que referencian los colores de faceColors
// 0=front, 1=back, 2=right, 3=left, 4=top, 5=bottom
type FaceColorIndex = 0 | 1 | 2 | 3 | 4 | 5;

interface CubeState {
  front: FaceColorIndex[];
  back: FaceColorIndex[];
  right: FaceColorIndex[];
  left: FaceColorIndex[];
  top: FaceColorIndex[];
  bottom: FaceColorIndex[];
}

// Estado del cubo mezclado a 20 movimientos
// Representa un cubo válido pero claramente mezclado
// Cada cara tiene su color central correcto (posición 4 = centro), pero los bordes y esquinas están mezclados
// Layout de cada cara (3x3): [0,1,2 / 3,4,5 / 6,7,8] donde 4 es el centro
const scrambledState20: CubeState = {
  front: [4, 4, 1, 1, 0, 3, 5, 5, 1], // 0 green
  left: [4, 4, 2, 0, 1, 2, 5, 5, 2], // 1 red
  back: [4, 4, 3, 3, 2, 1, 5, 5, 3], // 2 orange
  right: [4, 4, 0, 2, 3, 0, 5, 5, 0], // 3 blue
  top: [0, 2, 1, 1, 4, 3, 3, 0, 2], // 4 yellow 
  bottom: [3, 0, 2, 1, 5, 3, 0, 2, 1], // 5 white
};

const colorMap: Record<FaceColorIndex, string> = {
  0: faceColors.front,
  1: faceColors.back,
  2: faceColors.right,
  3: faceColors.left,
  4: faceColors.top,
  5: faceColors.bottom,
};

export default function RubiksCube() {
  const [rotationIndex, setRotationIndex] = useState(0);

  const rotation = useMemo(() => presetRotations[rotationIndex], [rotationIndex]);

  const handleRotate = () => {
    setRotationIndex((prev) => (prev + 1) % presetRotations.length);
  };

  return (
    <div className="cube-panel">
      <div className="cube-header">
        <button type="button" onClick={handleRotate} className="cube-rotate">
          Girar vista
        </button>
      </div>
      <div className="cube-scene">
        <div className="cube" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
          <CubeFace position="front" colors={scrambledState20.front} label="Frente" />
          <CubeFace position="back" colors={scrambledState20.back} label="Atrás" />
          <CubeFace position="right" colors={scrambledState20.right} label="Derecha" />
          <CubeFace position="left" colors={scrambledState20.left} label="Izquierda" />
          <CubeFace position="top" colors={scrambledState20.top} label="Arriba" />
          <CubeFace position="bottom" colors={scrambledState20.bottom} label="Abajo" />
        </div>
      </div>
    </div>
  );
}

interface CubeFaceProps {
  position: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
  colors: FaceColorIndex[];
  label: string;
}

function CubeFace({ position, colors, label }: CubeFaceProps) {
  return (
    <div className={`cube-face ${position}`}>
      <div className="face-grid">
        {colors.map((colorIndex, idx) => (
          <div
            key={idx}
            className="face-cell"
            style={{ backgroundColor: colorMap[colorIndex] }}
          />
        ))}
      </div>
      <span className="face-label">{label}</span>
    </div>
  );
}
