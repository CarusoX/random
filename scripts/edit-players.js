#!/usr/bin/env node

/**
 * Script para editar el archivo players.json
 * 
 * Uso:
 *   node scripts/edit-players.js list                    - Lista todos los jugadores
 *   node scripts/edit-players.js set <playerId> <level>  - Establece el nivel de un jugador
 *   node scripts/edit-players.js delete <playerId>       - Elimina un jugador
 *   node scripts/edit-players.js rename <playerId> <name> - Renombra un jugador
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readPlayers() {
  ensureDataDir();
  if (!fs.existsSync(PLAYERS_FILE)) {
    return {};
  }
  const content = fs.readFileSync(PLAYERS_FILE, 'utf-8');
  return JSON.parse(content);
}

function writePlayers(players) {
  ensureDataDir();
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf-8');
}

function listPlayers() {
  const players = readPlayers();
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

function setLevel(playerId, level) {
  const players = readPlayers();
  if (!players[playerId]) {
    console.error(`Error: Jugador con ID "${playerId}" no encontrado.`);
    console.log('\nJugadores disponibles:');
    Object.keys(players).forEach(id => {
      console.log(`  - ${id} (${players[id].name || 'sin nombre'})`);
    });
    process.exit(1);
  }
  
  const numLevel = parseInt(level, 10);
  if (isNaN(numLevel) || numLevel < 1) {
    console.error(`Error: Nivel inválido "${level}". Debe ser un número >= 1.`);
    process.exit(1);
  }
  
  players[playerId].currentLevel = numLevel;
  players[playerId].lastUpdated = new Date().toISOString();
  writePlayers(players);
  console.log(`✓ Nivel de "${players[playerId].name}" actualizado a ${numLevel}`);
}

function deletePlayer(playerId) {
  const players = readPlayers();
  if (!players[playerId]) {
    console.error(`Error: Jugador con ID "${playerId}" no encontrado.`);
    process.exit(1);
  }
  
  const name = players[playerId].name || 'sin nombre';
  delete players[playerId];
  writePlayers(players);
  console.log(`✓ Jugador "${name}" eliminado`);
}

function renamePlayer(playerId, newName) {
  const players = readPlayers();
  if (!players[playerId]) {
    console.error(`Error: Jugador con ID "${playerId}" no encontrado.`);
    process.exit(1);
  }
  
  const oldName = players[playerId].name || 'sin nombre';
  players[playerId].name = newName.trim();
  players[playerId].lastUpdated = new Date().toISOString();
  writePlayers(players);
  console.log(`✓ Jugador renombrado de "${oldName}" a "${newName}"`);
}

// Main
const command = process.argv[2];

switch (command) {
  case 'list':
    listPlayers();
    break;
    
  case 'set':
    if (process.argv.length < 5) {
      console.error('Uso: node scripts/edit-players.js set <playerId> <level>');
      process.exit(1);
    }
    setLevel(process.argv[3], process.argv[4]);
    break;
    
  case 'delete':
    if (process.argv.length < 4) {
      console.error('Uso: node scripts/edit-players.js delete <playerId>');
      process.exit(1);
    }
    deletePlayer(process.argv[3]);
    break;
    
  case 'rename':
    if (process.argv.length < 5) {
      console.error('Uso: node scripts/edit-players.js rename <playerId> <newName>');
      process.exit(1);
    }
    renamePlayer(process.argv[3], process.argv.slice(4).join(' '));
    break;
    
  default:
    console.log('Script para editar players.json\n');
    console.log('Comandos disponibles:');
    console.log('  list                    - Lista todos los jugadores');
    console.log('  set <playerId> <level>  - Establece el nivel de un jugador');
    console.log('  delete <playerId>       - Elimina un jugador');
    console.log('  rename <playerId> <name> - Renombra un jugador');
    console.log('\nEjemplos:');
    console.log('  node scripts/edit-players.js list');
    console.log('  node scripts/edit-players.js set player-123 5');
    console.log('  node scripts/edit-players.js rename player-123 "Nuevo Nombre"');
    process.exit(1);
}

