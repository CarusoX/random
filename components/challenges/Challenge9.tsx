'use client';

import { useState, useEffect } from 'react';
import { type Puzzle } from '@/lib/loadPuzzles';
import PuzzleCard from '@/components/PuzzleCard';
import InputAnswer from '@/components/InputAnswer';

interface Challenge9Props {
  puzzle: Puzzle;
  onSubmit: (answer: string) => Promise<boolean>;
  disabled?: boolean;
}

function encryptText(text: string, cipher: Map<string, string>): string {
  return text
    .split('')
    .map(char => cipher.get(char) || char)
    .join('');
}

export default function Challenge9({ puzzle, onSubmit, disabled }: Challenge9Props) {
  const [encryptedPangram, setEncryptedPangram] = useState<string>('');
  const [encryptedAnswer, setEncryptedAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const pangram = 'The quick brown fox jumps over the lazy dog';

  useEffect(() => {
    // Fetch the substitution cipher from the server
    const fetchCipher = async () => {
      try {
        const res = await fetch(`/api/puzzle/${puzzle.id}/cipher`);
        if (res.ok) {
          const data = await res.json();
          const cipherMap = new Map<string, string>();
          Object.entries(data.mapping).forEach(([key, value]) => {
            cipherMap.set(key, value as string);
          });
          setEncryptedPangram(encryptText(pangram, cipherMap));
          setEncryptedAnswer(data.answer);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching cipher:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCipher();
  }, [puzzle.id]);

  const handleSubmit = async (answer: string) => {
    // Use the standard onSubmit which will validate via API
    return onSubmit(answer);
  };

  const prompt = loading 
    ? 'Cargando...'
    : `Observa la imagen y el texto cifrado a continuación:

${encryptedPangram}`;

  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.step + 1}`} 
      prompt={prompt} 
      hint={puzzle.hint}
      extra={
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <img 
            src="/foxy2.png" 
            alt="Pangram illustration" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: '0.5rem',
              border: '1px solid var(--border)'
            }} 
          />
        </div>
      }
    >
      {!loading && encryptedAnswer && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
            ¿Qué dice la siguiente frase?
          </p>
          <div 
            className="terminal-box" 
            style={{ 
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            {encryptedAnswer}
          </div>
        </div>
      )}
      <InputAnswer 
        onSubmit={handleSubmit} 
        disabled={disabled || loading} 
        placeholder="Ingresa el texto descifrado"
      />
    </PuzzleCard>
  );
}

