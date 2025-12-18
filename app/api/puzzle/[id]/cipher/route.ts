import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DATA_DIR = join(process.cwd(), 'data');
const CIPHERS_FILE = join(DATA_DIR, 'ciphers.json');

interface CipherData {
  mapping: { [key: string]: string };
  answer: string;
  createdAt: string;
}

interface CiphersData {
  [puzzleId: string]: CipherData;
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readCiphers(): Promise<CiphersData> {
  await ensureDataDir();
  if (!existsSync(CIPHERS_FILE)) {
    return {};
  }
  const content = await readFile(CIPHERS_FILE, 'utf-8');
  return JSON.parse(content);
}

async function writeCiphers(data: CiphersData): Promise<void> {
  await ensureDataDir();
  await writeFile(CIPHERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function generateSubstitutionCipher(): { mapping: { [key: string]: string }, reverseMapping: { [key: string]: string } } {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
  const mapping: { [key: string]: string } = {};
  const reverseMapping: { [key: string]: string } = {};
  
  alphabet.forEach((letter, index) => {
    mapping[letter] = shuffled[index];
    mapping[letter.toLowerCase()] = shuffled[index].toLowerCase();
    reverseMapping[shuffled[index]] = letter;
    reverseMapping[shuffled[index].toLowerCase()] = letter.toLowerCase();
  });
  
  return { mapping, reverseMapping };
}

function encryptText(text: string, mapping: { [key: string]: string }): string {
  return text
    .split('')
    .map(char => mapping[char] || char)
    .join('');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const puzzleId = params.id;
    const ciphers = await readCiphers();
    
    // If cipher already exists for this puzzle, return it
    if (ciphers[puzzleId]) {
      return NextResponse.json({
        mapping: ciphers[puzzleId].mapping,
        answer: ciphers[puzzleId].answer
      });
    }
    
    // Generate new cipher
    const { mapping } = generateSubstitutionCipher();
    const pangram = 'The quick brown fox jumps over the lazy dog';
    const answerPhrase = 'Pack my box with five dozen liquor jugs';
    const encryptedAnswer = encryptText(answerPhrase, mapping);
    
    // Store the cipher
    ciphers[puzzleId] = {
      mapping,
      answer: encryptedAnswer,
      createdAt: new Date().toISOString()
    };
    
    await writeCiphers(ciphers);
    
    return NextResponse.json({
      mapping,
      answer: encryptedAnswer
    });
  } catch (error) {
    console.error('Error handling cipher request:', error);
    return NextResponse.json({ error: 'Error al generar cifrado' }, { status: 500 });
  }
}

