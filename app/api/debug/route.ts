import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: 'postgres',
      connection: 'checking',
      tables: {},
      testWrite: 'pending'
    },
    environment_vars: {
      POSTGRES_URL: process.env.POSTGRES_URL ? '✅ Presente' : '❌ Ausente',
      POSTGRES_HOST: process.env.POSTGRES_HOST ? '✅ Presente' : '❌ Ausente',
      POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? '✅ Presente' : '❌ Ausente',
      POSTGRES_USERNAME: process.env.POSTGRES_USERNAME ? '✅ Presente' : '❌ Ausente',
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? '✅ Presente' : '❌ Ausente',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  };

  try {
    // Teste 1: Verificar conexão com banco
    console.log('🔍 Testando conexão com banco...');
    const connectionTest = await sql`SELECT 1 as test`;
    debugInfo.database.connection = '✅ Conectado';
    debugInfo.database.connection_details = 'Conexão estabelecida com sucesso';

    // Teste 2: Verificar tabelas existentes
    console.log('🔍 Verificando tabelas...');
    const tablesQuery = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const existingTables = tablesQuery.rows.map(row => row.table_name);
    debugInfo.database.tables.existing = existingTables;
    debugInfo.database.tables.count = existingTables.length;

    // Teste 3: Verificar estrutura das tabelas principais
    const requiredTables = ['dashboards', 'portal_config', 'admin_users'];
    debugInfo.database.tables.required = requiredTables;
    debugInfo.database.tables.missing = requiredTables.filter(table => !existingTables.includes(table));

    // Teste 4: Verificar dados nas tabelas
    for (const table of existingTables) {
      try {
        const countQuery = await sql`SELECT COUNT(*) as count FROM ${sql(table)}`;
        debugInfo.database.tables[table] = {
          exists: true,
          count: parseInt(countQuery.rows[0].count)
        };
      } catch (error: any) {
        debugInfo.database.tables[table] = {
          exists: true,
          error: error.message
        };
      }
    }

    // Teste 5: Teste de escrita
    console.log('🔍 Testando escrita...');
    try {
      const testData = {
        title: `Teste Debug ${Date.now()}`,
        embed_url: 'https://test.com'
      };

      await sql`
        INSERT INTO dashboards (title, embed_url)
        VALUES (${testData.title}, ${testData.embed_url})
      `;

      debugInfo.database.testWrite = '✅ Sucesso';
      debugInfo.database.testWrite_details = 'Dados gravados com sucesso';

      // Limpar dados de teste
      await sql`
        DELETE FROM dashboards 
        WHERE title = ${testData.title}
      `;

    } catch (writeError: any) {
      debugInfo.database.testWrite = '❌ Falha';
      debugInfo.database.testWrite_error = writeError.message;
      debugInfo.database.testWrite_details = 'Erro ao gravar dados de teste';
    }

    // Teste 6: Verificar permissões
    try {
      const permissionsQuery = await sql`
        SELECT current_user, current_database(), session_user
      `;
      debugInfo.database.permissions = {
        current_user: permissionsQuery.rows[0].current_user,
        current_database: permissionsQuery.rows[0].current_database,
        session_user: permissionsQuery.rows[0].session_user
      };
    } catch (permError: any) {
      debugInfo.database.permissions = {
        error: permError.message
      };
    }

  } catch (error: any) {
    debugInfo.database.connection = '❌ Falha';
    debugInfo.database.connection_error = error.message;
    debugInfo.error = error.message;
  }

  // Resumo
  debugInfo.summary = {
    database_connected: debugInfo.database.connection === '✅ Conectado',
    tables_ok: debugInfo.database.tables.missing?.length === 0,
    write_working: debugInfo.database.testWrite === '✅ Sucesso',
    env_vars_ok: Object.values(debugInfo.environment_vars).every(v => v === '✅ Presente')
  };

  return NextResponse.json(debugInfo, {
    status: debugInfo.summary.database_connected ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case 'init_database':
      try {
        // Criar tabelas se não existirem
        await sql`
          CREATE TABLE IF NOT EXISTS dashboards (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            embed_url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS portal_config (
            id SERIAL PRIMARY KEY,
            portal_name VARCHAR(255) DEFAULT 'Portal Corporativo',
            logo_url TEXT,
            primary_color VARCHAR(7) DEFAULT '#cc0000'
          )
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS admin_users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        // Inserir dados padrão
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await sql`
          INSERT INTO portal_config (portal_name, primary_color)
          VALUES ('Portal Corporativo', '#cc0000')
          ON CONFLICT DO NOTHING
        `;

        await sql`
          INSERT INTO admin_users (username, password_hash)
          VALUES ('admin', ${hashedPassword})
          ON CONFLICT DO NOTHING
        `;

        return NextResponse.json({
          success: true,
          message: 'Banco de dados inicializado com sucesso'
        });

      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }

    case 'test_write':
      try {
        const testData = {
          title: `Teste ${Date.now()}`,
          embed_url: 'https://test.com'
        };

        await sql`
          INSERT INTO dashboards (title, embed_url)
          VALUES (${testData.title}, ${testData.embed_url})
        `;

        return NextResponse.json({
          success: true,
          message: 'Teste de escrita realizado com sucesso',
          data: testData
        });

      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }

    default:
      return NextResponse.json({
        success: false,
        error: 'Ação não reconhecida. Use: init_database, test_write'
      }, { status: 400 });
  }
}
