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

  const totalLevels = puzzles.length || 10;
  const { currentLevel, isReady, reset } = useProgress(totalLevels);

  useEffect(() => {
    loadPuzzles()
      .then((data) => setPuzzles(data))
      .catch(() => setError('No se pudo cargar puzzles.json'))
      .finally(() => setLoading(false));
  }, []);

  const hasCompleted = currentLevel > totalLevels && totalLevels > 0;
  const targetLevel = hasCompleted ? '/complete' : `/level/${currentLevel}`;

  return (
    <main>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h1 style={{ marginTop: 0 }}>Mini CTF Mobile</h1>
        <p style={{ color: '#9ca3af' }}>
          App Router · 10 niveles · Listo para Vercel. Guarda tu progreso en el dispositivo.
        </p>
      </motion.div>

      {loading && <p>Cargando niveles...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {puzzles.length > 0 && isReady && <Progress current={currentLevel} total={totalLevels} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link href={targetLevel}>
          <button className="cta" disabled={!isReady || loading}>
            {hasCompleted ? 'Ver FLAG final' : 'Comenzar'}
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
