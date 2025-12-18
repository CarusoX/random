import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readPlayers, writePlayers, type PlayersData } from '@/lib/storage';

async function getOrCreatePlayerId(): Promise<{ playerId: string; needsCookie: boolean }> {
  const cookieStore = await cookies();
  let playerId = cookieStore.get('player-id')?.value;
  const needsCookie = !playerId;

  if (!playerId) {
    // Generar un ID único
    playerId = `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  return { playerId, needsCookie };
}

export async function GET(request: NextRequest) {
  try {
    const { playerId, needsCookie } = await getOrCreatePlayerId();
    const players = await readPlayers();
    const playerData = players[playerId];

    const response = NextResponse.json({ 
      playerId,
      name: playerData?.name || null,
      currentLevel: playerData?.currentLevel || 1
    });

    // Establecer cookie si no existe
    if (needsCookie) {
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
    console.log('[POST /api/player] Starting request');
    
    let playerId: string;
    let needsCookie: boolean;
    try {
      const result = await getOrCreatePlayerId();
      playerId = result.playerId;
      needsCookie = result.needsCookie;
      console.log('[POST /api/player] Got playerId:', playerId, 'needsCookie:', needsCookie);
    } catch (error) {
      console.error('[POST /api/player] Error in getOrCreatePlayerId:', error);
      return NextResponse.json({ 
        error: 'Error al obtener playerId',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }

    let body: any;
    try {
      body = await request.json();
      console.log('[POST /api/player] Parsed body:', { name: body.name, currentLevel: body.currentLevel });
    } catch (error) {
      console.error('[POST /api/player] Error parsing JSON:', error);
      return NextResponse.json({ 
        error: 'Error al parsear JSON',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 400 });
    }

    const { name, currentLevel } = body;

    if (typeof name !== 'string' || name.trim().length === 0) {
      console.error('[POST /api/player] Invalid name:', name);
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
    }

    let players: PlayersData;
    try {
      players = await readPlayers();
      console.log('[POST /api/player] Read players, count:', Object.keys(players).length);
    } catch (error) {
      console.error('[POST /api/player] Error reading players:', error);
      return NextResponse.json({ 
        error: 'Error al leer jugadores',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }

    try {
      players[playerId] = {
        name: name.trim(),
        currentLevel: typeof currentLevel === 'number' ? currentLevel : (players[playerId]?.currentLevel || 1),
        lastUpdated: new Date().toISOString()
      };
      console.log('[POST /api/player] Updated player data:', players[playerId]);
    } catch (error) {
      console.error('[POST /api/player] Error updating player object:', error);
      return NextResponse.json({ 
        error: 'Error al actualizar datos del jugador',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }

    try {
      await writePlayers(players);
      console.log('[POST /api/player] Successfully saved players data');
    } catch (error) {
      console.error('[POST /api/player] Error writing players:', error);
      return NextResponse.json({ 
        error: 'Error al guardar jugadores',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, playerId });

    // Establecer cookie si no existe
    try {
      if (needsCookie) {
        response.cookies.set('player-id', playerId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 365 // 1 año
        });
        console.log('[POST /api/player] Set cookie for playerId:', playerId);
      }
    } catch (error) {
      console.error('[POST /api/player] Error setting cookie:', error);
      // No retornamos error aquí, solo logueamos porque la operación principal ya fue exitosa
    }

    console.log('[POST /api/player] Request completed successfully');
    return response;
  } catch (error) {
    console.error('[POST /api/player] Unexpected error:', error);
    console.error('[POST /api/player] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      error: 'Error al guardar datos',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { playerId } = await getOrCreatePlayerId();
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

