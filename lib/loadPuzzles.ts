export interface Puzzle {
  step: number;
  id: string;
  title: string;
  prompt: string;
  answer: string;
  hint?: string;
  dynamicPrompt?: boolean;
}

export async function loadPuzzles(): Promise<Puzzle[]> {
  // Check if we're on the server (Node.js environment)
  if (typeof window === 'undefined') {
    // Server-side: use filesystem
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    const filePath = join(process.cwd(), 'public', 'puzzles.json');
    const fileContents = await readFile(filePath, 'utf-8');
    const data: Puzzle[] = JSON.parse(fileContents);
    return data.sort((a, b) => a.step - b.step);
  } else {
    // Client-side: use fetch
    const response = await fetch('/puzzles.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar puzzles.json');
    }
    const data: Puzzle[] = await response.json();
    return data.sort((a, b) => a.step - b.step);
  }
}
