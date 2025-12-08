'use client';

import { useEffect, useState } from 'react';
import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';

interface Challenge3Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

export default function Challenge3({ puzzle, onSubmit, disabled }: Challenge3Props) {
  const [prompt, setPrompt] = useState<string>(puzzle.prompt);
  const [hint, setHint] = useState<string>(puzzle.hint || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hacer fetch para obtener el prompt dinámico
    fetch(`/api/puzzle/${puzzle.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.prompt) {
          setPrompt(data.prompt);
        }
        if (data.hint) {
          setHint(data.hint);
        }
      })
      .catch(() => {
        // Si falla, usar el prompt del puzzle
      })
      .finally(() => setLoading(false));
  }, [puzzle.id]);

  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.id}`} 
      prompt={loading ? 'Cargando...' : prompt} 
      hint={hint}
    >
      <InputAnswer onSubmit={onSubmit} disabled={disabled || loading} />
    </PuzzleCard>
  );
}

