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

const MIN = 1;
const MAX = 999;
const MAX_MOVES = Math.ceil(Math.log2(MAX - MIN + 1)); // 10

type State = 'playing' | 'won' | 'lost';

export default function Challenge7({ puzzle, onSubmit, disabled }: Challenge7Props) {
  const [low, setLow] = useState(MIN);
  const [high, setHigh] = useState(MAX);
  const [moves, setMoves] = useState(0);
  const [state, setState] = useState<State>('playing');
  const [error, setError] = useState<string | null>(null);
  const [lastHint, setLastHint] = useState<'alto' | 'bajo' | null>(null);

  const movesLeft = useMemo(() => Math.max(0, MAX_MOVES - moves), [moves]);

  const handlePlay = async (value: string) => {
    if (state !== 'playing') return false;
    const guess = Number(value);
    if (Number.isNaN(guess) || guess < MIN || guess > MAX) {
      setError('Número fuera de rango válido.');
      return false;
    }

    const nextMoves = moves + 1;
    setMoves(nextMoves);
    setError(null);

    // Último movimiento: solo gana si el rango ya está colapsado y acierta ese único número
    if (nextMoves >= MAX_MOVES) {
      if (low === high && guess === low) {
        setState('won');
        return onSubmit('OK');
      }
      setState('lost');
      setError('No colapsaste el rango a un solo valor. Refresca para reintentar.');
      return false;
    }

    // Elegir el lado que deja el rango más grande (si empate, random)
    const leftHigh = Math.max(low, guess - 1);
    const rightLow = Math.min(high, guess + 1);
    const leftSize = leftHigh >= low ? leftHigh - low + 1 : 0;
    const rightSize = rightLow <= high ? high - rightLow + 1 : 0;

    // Ambos lados vacíos: el guess era la única opción, pero no acertó antes del último movimiento → pierde
    if (leftSize === 0 && rightSize === 0) {
      setState('lost');
      setError('Sin rango válido restante. Refresca para reintentar.');
      return false;
    }

    let goRight = false;
    if (leftSize === 0 && rightSize > 0) goRight = true;
    else if (rightSize === 0 && leftSize > 0) goRight = false;
    else if (rightSize > leftSize) goRight = true;
    else if (rightSize < leftSize) goRight = false;
    else goRight = Math.random() < 0.5;

    if (goRight) {
      setLow(rightLow);
      setLastHint('alto');
    } else {
      setHigh(leftHigh);
      setLastHint('bajo');
    }

    return false;
  };

  return (
    <PuzzleCard
      title={puzzle.title || `Puzzle ${puzzle.step + 1}`}
      prompt={puzzle.prompt}
      hint={puzzle.hint}
    >
      <div style={{ marginBottom: '0.75rem', color: '#9ca3af', fontSize: '0.95rem' }}>
        Movimientos restantes: {movesLeft}
      </div>

      {lastHint && state === 'playing' && (
        <div style={{ color: '#fbbf24', marginBottom: '0.75rem' }}>
          {lastHint === 'alto' ? 'Más alto' : 'Más bajo'}
        </div>
      )}

      {state === 'lost' && (
        <div style={{ color: '#f87171', marginBottom: '0.75rem' }}>
          {error || 'Perdiste. Refresca para reintentar.'}
        </div>
      )}

      {state === 'won' && (
        <div style={{ color: '#22c55e', marginBottom: '0.75rem' }}>
          ¡Perfecto! Adivinaste el número.
        </div>
      )}

      <InputAnswer
        onSubmit={handlePlay}
        disabled={disabled || state !== 'playing'}
        placeholder="Ingresa un número"
      />
    </PuzzleCard>
  );
}

