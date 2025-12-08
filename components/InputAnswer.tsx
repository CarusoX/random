'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface InputAnswerProps {
  onSubmit: (answer: string) => Promise<boolean> | boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function InputAnswer({ onSubmit, disabled = false, placeholder = 'Ingresa tu respuesta' }: InputAnswerProps) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    const result = await onSubmit(value.trim());
    setStatus(result ? 'success' : 'error');
    setLoading(false);
    if (result) {
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div>
        <label htmlFor="answer">Respuesta</label>
        <motion.input
          key={status}
          id="answer"
          name="answer"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || loading}
          animate={
            status === 'error'
              ? { x: [0, -8, 8, -6, 6, -4, 4, 0] }
              : status === 'success'
              ? { scale: [1, 1.02, 1], opacity: [1, 0.95, 1] }
              : undefined
          }
          transition={{ duration: 0.45 }}
        />
      </div>
      <button className="cta" type="submit" disabled={disabled || loading}>
        {loading ? 'Validando...' : 'Validar'}
      </button>
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#22c55e', fontWeight: 700 }}
          >
            ¡Correcto!
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#ef4444', fontWeight: 700 }}
          >
            Respuesta incorrecta. Intenta otra vez.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
