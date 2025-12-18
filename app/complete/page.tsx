'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { loadPuzzles } from '@/lib/loadPuzzles';

interface PlayerRank {
  rank: number;
  totalPlayers: number;
}

export default function CompletePage() {
  const router = useRouter();
  const [total, setTotal] = useState(10);
  const [playerRank, setPlayerRank] = useState<PlayerRank | null>(null);
  const [loading, setLoading] = useState(true);
  const { reset, playerName } = useProgress(total);

  useEffect(() => {
    loadPuzzles()
      .then((data) => setTotal(data.length || 10))
      .catch(() => setTotal(10));
  }, []);

  useEffect(() => {
    // Fetch player rank
    const fetchRank = async () => {
      try {
        const res = await fetch('/api/players');
        if (res.ok) {
          const data = await res.json();
          const players = data.players || [];
          
          // Find current player's rank
          const playerRes = await fetch('/api/player');
          if (playerRes.ok) {
            const playerData = await playerRes.json();
            const playerIndex = players.findIndex(
              (p: { playerId: string }) => p.playerId === playerData.playerId
            );
            
            if (playerIndex !== -1) {
              setPlayerRank({
                rank: playerIndex + 1,
                totalPlayers: players.length
              });
            } else if (players.length > 0) {
              // Player completed but not in list yet (race condition)
              setPlayerRank({
                rank: players.length + 1,
                totalPlayers: players.length + 1
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching rank:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRank();
  }, []);

  const handleReset = () => {
    reset();
  };

  // Confetti particles
  const confettiColors = ['#22c55e', '#16a34a', '#fbbf24', '#f59e0b', '#3b82f6', '#6366f1'];
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Confetti animation */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        {confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              y: -20, 
              x: 0, 
              rotate: 0,
              opacity: 1 
            }}
            animate={{ 
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              x: (Math.random() - 0.5) * 200,
              rotate: 360,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              left: particle.left,
              width: '8px',
              height: '8px',
              background: particle.color,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            type: 'spring', 
            stiffness: 200, 
            damping: 15 
          }}
          style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
          }}
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#061204"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </motion.svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            marginTop: 0, 
            textAlign: 'center',
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            marginBottom: '0.5rem'
          }}
        >
          ¡CTF Completado!
        </motion.h1>

        {playerName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              textAlign: 'center', 
              color: '#9ca3af', 
              fontSize: '1.1rem',
              marginBottom: '1.5rem'
            }}
          >
            Felicidades, <strong style={{ color: '#22c55e' }}>{playerName}</strong>!
          </motion.p>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}
        >
          <div className="terminal-box" style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Niveles</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
              {total} / {total}
            </div>
          </div>
          
          {playerRank && (
            <div className="terminal-box" style={{ textAlign: 'center', minWidth: '120px' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Ranking</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>
                #{playerRank.rank}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                de {playerRank.totalPlayers}
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cta"
            onClick={() => router.push('/scoreboard' as any)}
            style={{ 
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
            }}
          >
            Ver Scoreboard
          </motion.button>
          
          <Link href="/level/0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cta"
              onClick={handleReset}
              style={{ background: '#0c0c0c', color: '#22c55e', borderColor: '#1f2937' }}
            >
              Reiniciar CTF
            </motion.button>
          </Link>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cta"
              style={{ background: '#0c0c0c', color: '#9ca3af', borderColor: '#1f2937' }}
            >
              Volver al inicio
            </motion.button>
          </Link>
        </motion.div>

        {/* Celebration message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ 
            textAlign: 'center', 
            color: '#9ca3af', 
            marginTop: '2rem',
            fontSize: '0.9rem'
          }}
        >
          ¡Has completado todos los desafíos! 🎉
        </motion.p>
      </motion.div>
    </main>
  );
}
