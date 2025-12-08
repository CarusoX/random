import { loadPuzzles } from './loadPuzzles';

export async function validateAnswer(id: number, answer: string) {
  const puzzles = await loadPuzzles();
  const puzzle = puzzles.find((p) => p.id === id);

  if (!puzzle) return { correct: false, total: puzzles.length };

  const normalized = (value: string) => value.trim().toLowerCase();
  
  // Para el puzzle de Caesar (id 3), la respuesta correcta es siempre "ME GUSTA EL FERNET"
  if (id === 3) {
    const correct = normalized('ME GUSTA EL FERNET') === normalized(answer);
    return { correct, total: puzzles.length };
  }
  
  // Para el puzzle de Pi Clock (id 4), aceptar "PI" o "π"
  if (id === 4) {
    const normalizedAnswer = normalized(answer);
    const correct = normalizedAnswer === 'pi' || normalizedAnswer === 'π' || normalizedAnswer === normalized('PI');
    return { correct, total: puzzles.length };
  }
  
  const correct = normalized(puzzle.answer) === normalized(answer);

  return { correct, total: puzzles.length };
}
