import { NextRequest, NextResponse } from 'next/server';
import { caesarEncrypt } from '@/lib/caesar';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Solo para el puzzle de César (id "caesar")
  if (id === 'caesar') {
    const now = new Date();
    const shift = now.getHours();
    
    const plaintext = 'ME GUSTA EL FERNET';
    const encrypted = caesarEncrypt(plaintext, shift);
    
    return NextResponse.json({
      prompt: encrypted,
      hint: 'La clave esta en la hora, los minutos pasaron de moda'
    });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

