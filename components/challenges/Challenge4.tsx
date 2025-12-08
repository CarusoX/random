'use client';

import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';
import PiClock from '@/components/PiClock';

interface Challenge4Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

export default function Challenge4({ puzzle, onSubmit, disabled }: Challenge4Props) {
  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.id}`} 
      prompt={puzzle.prompt} 
      hint={puzzle.hint}
      extra={<PiClock />}
    >
      <InputAnswer onSubmit={onSubmit} disabled={disabled} />
    </PuzzleCard>
  );
}

