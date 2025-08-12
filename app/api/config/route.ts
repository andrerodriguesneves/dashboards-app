import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase não configurado' },
        { status: 500 }
      );
    }

    const { data: config, error } = await supabase
      .from('portal_config')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Erro ao buscar configurações:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

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
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase não configurado' },
        { status: 500 }
      );
    }

    const { portal_name, logo_url, primary_color, description } = await request.json();

    // Validação e sanitização
    const sanitizedConfig = {
      portal_name: portal_name?.trim().substring(0, 255) || 'Portal Corporativo',
      logo_url: logo_url?.trim() || null,
      primary_color: primary_color?.trim() || '#cc0000',
      description: description?.trim() || '',
      updated_at: new Date().toISOString()
    };

    // Validação de cor
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (!colorRegex.test(sanitizedConfig.primary_color)) {
      return NextResponse.json(
        { error: 'Cor inválida' },
        { status: 400 }
      );
    }

    const { data: updatedConfig, error } = await supabase
      .from('portal_config')
      .update(sanitizedConfig)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar configurações:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar configurações' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 