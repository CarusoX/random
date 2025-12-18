import { loadPuzzles } from './loadPuzzles';

export async function validateAnswer(id: string, answer: string) {
  console.log('[validate] Starting validation for:', { id, answer: answer.substring(0, 50) });
  
  let puzzles;
  try {
    puzzles = await loadPuzzles();
    console.log('[validate] Loaded puzzles, count:', puzzles.length);
  } catch (error) {
    console.error('[validate] Error loading puzzles:', error);
    throw error;
  }

  const puzzle = puzzles.find((p) => p.id === id);
  console.log('[validate] Found puzzle:', puzzle ? { id: puzzle.id, answer: puzzle.answer } : 'NOT FOUND');

  if (!puzzle) {
    console.error('[validate] Puzzle not found for id:', id);
    console.log('[validate] Available puzzle IDs:', puzzles.map(p => p.id));
    return { correct: false, total: puzzles.length };
  }

  const normalized = (value: string) => value.trim().toLowerCase();
  
  // Para el puzzle de Caesar (id "caesar"), la respuesta correcta es siempre "ME GUSTA EL FERNET"
  if (id === 'caesar') {
    const expected = normalized('ME GUSTA EL FERNET');
    const received = normalized(answer);
    const correct = expected === received;
    console.log('[validate] Caesar check:', { expected, received, correct });
    return { correct, total: puzzles.length };
  }
  
  // Para el puzzle de Pi Clock (id "pi-clock"), aceptar "PI" o "π"
  if (id === 'pi-clock') {
    const normalizedAnswer = normalized(answer);
    const correct = normalizedAnswer === 'pi' || normalizedAnswer === 'π' || normalizedAnswer === normalized('PI');
    console.log('[validate] Pi-clock check:', { normalizedAnswer, correct });
    return { correct, total: puzzles.length };
  }

  // Binary search es validado en el cliente; aquí aceptamos cualquier valor si llega
  if (id === 'binary-search') {
    console.log('[validate] Binary-search: always correct');
    return { correct: true, total: puzzles.length };
  }
  
  const expected = normalized(puzzle.answer);
  const received = normalized(answer);
  const correct = expected === received;
  
  console.log('[validate] Standard check:', { 
    id, 
    expected, 
    received, 
    correct,
    expectedLength: expected.length,
    receivedLength: received.length
  });

  return { correct, total: puzzles.length };
}
