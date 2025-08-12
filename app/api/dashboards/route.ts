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

    const { data: dashboards, error } = await supabase
      .from('dashboards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar dashboards:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    return NextResponse.json(dashboards || []);
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
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase não configurado' },
        { status: 500 }
      );
    }

    const { title, description, embed_url, category, tags, area } = await request.json();

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

    const { data: newDashboard, error } = await supabase
      .from('dashboards')
      .insert({
        title: sanitizedTitle,
        description: description?.trim() || '',
        embed_url: sanitizedUrl,
        category: category || '',
        tags: tags || [],
        area: area || '',
        is_favorite: false
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar dashboard:', error);
      return NextResponse.json(
        { error: 'Erro ao adicionar dashboard' },
        { status: 500 }
      );
    }

    return NextResponse.json(newDashboard);
  } catch (error) {
    console.error('Erro ao adicionar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 