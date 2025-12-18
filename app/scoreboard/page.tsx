'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Player {
  playerId: string;
  name: string;
  currentLevel: number;
  lastUpdated: string;
}

export default function ScoreboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch('/api/players');
        if (!res.ok) {
          throw new Error('Error al cargar jugadores');
        }
        const data = await res.json();
        setPlayers(data.players || []);
      } catch (err) {
        setError('Error al cargar el scoreboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
    // Refresh every 5 seconds
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <main>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h1 style={{ marginTop: 0 }}>Scoreboard</h1>
        <p style={{ color: '#9ca3af' }}>
          Clasificación de jugadores por nivel alcanzado
        </p>
      </motion.div>

      {loading && <p style={{ color: '#9ca3af' }}>Cargando...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ marginTop: '1.5rem' }}>
          {players.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>Aún no hay jugadores registrados.</p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {players.map((player, index) => (
                <motion.div
                  key={`${player.playerId}-${player.currentLevel}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    padding: '1rem',
                    background: index < 3 ? '#1f2937' : '#0c0c0c',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem', minWidth: '2rem' }}>
                      {getRankEmoji(index)}
                    </span>
                    <span style={{ fontWeight: index < 3 ? 600 : 400 }}>
                      {player.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      Nivel
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: index < 3 ? '#22c55e' : '#fff',
                        fontSize: '1.1rem',
                      }}
                    >
                      {player.currentLevel}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link href="/">
          <button className="cta" style={{ background: '#0c0c0c', color: '#22c55e', borderColor: '#1f2937' }}>
            Volver al inicio
          </button>
        </Link>
      </div>
    </main>
  );
}

