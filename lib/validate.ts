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

  // Binary search es validado en el cliente; aquí aceptamos cualquier valor si llega
  if (id === 'binary-search') {
    return { correct: true, total: puzzles.length };
  }
  
  // Pangram substitution cipher - validate against stored cipher answer
  if (id === 'pangram-substitution') {
    try {
      const { readFile, mkdir } = await import('fs/promises');
      const { join } = await import('path');
      const { existsSync } = await import('fs');
      
      const DATA_DIR = join(process.cwd(), 'data');
      const CIPHERS_FILE = join(DATA_DIR, 'ciphers.json');
      
      if (existsSync(CIPHERS_FILE)) {
        const content = await readFile(CIPHERS_FILE, 'utf-8');
        const ciphers = JSON.parse(content);
        const cipherData = ciphers[id];
        
        if (cipherData && cipherData.answer) {
          const correct = normalized(cipherData.answer) === normalized(answer);
          return { correct, total: puzzles.length };
        }
      }
    } catch (error) {
      console.error('Error validating pangram answer:', error);
    }
    return { correct: false, total: puzzles.length };
  }
  
  const correct = normalized(puzzle.answer) === normalized(answer);

  return { correct, total: puzzles.length };
}
