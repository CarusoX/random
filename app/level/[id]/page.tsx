'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { loadPuzzles, type Puzzle } from '@/lib/loadPuzzles';
import { motion } from 'framer-motion';
import Challenge1 from '@/components/challenges/Challenge1';
import Challenge2 from '@/components/challenges/Challenge2';
import Challenge3 from '@/components/challenges/Challenge3';
import Challenge4 from '@/components/challenges/Challenge4';
import Challenge5 from '@/components/challenges/Challenge5';
import Challenge6 from '@/components/challenges/Challenge6';
import DefaultChallenge from '@/components/challenges/DefaultChallenge';
import ThemeToggle from '@/components/ThemeToggle';

export default function LevelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const step = useMemo(() => Number(params?.id), [params]);

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLightMode, setIsLightMode] = useState(false);

  const totalLevels = puzzles.length || 10;
  const { currentLevel, isReady, updateLevel } = useProgress(totalLevels);

  useEffect(() => {
    loadPuzzles()
      .then((data) => setPuzzles(data))
      .catch(() => setError('No se pudo cargar puzzles.json'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isReady || loading) return;
    if (Number.isNaN(step)) {
      router.replace('/');
      return;
    }

    // currentLevel es 1-based (1-10), step es 0-based (0-9)
    // Si currentLevel es 11, el usuario completó todo
    if (currentLevel > totalLevels) {
      router.replace('/complete');
      return;
    }

    if (step >= totalLevels) {
      router.replace('/complete');
      return;
    }

    // Verificar acceso: puede acceder a step = currentLevel - 1
    // Ejemplo: currentLevel = 1 → puede acceder a step 0
    //          currentLevel = 2 → puede acceder a step 1
    if (step >= currentLevel) {
      router.replace(`/level/${currentLevel - 1}`);
    }
  }, [currentLevel, isReady, step, loading, router, totalLevels]);

  const puzzle = puzzles.find((p) => p.step === step);

  const handleSubmit = async (answer: string) => {
    if (!puzzle) return false;
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: puzzle.id, answer }),
    });
    const data = await res.json();

    if (data.correct) {
      const nextStep = puzzle.step + 1;
      // updateLevel espera un nivel 1-based, así que convertimos step (0-based) a nivel (1-based)
      updateLevel(nextStep + 1);
      setTimeout(() => {
        if (nextStep >= totalLevels) {
          router.push('/complete');
        } else {
          router.push(`/level/${nextStep}`);
        }
      }, 350);
    }

    return Boolean(data.correct);
  };

  if (loading) return <p>Cargando nivel...</p>;
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>;
  if (!puzzle) return <p>No existe este nivel.</p>;

  // Renderizar el componente de challenge correspondiente
  const renderChallenge = () => {
    const commonProps = {
      puzzle,
      onSubmit: handleSubmit,
      disabled: !isReady || loading
    };

    switch (puzzle.id) {
      case 'rubiks-cube':
        return <Challenge1 {...commonProps} />;
      case 'pigpen':
        return <Challenge2 {...commonProps} />;
      case 'caesar':
        return <Challenge3 {...commonProps} />;
      case 'pi-clock':
        return <Challenge4 {...commonProps} />;
      case 'night-mode':
        return <Challenge5 {...commonProps} isLightMode={isLightMode} />;
      case 'ping-tracker':
        return <Challenge6 {...commonProps} />;
      default:
        return <DefaultChallenge {...commonProps} />;
    }
  };

  return (
    <main>
      {puzzle.id === 'night-mode' && <ThemeToggle isLightMode={isLightMode} onToggle={setIsLightMode} />}
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h2 style={{ margin: 0 }}>Nivel {puzzle.step + 1}</h2>
        <small style={{ color: '#9ca3af' }}>
          Progreso: {Math.min(currentLevel, totalLevels)} / {totalLevels}
        </small>
      </motion.div>

      {renderChallenge()}
    </main>
  );
}
