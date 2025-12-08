'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mobile-ctf-progress';

export function useProgress(totalLevels: number) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos del servidor
    const loadFromServer = async () => {
      try {
        const res = await fetch('/api/player');
        const data = await res.json();
        
        if (data.name) {
          setPlayerName(data.name);
        }
        
        if (data.currentLevel && typeof data.currentLevel === 'number') {
          const level = Math.min(data.currentLevel, totalLevels + 1);
          setCurrentLevel(Math.max(1, level));
          // Sincronizar con localStorage como backup
          localStorage.setItem(STORAGE_KEY, String(level));
        } else {
          // Fallback a localStorage si no hay datos en servidor
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = Number(stored);
            if (!Number.isNaN(parsed) && parsed >= 1) {
              setCurrentLevel(Math.min(parsed, totalLevels + 1));
            }
          }
        }
      } catch (error) {
        console.error('Error loading from server:', error);
        // Fallback a localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = Number(stored);
          if (!Number.isNaN(parsed) && parsed >= 1) {
            setCurrentLevel(Math.min(parsed, totalLevels + 1));
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    loadFromServer();
  }, [totalLevels]);

  const updateLevel = async (nextLevel: number) => {
    const normalized = Math.max(1, Math.min(nextLevel, totalLevels + 1));
    setCurrentLevel(normalized);
    
    // Guardar en localStorage como backup
    localStorage.setItem(STORAGE_KEY, String(normalized));
    
    // Sincronizar con servidor
    try {
      await fetch('/api/player', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentLevel: normalized }),
      });
    } catch (error) {
      console.error('Error syncing to server:', error);
      // Continuar aunque falle la sincronización
    }
  };

  const reset = () => {
    updateLevel(1);
  };

  return { currentLevel, isReady, updateLevel, reset, playerName };
}
