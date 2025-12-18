import { NextResponse } from 'next/server';
import { readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DATA_DIR = join(process.cwd(), 'data');
const PLAYERS_FILE = join(DATA_DIR, 'players.json');

interface PlayerData {
  name: string;
  currentLevel: number;
  lastUpdated: string;
}

interface PlayersData {
  [playerId: string]: PlayerData;
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readPlayers(): Promise<PlayersData> {
  await ensureDataDir();
  if (!existsSync(PLAYERS_FILE)) {
    return {};
  }
  const content = await readFile(PLAYERS_FILE, 'utf-8');
  return JSON.parse(content);
}

export async function GET() {
  try {
    const players = await readPlayers();
    
    // Convert to array, filter players with names, and sort by level (descending), then by lastUpdated (ascending)
    const playersArray = Object.entries(players)
      .filter(([_, data]) => data.name && data.name.trim())
      .map(([playerId, data]) => ({
        playerId,
        name: data.name,
        currentLevel: data.currentLevel,
        lastUpdated: data.lastUpdated
      }))
      .sort((a, b) => {
        // First sort by level (descending)
        if (b.currentLevel !== a.currentLevel) {
          return b.currentLevel - a.currentLevel;
        }
        // Then by lastUpdated (ascending) - older first (first to complete wins tie)
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      });

    return NextResponse.json({ players: playersArray });
  } catch (error) {
    console.error('Error reading players data:', error);
    return NextResponse.json({ error: 'Error al leer datos' }, { status: 500 });
  }
}

