'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { loadPuzzles } from '@/lib/loadPuzzles';

export default function CompletePage() {
  const [total, setTotal] = useState(10);
  const { reset } = useProgress(total);

  useEffect(() => {
    loadPuzzles()
      .then((data) => setTotal(data.length || 10))
      .catch(() => setTotal(10));
  }, []);

  const handleReset = () => {
    reset();
  };

  return (
    <main>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h1>¡CTF completado!</h1>
        <p style={{ color: '#9ca3af' }}>Tu bandera:</p>
        <div className="terminal-box" style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '0.05em' }}>
          FLAG{`{RECIBIDO}`}
        </div>
        <p style={{ color: '#9ca3af' }}>
          Puedes reiniciar para compartirlo o probar nuevos puzzles cuando se actualicen.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/level/1">
            <button className="cta" onClick={handleReset}>
              Reiniciar CTF
            </button>
          </Link>
          <Link href="/">
            <button className="cta" style={{ background: '#0c0c0c', color: '#22c55e', borderColor: '#1f2937' }}>
              Volver al inicio
            </button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
