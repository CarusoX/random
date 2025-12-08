'use client';

import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';
import RubiksCube from '@/components/RubiksCube';

interface Challenge1Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

export default function Challenge1({ puzzle, onSubmit, disabled }: Challenge1Props) {
  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.id}`} 
      prompt={puzzle.prompt} 
      hint={puzzle.hint}
      extra={<RubiksCube />}
    >
      <InputAnswer onSubmit={onSubmit} disabled={disabled} />
    </PuzzleCard>
  );
}

