import { kv } from '@vercel/kv';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DATA_DIR = join(process.cwd(), 'data');
const PLAYERS_FILE = join(DATA_DIR, 'players.json');
const CIPHERS_FILE = join(DATA_DIR, 'ciphers.json');

// Usar KV si está configurado (producción), sino usar filesystem (desarrollo)
const USE_KV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

export interface PlayersData {
  [playerId: string]: {
    name: string;
    currentLevel: number;
    lastUpdated: string;
  };
}

export interface CiphersData {
  [puzzleId: string]: {
    mapping: { [key: string]: string };
    answer: string;
    createdAt: string;
  };
}

// Players storage
export async function readPlayers(): Promise<PlayersData> {
  if (USE_KV) {
    try {
      const data = await kv.get<PlayersData>('players');
      return data || {};
    } catch (error) {
      console.error('[storage] Error reading players from KV:', error);
      return {};
    }
  } else {
    // Desarrollo local: usar filesystem
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
    if (!existsSync(PLAYERS_FILE)) {
      return {};
    }
    const content = await readFile(PLAYERS_FILE, 'utf-8');
    return JSON.parse(content);
  }
}

export async function writePlayers(data: PlayersData): Promise<void> {
  if (USE_KV) {
    try {
      await kv.set('players', data);
    } catch (error) {
      console.error('[storage] Error writing players to KV:', error);
      throw error;
    }
  } else {
    // Desarrollo local: usar filesystem
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
    await writeFile(PLAYERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
}

// Ciphers storage
export async function readCiphers(): Promise<CiphersData> {
  if (USE_KV) {
    try {
      const data = await kv.get<CiphersData>('ciphers');
      return data || {};
    } catch (error) {
      console.error('[storage] Error reading ciphers from KV:', error);
      return {};
    }
  } else {
    // Desarrollo local: usar filesystem
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
    if (!existsSync(CIPHERS_FILE)) {
      return {};
    }
    const content = await readFile(CIPHERS_FILE, 'utf-8');
    return JSON.parse(content);
  }
}

export async function writeCiphers(data: CiphersData): Promise<void> {
  if (USE_KV) {
    try {
      await kv.set('ciphers', data);
    } catch (error) {
      console.error('[storage] Error writing ciphers to KV:', error);
      throw error;
    }
  } else {
    // Desarrollo local: usar filesystem
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
    await writeFile(CIPHERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
}

