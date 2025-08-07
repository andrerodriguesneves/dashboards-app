import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials } from '../../../../lib/database';
import { createToken } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(username, password);
    
    if (isValid) {
      const token = createToken({ username, role: 'admin' });
      return NextResponse.json({ token });
    } else {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 