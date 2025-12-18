import { createClient } from 'redis';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DATA_DIR = join(process.cwd(), 'data');
const PLAYERS_FILE = join(DATA_DIR, 'players.json');
const CIPHERS_FILE = join(DATA_DIR, 'ciphers.json');

// Usar Redis si está configurado (producción), sino usar filesystem (desarrollo)
const USE_REDIS = !!process.env.REDIS_URL;

// Cliente Redis singleton
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!USE_REDIS) return null;
  
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('[storage] Redis Client Error:', err));
    await redisClient.connect();
  }
  
  return redisClient;
}

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
  if (USE_REDIS) {
    try {
      const client = await getRedisClient();
      if (!client) return {};
      const data = await client.get('players');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('[storage] Error reading players from Redis:', error);
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
  if (USE_REDIS) {
    try {
      const client = await getRedisClient();
      if (!client) throw new Error('Redis client not available');
      await client.set('players', JSON.stringify(data));
    } catch (error) {
      console.error('[storage] Error writing players to Redis:', error);
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
  if (USE_REDIS) {
    try {
      const client = await getRedisClient();
      if (!client) return {};
      const data = await client.get('ciphers');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('[storage] Error reading ciphers from Redis:', error);
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
  if (USE_REDIS) {
    try {
      const client = await getRedisClient();
      if (!client) throw new Error('Redis client not available');
      await client.set('ciphers', JSON.stringify(data));
    } catch (error) {
      console.error('[storage] Error writing ciphers to Redis:', error);
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

