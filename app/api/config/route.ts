import { NextRequest, NextResponse } from 'next/server';
import { getPortalConfig, updatePortalConfig } from '../../../lib/database';
import { isAuthenticated } from '../../../lib/auth';

export async function GET() {
  try {
    const config = await getPortalConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { portal_name, logo_url, primary_color } = await request.json();

    // Validação e sanitização
    const sanitizedConfig = {
      portal_name: portal_name?.trim().substring(0, 255) || 'Portal Corporativo',
      logo_url: logo_url?.trim() || null,
      primary_color: primary_color?.trim() || '#cc0000'
    };

    // Validação de cor
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (!colorRegex.test(sanitizedConfig.primary_color)) {
      return NextResponse.json(
        { error: 'Cor inválida' },
        { status: 400 }
      );
    }

    const success = await updatePortalConfig(sanitizedConfig);
    
    if (success) {
      const updatedConfig = await getPortalConfig();
      return NextResponse.json(updatedConfig);
    } else {
      return NextResponse.json(
        { error: 'Erro ao atualizar configurações' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 