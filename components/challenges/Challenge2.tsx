'use client';

import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';
import PigpenCipher from '@/components/PigpenCipher';

interface Challenge2Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

export default function Challenge2({ puzzle, onSubmit, disabled }: Challenge2Props) {
  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.id}`} 
      prompt={puzzle.prompt} 
      hint={puzzle.hint}
      extra={<PigpenCipher text={puzzle.answer} />}
    >
      <InputAnswer onSubmit={onSubmit} disabled={disabled} />
    </PuzzleCard>
  );
}

