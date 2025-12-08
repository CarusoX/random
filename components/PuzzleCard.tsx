'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PuzzleCardProps {
  title: string;
  prompt: string;
  hint?: string;
  children: ReactNode;
}

export default function PuzzleCard({ title, prompt, hint, children }: PuzzleCardProps) {
  return (
    <motion.div
      className="terminal-box"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>{title}</span>
        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>PROMPT</span>
      </div>
      <div style={{ marginTop: '0.75rem', whiteSpace: 'pre-line' }}>{prompt || 'Pendiente de contenido'}</div>
      {hint && (
        <div style={{ marginTop: '0.75rem', color: '#9ca3af', fontSize: '0.9rem' }}>
          <strong>Pista:</strong> {hint}
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>{children}</div>
    </motion.div>
  );
}
