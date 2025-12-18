import { NextRequest, NextResponse } from 'next/server';
import { readPlayers, writePlayers } from '@/lib/storage';

interface PlayerData {
  name: string;
  currentLevel: number;
  lastUpdated: string;
}

interface PlayersData {
  [playerId: string]: PlayerData;
}

// Simple auth check - usa una variable de entorno para la clave
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_KEY || 'change-me-in-production';
  
  if (!authHeader) return false;
  
  // Formato: Bearer <key>
  const token = authHeader.replace('Bearer ', '');
  return token === adminKey;
}

// GET: Listar todos los jugadores
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const players = await readPlayers();
    return NextResponse.json({ players });
  } catch (error) {
    console.error('Error reading players:', error);
    return NextResponse.json({ error: 'Error al leer datos' }, { status: 500 });
  }
}

// POST: Crear o actualizar un jugador
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { playerId, name, currentLevel } = body;

    if (!playerId || typeof playerId !== 'string') {
      return NextResponse.json({ error: 'playerId requerido' }, { status: 400 });
    }

    if (name && typeof name !== 'string') {
      return NextResponse.json({ error: 'name debe ser string' }, { status: 400 });
    }

    if (currentLevel !== undefined && typeof currentLevel !== 'number') {
      return NextResponse.json({ error: 'currentLevel debe ser número' }, { status: 400 });
    }

    const players = await readPlayers();
    const existing = players[playerId] || {};

    players[playerId] = {
      name: name || existing.name || 'Jugador',
      currentLevel: currentLevel !== undefined ? currentLevel : (existing.currentLevel || 1),
      lastUpdated: new Date().toISOString()
    };

    await writePlayers(players);

    return NextResponse.json({ success: true, player: players[playerId] });
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json({ error: 'Error al actualizar jugador' }, { status: 500 });
  }
}

// DELETE: Eliminar un jugador
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json({ error: 'playerId requerido' }, { status: 400 });
    }

    const players = await readPlayers();
    
    if (!players[playerId]) {
      return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
    }

    delete players[playerId];
    await writePlayers(players);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ error: 'Error al eliminar jugador' }, { status: 500 });
  }
}

