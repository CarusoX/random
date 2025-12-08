'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mobile-ctf-progress';

export function useProgress(totalLevels: number) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed) && parsed >= 1) {
        setCurrentLevel(Math.min(parsed, totalLevels + 1));
      }
    }
    setIsReady(true);
  }, [totalLevels]);

  const updateLevel = (nextLevel: number) => {
    const normalized = Math.max(1, Math.min(nextLevel, totalLevels + 1));
    setCurrentLevel(normalized);
    localStorage.setItem(STORAGE_KEY, String(normalized));
  };

  const reset = () => {
    updateLevel(1);
  };

  return { currentLevel, isReady, updateLevel, reset };
}
