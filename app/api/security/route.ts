import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getSecurityConfig, updateSecurityConfig } from '../../../lib/database';

export async function GET() {
  try {
    await initDatabase();
    const config = await getSecurityConfig();
    
    return NextResponse.json({
      success: true,
      config: config || {
        adminKey: 'admin2024'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar configurações de segurança:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey } = body;

    // Validações básicas
    if (!adminKey) {
      return NextResponse.json(
        { success: false, error: 'A chave de acesso é obrigatória' },
        { status: 400 }
      );
    }

    if (adminKey.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A chave deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    await initDatabase();
    await updateSecurityConfig({ adminKey });

    return NextResponse.json({
      success: true,
      message: 'Chave de acesso atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações de segurança:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
