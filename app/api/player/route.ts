import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFile, writeFile, mkdir } from 'fs/promises';
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

async function writePlayers(data: PlayersData): Promise<void> {
  await ensureDataDir();
  await writeFile(PLAYERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getOrCreatePlayerId(request: NextRequest): string {
  const cookieStore = cookies();
  let playerId = cookieStore.get('player-id')?.value;

  if (!playerId) {
    // Generar un ID único
    playerId = `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  return playerId;
}

export async function GET(request: NextRequest) {
  try {
    const playerId = getOrCreatePlayerId(request);
    const players = await readPlayers();
    const playerData = players[playerId];

    const response = NextResponse.json({ 
      playerId,
      name: playerData?.name || null,
      currentLevel: playerData?.currentLevel || 1
    });

    // Establecer cookie si no existe
    if (!cookies().get('player-id')) {
      response.cookies.set('player-id', playerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 // 1 año
      });
    }

    return response;
  } catch (error) {
    console.error('Error reading player data:', error);
    return NextResponse.json({ error: 'Error al leer datos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const playerId = getOrCreatePlayerId(request);
    const body = await request.json();
    const { name, currentLevel } = body;

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
    }

    const players = await readPlayers();
    players[playerId] = {
      name: name.trim(),
      currentLevel: typeof currentLevel === 'number' ? currentLevel : (players[playerId]?.currentLevel || 1),
      lastUpdated: new Date().toISOString()
    };

    await writePlayers(players);

    const response = NextResponse.json({ success: true, playerId });

    // Establecer cookie si no existe
    if (!cookies().get('player-id')) {
      response.cookies.set('player-id', playerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 // 1 año
      });
    }

    return response;
  } catch (error) {
    console.error('Error saving player data:', error);
    return NextResponse.json({ error: 'Error al guardar datos' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const playerId = getOrCreatePlayerId(request);
    const body = await request.json();
    const { currentLevel } = body;

    if (typeof currentLevel !== 'number') {
      return NextResponse.json({ error: 'currentLevel debe ser un número' }, { status: 400 });
    }

    const players = await readPlayers();
    if (!players[playerId]) {
      // Create player if doesn't exist (can happen if level updated before name set)
      players[playerId] = {
        name: 'Jugador',
        currentLevel,
        lastUpdated: new Date().toISOString()
      };
    } else {
      players[playerId] = {
        ...players[playerId],
        currentLevel,
        lastUpdated: new Date().toISOString()
      };
    }

    await writePlayers(players);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating player level:', error);
    return NextResponse.json({ error: 'Error al actualizar nivel' }, { status: 500 });
  }
}

