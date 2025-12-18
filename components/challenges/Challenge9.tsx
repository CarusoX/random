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

const PANGRAM_IMAGE_BASE64 = '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';

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

  const imageSrc = PANGRAM_IMAGE_BASE64.startsWith('data:') 
    ? PANGRAM_IMAGE_BASE64 
    : `data:image/png;base64,${PANGRAM_IMAGE_BASE64}`;

  return (
    <PuzzleCard 
      title={puzzle.title || `Puzzle ${puzzle.step + 1}`} 
      prompt={prompt} 
      hint={puzzle.hint}
      extra={
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <img 
            src={imageSrc} 
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

