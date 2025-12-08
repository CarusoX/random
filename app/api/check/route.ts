import { NextResponse } from 'next/server';
import { validateAnswer } from '@/lib/validate';

export async function POST(request: Request) {
  const { id, answer } = await request.json();

  if (typeof id !== 'number' || typeof answer !== 'string') {
    return NextResponse.json({ correct: false }, { status: 400 });
  }

  const result = await validateAnswer(id, answer);
  return NextResponse.json({ correct: result.correct });
}
