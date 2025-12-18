'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Progress from '@/components/Progress';
import { useProgress } from '@/hooks/useProgress';
import { loadPuzzles, type Puzzle } from '@/lib/loadPuzzles';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [submittingName, setSubmittingName] = useState(false);

  const totalLevels = puzzles.length || 10;
  const { currentLevel, isReady, reset, playerName } = useProgress(totalLevels);

  useEffect(() => {
    loadPuzzles()
      .then((data) => setPuzzles(data))
      .catch(() => setError('No se pudo cargar puzzles.json'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Si ya hay un nombre guardado, no mostrar el formulario
    if (playerName) {
      setName(playerName);
      setNameSubmitted(true);
    }
  }, [playerName]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmittingName(true);
    try {
      const res = await fetch('/api/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setNameSubmitted(true);
      } else {
        setError('Error al guardar el nombre');
      }
    } catch (err) {
      setError('Error al guardar el nombre');
    } finally {
      setSubmittingName(false);
    }
  };

  const hasCompleted = currentLevel > totalLevels && totalLevels > 0;

  // Mostrar formulario de nombre si no se ha enviado
  if (!nameSubmitted) {
    return (
      <main>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <h1 style={{ marginTop: 0 }}>Mini CTF Mobile</h1>
          <p style={{ color: '#9ca3af' }}>
            Ingresa tu nombre para comenzar
          </p>
        </motion.div>

        <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            disabled={submittingName}
            style={{
              padding: '0.75rem',
              background: '#0c0c0c',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '1rem',
            }}
            autoFocus
          />
          <button 
            type="submit" 
            className="cta" 
            disabled={!name.trim() || submittingName}
          >
            {submittingName ? 'Guardando...' : 'Comenzar'}
          </button>
        </form>

        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      </main>
    );
  }

  return (
    <main>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h1 style={{ marginTop: 0 }}>Mini CTF Mobile</h1>
        <p style={{ color: '#9ca3af' }}>
          Hola, <strong>{name}</strong>! · 10 niveles · Listo para Vercel. Guarda tu progreso en el servidor.
        </p>
      </motion.div>

      {loading && <p>Cargando niveles...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {puzzles.length > 0 && isReady && <Progress current={currentLevel} total={totalLevels} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link href={hasCompleted ? '/complete' : `/level/${currentLevel - 1}`}>
          <button className="cta" disabled={!isReady || loading}>
            {hasCompleted ? 'Ver FLAG final' : 'Comenzar'}
          </button>
        </Link>
        <Link href="/scoreboard">
          <button className="cta" style={{ background: '#0c0c0c', color: '#fff', borderColor: '#1f2937' }}>
            Ver Scoreboard
          </button>
        </Link>
        <button
          className="cta"
          style={{ background: '#0c0c0c', color: '#22c55e', borderColor: '#1f2937' }}
          onClick={reset}
          disabled={!isReady}
        >
          Reiniciar progreso
        </button>
      </div>
    </main>
  );
}
