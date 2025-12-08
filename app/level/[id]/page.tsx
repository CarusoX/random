'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';
import RubiksCube from '@/components/RubiksCube';
import { useProgress } from '@/hooks/useProgress';
import { loadPuzzles, type Puzzle } from '@/lib/loadPuzzles';
import { motion } from 'framer-motion';

export default function LevelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const levelId = useMemo(() => Number(params?.id), [params]);

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicPrompt, setDynamicPrompt] = useState<string | null>(null);
  const [dynamicHint, setDynamicHint] = useState<string | null>(null);

  const totalLevels = puzzles.length || 10;
  const { currentLevel, isReady, updateLevel } = useProgress(totalLevels);

  useEffect(() => {
    loadPuzzles()
      .then((data) => setPuzzles(data))
      .catch(() => setError('No se pudo cargar puzzles.json'))
      .finally(() => setLoading(false));
  }, []);

  // Obtener prompt dinámico para puzzles especiales
  useEffect(() => {
    if (levelId === 2) {
      fetch(`/api/puzzle/${levelId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.prompt) {
            setDynamicPrompt(data.prompt);
          }
          if (data.hint) {
            setDynamicHint(data.hint);
          }
        })
        .catch(() => {
          // Si falla, usar el prompt del JSON
        });
    } else {
      setDynamicPrompt(null);
      setDynamicHint(null);
    }
  }, [levelId]);

  useEffect(() => {
    if (!isReady || loading) return;
    if (Number.isNaN(levelId)) {
      router.replace('/');
      return;
    }

    if (currentLevel > totalLevels) {
      router.replace('/complete');
      return;
    }

    if (levelId > totalLevels) {
      router.replace('/complete');
      return;
    }

    if (levelId > currentLevel) {
      router.replace('/level/1');
    }
  }, [currentLevel, isReady, levelId, loading, router, totalLevels]);

  const puzzle = puzzles.find((p) => p.id === levelId);

  const handleSubmit = async (answer: string) => {
    if (!puzzle) return false;
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: puzzle.id, answer }),
    });
    const data = await res.json();

    if (data.correct) {
      const nextLevel = puzzle.id + 1;
      updateLevel(nextLevel);
      setTimeout(() => {
        if (nextLevel > totalLevels) {
          router.push('/complete');
        } else {
          router.push(`/level/${nextLevel}`);
        }
      }, 350);
    }

    return Boolean(data.correct);
  };

  if (loading) return <p>Cargando nivel...</p>;
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>;
  if (!puzzle) return <p>No existe este nivel.</p>;

  const extra = puzzle.id === 1 ? <RubiksCube /> : null;
  
  // Usar prompt dinámico si está disponible, sino el del puzzle
  const displayPrompt = dynamicPrompt !== null ? dynamicPrompt : puzzle.prompt;
  const displayHint = dynamicHint !== null ? dynamicHint : puzzle.hint;

  return (
    <main>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h2 style={{ margin: 0 }}>Nivel {puzzle.id}</h2>
        <small style={{ color: '#9ca3af' }}>
          Progreso: {Math.min(currentLevel, totalLevels)} / {totalLevels}
        </small>
      </motion.div>

      <PuzzleCard title={puzzle.title || `Puzzle ${puzzle.id}`} prompt={displayPrompt} hint={displayHint} extra={extra}>
        <InputAnswer onSubmit={handleSubmit} disabled={!isReady || loading} />
      </PuzzleCard>
    </main>
  );
}
