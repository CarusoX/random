'use client';

import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';
import NightMessage from '@/components/NightMessage';

interface Challenge5Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
  isLightMode?: boolean;
}

export default function Challenge5({ puzzle, onSubmit, disabled, isLightMode = false }: Challenge5Props) {
  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.id}`} 
      prompt={puzzle.prompt} 
      hint={puzzle.hint}
      extra={<NightMessage isLightMode={isLightMode} />}
    >
      <InputAnswer onSubmit={onSubmit} disabled={disabled} />
    </PuzzleCard>
  );
}

