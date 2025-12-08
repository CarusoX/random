import fs from 'fs/promises';
import path from 'path';

export interface Puzzle {
  id: number;
  title: string;
  prompt: string;
  answer: string;
  hint?: string;
}

export async function loadPuzzles(): Promise<Puzzle[]> {
  // Server-side: read from the filesystem to avoid extra fetch hops.
  if (typeof window === 'undefined') {
    const filePath = path.join(process.cwd(), 'public', 'puzzles.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const data: Puzzle[] = JSON.parse(raw);
    return data.sort((a, b) => a.id - b.id);
  }

  // Client-side: fetch from the public asset.
  const response = await fetch('/puzzles.json');
  if (!response.ok) {
    throw new Error('No se pudo cargar puzzles.json');
  }
  const clientData: Puzzle[] = await response.json();
  return clientData.sort((a, b) => a.id - b.id);
}
