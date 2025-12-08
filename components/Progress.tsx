'use client';

import { motion } from 'framer-motion';

interface ProgressProps {
  current: number;
  total: number;
}

export default function Progress({ current, total }: ProgressProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <small>Progreso</small>
        <small>
          Nivel {Math.min(current, total)} de {total}
        </small>
      </div>
      <div style={{ background: '#0c0c0c', border: '1px solid var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          style={{ height: 8, background: 'linear-gradient(90deg, #16a34a, #22c55e)' }}
        />
      </div>
    </div>
  );
}
