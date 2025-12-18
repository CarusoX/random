'use client';

import { useMemo } from 'react';
import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';

interface Challenge8Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

// Calculate number of ways to reach step n using DP
function calculateWays(n: number): number {
  if (n === 0) return 1;
  if (n === 1) return 1;
  if (n === 2) return 2;
  
  const dp = [1, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
  }
  return dp[n];
}

export default function Challenge8({ puzzle, onSubmit, disabled }: Challenge8Props) {
  const sequence = useMemo(() => {
    return [1, 2, 3, 4, 5].map(step => ({
      step,
      ways: calculateWays(step)
    }));
  }, []);

  const problemDescription = `Imagina que estás al pie de una escalera. En cada paso, puedes avanzar 1, 2 o 3 escalones hacia arriba.

Por ejemplo:
- Para llegar al escalón 1: solo hay 1 manera (dar 1 paso)
- Para llegar al escalón 2: hay 2 maneras (1+1 o 2)
- Para llegar al escalón 3: hay 4 maneras (1+1+1, 1+2, 2+1, o 3)
- Y así sucesivamente...`;

  const prompt = `${problemDescription}

Secuencia para los primeros escalones:
${sequence.map(({ step, ways }) => `Escalón ${step}: ${ways} manera${ways !== 1 ? 's' : ''}`).join('\n')}

¿Cuántas maneras hay de llegar al escalón 15?`;

  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.step + 1}`} 
      prompt={prompt} 
      hint={puzzle.hint}
    >
      <InputAnswer onSubmit={onSubmit} disabled={disabled} placeholder="Ingresa el número de maneras" />
    </PuzzleCard>
  );
}

