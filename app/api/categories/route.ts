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

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    return NextResponse.json(categories || []);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
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

    const { id, name, subcategories } = await request.json();

    // Validação básica
    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID e Nome da categoria são obrigatórios' },
        { status: 400 }
      );
    }

    // Sanitização
    const sanitizedId = id.trim().toLowerCase();
    const sanitizedName = name.trim().substring(0, 255);
    const sanitizedSubcategories = subcategories || [];

    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({
        id: sanitizedId,
        name: sanitizedName,
        subcategories: sanitizedSubcategories
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar categoria:', error);
      return NextResponse.json(
        { error: 'Erro ao adicionar categoria' },
        { status: 500 }
      );
    }

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase não configurado' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da categoria é obrigatório' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover categoria:', error);
      return NextResponse.json(
        { error: 'Erro ao remover categoria' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
