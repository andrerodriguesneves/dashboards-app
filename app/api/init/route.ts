import { NextResponse } from 'next/server';
import { initDatabase } from '../../../lib/database';

export async function POST() {
  try {
    await initDatabase();
    return NextResponse.json({ success: true, message: 'Banco de dados inicializado com sucesso' });
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar banco de dados' },
      { status: 500 }
    );
  }
} 