export interface Puzzle {
  step: number;
  id: string;
  title: string;
  prompt: string;
  answer: string;
  hint?: string;
  dynamicPrompt?: boolean;
}

// Import puzzles.json directly as a module (works in both server and client)
import puzzlesData from '../public/puzzles.json';

export async function loadPuzzles(): Promise<Puzzle[]> {
  // Check if we're on the server (Node.js environment)
  if (typeof window === 'undefined') {
    // Server-side: use imported JSON directly
    console.log('[loadPuzzles] Loaded from imported module (server-side)');
    return (puzzlesData as Puzzle[]).sort((a, b) => a.step - b.step);
  } else {
    // Client-side: use fetch (for consistency, though we could also use the import)
    try {
      const response = await fetch('/puzzles.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar puzzles.json');
      }
      const data: Puzzle[] = await response.json();
      return data.sort((a, b) => a.step - b.step);
    } catch (error) {
      // Fallback to imported data if fetch fails
      console.log('[loadPuzzles] Fetch failed, using imported data:', error);
      return (puzzlesData as Puzzle[]).sort((a, b) => a.step - b.step);
    }
  }
}
