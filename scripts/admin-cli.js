#!/usr/bin/env node

/**
 * CLI para administrar players.json en Vercel usando el endpoint admin
 * 
 * Requiere: ADMIN_KEY como variable de entorno o argumento
 * 
 * Uso:
 *   ADMIN_KEY=tu-clave node scripts/admin-cli.js list <url>
 *   ADMIN_KEY=tu-clave node scripts/admin-cli.js set <url> <playerId> <level>
 *   ADMIN_KEY=tu-clave node scripts/admin-cli.js rename <url> <playerId> <name>
 *   ADMIN_KEY=tu-clave node scripts/admin-cli.js delete <url> <playerId>
 */

const https = require('https');
const http = require('http');

const adminKey = process.env.ADMIN_KEY || process.argv.find(arg => arg.startsWith('--key='))?.split('=')[1];

if (!adminKey) {
  console.error('Error: ADMIN_KEY requerido');
  console.log('\nUso:');
  console.log('  ADMIN_KEY=tu-clave node scripts/admin-cli.js <command> <url> [args...]');
  console.log('  node scripts/admin-cli.js <command> <url> --key=tu-clave [args...]');
  process.exit(1);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${adminKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function listPlayers(url) {
  const baseUrl = url.replace(/\/$/, '');
  const response = await makeRequest(`${baseUrl}/api/admin/players`);
  
  if (response.status !== 200) {
    console.error(`Error: ${response.data.error || 'Unknown error'}`);
    process.exit(1);
  }

  const players = response.data.players || {};
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

async function setLevel(url, playerId, level) {
  const baseUrl = url.replace(/\/$/, '');
  const numLevel = parseInt(level, 10);
  
  if (isNaN(numLevel) || numLevel < 1) {
    console.error(`Error: Nivel inválido "${level}". Debe ser un número >= 1.`);
    process.exit(1);
  }

  const response = await makeRequest(`${baseUrl}/api/admin/players`, {
    method: 'POST',
    body: { playerId, currentLevel: numLevel }
  });

  if (response.status !== 200) {
    console.error(`Error: ${response.data.error || 'Unknown error'}`);
    process.exit(1);
  }

  console.log(`✓ Nivel de "${response.data.player.name}" actualizado a ${numLevel}`);
}

async function renamePlayer(url, playerId, name) {
  const baseUrl = url.replace(/\/$/, '');
  const response = await makeRequest(`${baseUrl}/api/admin/players`, {
    method: 'POST',
    body: { playerId, name }
  });

  if (response.status !== 200) {
    console.error(`Error: ${response.data.error || 'Unknown error'}`);
    process.exit(1);
  }

  console.log(`✓ Jugador renombrado a "${response.data.player.name}"`);
}

async function deletePlayer(url, playerId) {
  const baseUrl = url.replace(/\/$/, '');
  const response = await makeRequest(`${baseUrl}/api/admin/players?playerId=${encodeURIComponent(playerId)}`, {
    method: 'DELETE'
  });

  if (response.status !== 200) {
    console.error(`Error: ${response.data.error || 'Unknown error'}`);
    process.exit(1);
  }

  console.log(`✓ Jugador eliminado`);
}

// Main
const command = process.argv[2];
const url = process.argv[3];

if (!url || !url.startsWith('http')) {
  console.error('Error: URL requerida');
  console.log('\nUso:');
  console.log('  ADMIN_KEY=tu-clave node scripts/admin-cli.js list https://tu-app.vercel.app');
  console.log('  ADMIN_KEY=tu-clave node scripts/admin-cli.js set https://tu-app.vercel.app <playerId> <level>');
  console.log('  ADMIN_KEY=tu-clave node scripts/admin-cli.js rename https://tu-app.vercel.app <playerId> <name>');
  console.log('  ADMIN_KEY=tu-clave node scripts/admin-cli.js delete https://tu-app.vercel.app <playerId>');
  process.exit(1);
}

(async () => {
  try {
    switch (command) {
      case 'list':
        await listPlayers(url);
        break;
        
      case 'set':
        if (process.argv.length < 6) {
          console.error('Uso: ADMIN_KEY=tu-clave node scripts/admin-cli.js set <url> <playerId> <level>');
          process.exit(1);
        }
        await setLevel(url, process.argv[4], process.argv[5]);
        break;
        
      case 'rename':
        if (process.argv.length < 6) {
          console.error('Uso: ADMIN_KEY=tu-clave node scripts/admin-cli.js rename <url> <playerId> <name>');
          process.exit(1);
        }
        await renamePlayer(url, process.argv[4], process.argv.slice(5).join(' '));
        break;
        
      case 'delete':
        if (process.argv.length < 5) {
          console.error('Uso: ADMIN_KEY=tu-clave node scripts/admin-cli.js delete <url> <playerId>');
          process.exit(1);
        }
        await deletePlayer(url, process.argv[4]);
        break;
        
      default:
        console.log('Script para administrar players.json en Vercel\n');
        console.log('Comandos disponibles:');
        console.log('  list <url>                    - Lista todos los jugadores');
        console.log('  set <url> <playerId> <level>   - Establece el nivel de un jugador');
        console.log('  rename <url> <playerId> <name> - Renombra un jugador');
        console.log('  delete <url> <playerId>        - Elimina un jugador');
        console.log('\nEjemplos:');
        console.log('  ADMIN_KEY=mi-clave-secreta node scripts/admin-cli.js list https://mi-app.vercel.app');
        console.log('  ADMIN_KEY=mi-clave-secreta node scripts/admin-cli.js set https://mi-app.vercel.app player-123 5');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

