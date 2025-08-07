import { NextRequest, NextResponse } from 'next/server';
import { getDashboards, addDashboard } from '../../../lib/database';
import { isAuthenticated } from '../../../lib/auth';

export async function GET() {
  try {
    const dashboards = await getDashboards();
    return NextResponse.json(dashboards);
  } catch (error) {
    console.error('Erro ao buscar dashboards:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { title, embed_url } = await request.json();

    // Validação básica
    if (!title || !embed_url) {
      return NextResponse.json(
        { error: 'Título e URL são obrigatórios' },
        { status: 400 }
      );
    }

    // Sanitização básica
    const sanitizedTitle = title.trim().substring(0, 255);
    const sanitizedUrl = embed_url.trim();

    // Validação de URL
    try {
      new URL(sanitizedUrl);
    } catch {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      );
    }

    const success = await addDashboard(sanitizedTitle, sanitizedUrl);
    
    if (success) {
      const dashboards = await getDashboards();
      const newDashboard = dashboards[0]; // O mais recente
      return NextResponse.json(newDashboard);
    } else {
      return NextResponse.json(
        { error: 'Erro ao adicionar dashboard' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao adicionar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 