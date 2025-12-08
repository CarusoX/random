export interface Puzzle {
  id: number;
  title: string;
  prompt: string;
  answer: string;
  hint?: string;
}

export async function loadPuzzles(): Promise<Puzzle[]> {
  // Fetch from the public asset
  const response = await fetch('/puzzles.json');
  if (!response.ok) {
    throw new Error('No se pudo cargar puzzles.json');
  }
  const data: Puzzle[] = await response.json();
  return data.sort((a, b) => a.id - b.id);
}
