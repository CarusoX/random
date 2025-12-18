import { NextResponse } from 'next/server';
import { readPlayers } from '@/lib/storage';

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

