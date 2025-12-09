'use client';

import { useEffect, useMemo, useState } from 'react';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';
import type { Puzzle } from '@/lib/loadPuzzles';

interface Challenge7Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

const MESSAGE = 'NO HAY 5G';
const STORAGE_KEY = 'ping-progress-index';

export default function Challenge6({ puzzle, onSubmit, disabled }: Challenge7Props) {
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    // Cada recarga avanza al siguiente carácter
    const stored = localStorage.getItem(STORAGE_KEY);
    const currentIndex = stored ? Number(stored) % MESSAGE.length : 0;
    const char = MESSAGE[currentIndex];
    setPercent(char.charCodeAt(0));

    const nextIndex = (currentIndex + 1) % MESSAGE.length;
    localStorage.setItem(STORAGE_KEY, String(nextIndex));
  }, []);

  const barWidth = useMemo(() => `${Math.min(percent, 100)}%`, [percent]);

  return (
    <PuzzleCard
      title={puzzle.title || `Puzzle ${puzzle.step + 1}`}
      prompt={puzzle.prompt}
      hint={puzzle.hint}
    >
      <div
        style={{
          background: '#0f1115',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ color: '#9ca3af' }}>Ping</span>
          <span style={{ color: '#22c55e', fontWeight: 700 }}>{percent}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '12px',
            background: '#0c0d11',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: barWidth,
              height: '100%',
              background: 'linear-gradient(90deg, #16a34a, #22c55e)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <InputAnswer onSubmit={onSubmit} disabled={disabled} />
    </PuzzleCard>
  );
}

