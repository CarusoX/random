import { loadPuzzles } from './loadPuzzles';

export async function validateAnswer(id: string, answer: string) {
  const puzzles = await loadPuzzles();
  const puzzle = puzzles.find((p) => p.id === id);

  if (!puzzle) return { correct: false, total: puzzles.length };

  const normalized = (value: string) => value.trim().toLowerCase();
  
  // Para el puzzle de Caesar (id "caesar"), la respuesta correcta es siempre "ME GUSTA EL FERNET"
  if (id === 'caesar') {
    const correct = normalized('ME GUSTA EL FERNET') === normalized(answer);
    return { correct, total: puzzles.length };
  }
  
  // Para el puzzle de Pi Clock (id "pi-clock"), aceptar "PI" o "π"
  if (id === 'pi-clock') {
    const normalizedAnswer = normalized(answer);
    const correct = normalizedAnswer === 'pi' || normalizedAnswer === 'π' || normalizedAnswer === normalized('PI');
    return { correct, total: puzzles.length };
  }
  
  const correct = normalized(puzzle.answer) === normalized(answer);

  return { correct, total: puzzles.length };
}
