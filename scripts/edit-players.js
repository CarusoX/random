#!/usr/bin/env node

/**
 * Script para editar players (funciona con filesystem local o Redis)
 * 
 * Uso:
 *   node scripts/edit-players.js list                    - Lista todos los jugadores
 *   node scripts/edit-players.js set <playerId> <level>  - Establece el nivel de un jugador
 *   node scripts/edit-players.js delete <playerId>       - Elimina un jugador
 *   node scripts/edit-players.js rename <playerId> <name> - Renombra un jugador
 * 
 * Si REDIS_URL está configurado, usa Redis. Si no, usa filesystem local.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');

// Detectar si usar Redis o filesystem
const USE_REDIS = !!process.env.REDIS_URL;
let redisClient = null;

if (USE_REDIS) {
  try {
    const Redis = require('redis');
    redisClient = Redis.createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => {
      console.error('[Redis] Error:', err);
      process.exit(1);
    });
    console.log('[edit-players] Usando Redis:', process.env.REDIS_URL.replace(/:[^:@]+@/, ':****@'));
  } catch (error) {
    console.error('[edit-players] Error al conectar a Redis:', error.message);
    console.log('[edit-players] Asegúrate de tener el paquete "redis" instalado: npm install redis');
    process.exit(1);
  }
} else {
  console.log('[edit-players] Usando filesystem local');
}

async function ensureRedisConnected() {
  if (USE_REDIS && redisClient && !redisClient.isOpen) {
    await redisClient.connect();
  }
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function readPlayers() {
  if (USE_REDIS && redisClient) {
    await ensureRedisConnected();
    const data = await redisClient.get('players');
    return data ? JSON.parse(data) : {};
  } else {
    ensureDataDir();
    if (!fs.existsSync(PLAYERS_FILE)) {
      return {};
    }
    const content = fs.readFileSync(PLAYERS_FILE, 'utf-8');
    return JSON.parse(content);
  }
}

async function writePlayers(players) {
  if (USE_REDIS && redisClient) {
    await ensureRedisConnected();
    await redisClient.set('players', JSON.stringify(players, null, 2));
  } else {
    ensureDataDir();
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf-8');
  }
}

async function closeRedis() {
  if (USE_REDIS && redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
}

async function listPlayers() {
  const players = await readPlayers();
  const entries = Object.entries(players);
  
  if (entries.length === 0) {
    console.log('No hay jugadores registrados.');
    return;
  }
  
  console.log(`\nTotal de jugadores: ${entries.length}\n`);
  entries.forEach(([playerId, data], index) => {
    console.log(`${index + 1}. ${data.name || '(sin nombre)'}`);
    console.log(`   ID: ${playerId}`);
    console.log(`   Nivel: ${data.currentLevel}`);
    console.log(`   Última actualización: ${data.lastUpdated}`);
    console.log('');
  });
}

async function setLevel(playerId, level) {
  const players = await readPlayers();
  if (!players[playerId]) {
    console.error(`Error: Jugador con ID "${playerId}" no encontrado.`);
    console.log('\nJugadores disponibles:');
    Object.keys(players).forEach(id => {
      console.log(`  - ${id} (${players[id].name || 'sin nombre'})`);
    });
    await closeRedis();
    process.exit(1);
  }
  
  const numLevel = parseInt(level, 10);
  if (isNaN(numLevel) || numLevel < 1) {
    console.error(`Error: Nivel inválido "${level}". Debe ser un número >= 1.`);
    await closeRedis();
    process.exit(1);
  }
  
  players[playerId].currentLevel = numLevel;
  players[playerId].lastUpdated = new Date().toISOString();
  await writePlayers(players);
  console.log(`✓ Nivel de "${players[playerId].name}" actualizado a ${numLevel}`);
}

async function deletePlayer(playerId) {
  const players = await readPlayers();
  if (!players[playerId]) {
    console.error(`Error: Jugador con ID "${playerId}" no encontrado.`);
    await closeRedis();
    process.exit(1);
  }
  
  const name = players[playerId].name || 'sin nombre';
  delete players[playerId];
  await writePlayers(players);
  console.log(`✓ Jugador "${name}" eliminado`);
}

async function renamePlayer(playerId, newName) {
  const players = await readPlayers();
  if (!players[playerId]) {
    console.error(`Error: Jugador con ID "${playerId}" no encontrado.`);
    await closeRedis();
    process.exit(1);
  }
  
  const oldName = players[playerId].name || 'sin nombre';
  players[playerId].name = newName.trim();
  players[playerId].lastUpdated = new Date().toISOString();
  await writePlayers(players);
  console.log(`✓ Jugador renombrado de "${oldName}" a "${newName}"`);
}

// Main
(async () => {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'list':
        await listPlayers();
        break;
        
      case 'set':
        if (process.argv.length < 5) {
          console.error('Uso: node scripts/edit-players.js set <playerId> <level>');
          process.exit(1);
        }
        await setLevel(process.argv[3], process.argv[4]);
        break;
        
      case 'delete':
        if (process.argv.length < 4) {
          console.error('Uso: node scripts/edit-players.js delete <playerId>');
          process.exit(1);
        }
        await deletePlayer(process.argv[3]);
        break;
        
      case 'rename':
        if (process.argv.length < 5) {
          console.error('Uso: node scripts/edit-players.js rename <playerId> <newName>');
          process.exit(1);
        }
        await renamePlayer(process.argv[3], process.argv.slice(4).join(' '));
        break;
        
      default:
        console.log('Script para editar players\n');
        console.log('Comandos disponibles:');
        console.log('  list                    - Lista todos los jugadores');
        console.log('  set <playerId> <level>  - Establece el nivel de un jugador');
        console.log('  delete <playerId>       - Elimina un jugador');
        console.log('  rename <playerId> <name> - Renombra un jugador');
        console.log('\nEjemplos:');
        console.log('  node scripts/edit-players.js list');
        console.log('  node scripts/edit-players.js set player-123 5');
        console.log('  node scripts/edit-players.js rename player-123 "Nuevo Nombre"');
        console.log('\nNota: Si REDIS_URL está configurado, usa Redis. Si no, usa filesystem local.');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await closeRedis();
  }
})();

