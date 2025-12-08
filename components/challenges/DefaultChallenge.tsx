'use client';

import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';

interface DefaultChallengeProps {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

export default function DefaultChallenge({ puzzle, onSubmit, disabled }: DefaultChallengeProps) {
  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.id}`} 
      prompt={puzzle.prompt || 'Pendiente de contenido'} 
      hint={puzzle.hint}
    >
      <InputAnswer onSubmit={onSubmit} disabled={disabled} />
    </PuzzleCard>
  );
}
