import { NextRequest, NextResponse } from 'next/server';
import { removeDashboard } from '../../../../lib/database';
import { isAuthenticated } from '../../../../lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do dashboard é obrigatório' },
        { status: 400 }
      );
    }

    const success = await removeDashboard(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Erro ao remover dashboard' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao remover dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 