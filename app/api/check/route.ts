import { NextResponse } from 'next/server';
import { validateAnswer } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    console.log('[POST /api/check] Starting validation');
    
    let body: any;
    try {
      body = await request.json();
      console.log('[POST /api/check] Received body:', { id: body.id, answerLength: body.answer?.length });
    } catch (error) {
      console.error('[POST /api/check] Error parsing JSON:', error);
      return NextResponse.json({ 
        correct: false, 
        error: 'Invalid JSON',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 400 });
    }

    const { id, answer } = body;

    if (typeof id !== 'string') {
      console.error('[POST /api/check] Invalid id type:', typeof id, id);
      return NextResponse.json({ 
        correct: false, 
        error: 'id must be a string',
        received: typeof id
      }, { status: 400 });
    }

    if (typeof answer !== 'string') {
      console.error('[POST /api/check] Invalid answer type:', typeof answer, answer);
      return NextResponse.json({ 
        correct: false, 
        error: 'answer must be a string',
        received: typeof answer
      }, { status: 400 });
    }

    console.log('[POST /api/check] Validating:', { id, answer: answer.substring(0, 50) });

    let result;
    try {
      result = await validateAnswer(id, answer);
      console.log('[POST /api/check] Validation result:', { correct: result.correct, total: result.total });
    } catch (error) {
      console.error('[POST /api/check] Error in validateAnswer:', error);
      console.error('[POST /api/check] Error stack:', error instanceof Error ? error.stack : 'No stack');
      return NextResponse.json({ 
        correct: false,
        error: 'Validation error',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    }

    return NextResponse.json({ correct: result.correct });
  } catch (error) {
    console.error('[POST /api/check] Unexpected error:', error);
    console.error('[POST /api/check] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      correct: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
