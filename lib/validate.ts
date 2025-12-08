import { loadPuzzles } from './loadPuzzles';

export async function validateAnswer(id: number, answer: string) {
  const puzzles = await loadPuzzles();
  const puzzle = puzzles.find((p) => p.id === id);

  if (!puzzle) return { correct: false, total: puzzles.length };

  const normalized = (value: string) => value.trim().toLowerCase();
  const correct = normalized(puzzle.answer) === normalized(answer);

  return { correct, total: puzzles.length };
}
