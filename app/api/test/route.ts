import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database-types';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const testResults: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    tests: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      duration: 0
    }
  };

  try {
    // Teste 1: Verificar variáveis de ambiente
    testResults.tests.environment = {
      name: 'Variáveis de Ambiente',
      status: 'running',
      details: {}
    };

    const requiredEnvVars = [
      'POSTGRES_URL',
      'POSTGRES_HOST', 
      'POSTGRES_DATABASE',
      'POSTGRES_USERNAME',
      'POSTGRES_PASSWORD',
      'JWT_SECRET'
    ];

    const missingVars = [];
    const presentVars = [];

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        presentVars.push(envVar);
        testResults.tests.environment.details[envVar] = '✅ Presente';
      } else {
        missingVars.push(envVar);
        testResults.tests.environment.details[envVar] = '❌ Ausente';
      }
    }

    testResults.tests.environment.status = missingVars.length === 0 ? 'passed' : 'failed';
    testResults.tests.environment.message = missingVars.length === 0 
      ? 'Todas as variáveis de ambiente estão configuradas'
      : `Variáveis ausentes: ${missingVars.join(', ')}`;

    // Teste 2: Conectividade com banco de dados
    testResults.tests.database = {
      name: 'Conectividade com Banco de Dados',
      status: 'running',
      details: {}
    };

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
      
      const supabase = createClient<Database>(supabaseUrl, supabaseKey);
      
      // Teste de conexão simples
      const { data, error } = await supabase
        .from('categories')
        .select('count')
        .limit(1);

      if (error) {
        testResults.tests.database.status = 'failed';
        testResults.tests.database.message = `Erro na conexão: ${error.message}`;
        testResults.tests.database.details.error = error.message;
      } else {
        testResults.tests.database.status = 'passed';
        testResults.tests.database.message = 'Conexão com banco estabelecida com sucesso';
        testResults.tests.database.details.connection = '✅ Conectado';
        testResults.tests.database.details.tables = '✅ Tabelas acessíveis';
      }
    } catch (dbError: any) {
      testResults.tests.database.status = 'failed';
      testResults.tests.database.message = `Erro na conexão: ${dbError.message}`;
      testResults.tests.database.details.error = dbError.message;
    }

    // Teste 3: Verificar estrutura das tabelas
    testResults.tests.tables = {
      name: 'Estrutura das Tabelas',
      status: 'running',
      details: {}
    };

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
      
      const supabase = createClient<Database>(supabaseUrl, supabaseKey);
      
      // Verificar tabelas principais
      const tables = ['categories', 'dashboards', 'users'];
      const tableStatus = {};

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);

          if (error) {
            tableStatus[table] = `❌ Erro: ${error.message}`;
          } else {
            tableStatus[table] = '✅ Acessível';
          }
        } catch (err: any) {
          tableStatus[table] = `❌ Erro: ${err.message}`;
        }
      }

      testResults.tests.tables.details = tableStatus;
      const failedTables = Object.values(tableStatus).filter(status => status.includes('❌'));
      
      testResults.tests.tables.status = failedTables.length === 0 ? 'passed' : 'failed';
      testResults.tests.tables.message = failedTables.length === 0 
        ? 'Todas as tabelas estão acessíveis'
        : `${failedTables.length} tabela(s) com problemas`;

    } catch (tableError: any) {
      testResults.tests.tables.status = 'failed';
      testResults.tests.tables.message = `Erro ao verificar tabelas: ${tableError.message}`;
      testResults.tests.tables.details.error = tableError.message;
    }

    // Teste 4: Verificar JWT
    testResults.tests.jwt = {
      name: 'Configuração JWT',
      status: 'running',
      details: {}
    };

    if (process.env.JWT_SECRET) {
      testResults.tests.jwt.status = 'passed';
      testResults.tests.jwt.message = 'JWT Secret configurado';
      testResults.tests.jwt.details.secret = '✅ Configurado';
      testResults.tests.jwt.details.length = `${process.env.JWT_SECRET.length} caracteres`;
    } else {
      testResults.tests.jwt.status = 'failed';
      testResults.tests.jwt.message = 'JWT Secret não configurado';
      testResults.tests.jwt.details.secret = '❌ Não configurado';
    }

    // Teste 5: Verificar endpoints da API
    testResults.tests.endpoints = {
      name: 'Endpoints da API',
      status: 'running',
      details: {}
    };

    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    const endpoints = [
      '/api/init',
      '/api/auth/login',
      '/api/categories',
      '/api/dashboards',
      '/api/config'
    ];

    const endpointStatus = {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200 || response.status === 401 || response.status === 404) {
          endpointStatus[endpoint] = `✅ Respondendo (${response.status})`;
        } else {
          endpointStatus[endpoint] = `⚠️ Status ${response.status}`;
        }
      } catch (err: any) {
        endpointStatus[endpoint] = `❌ Erro: ${err.message}`;
      }
    }

    testResults.tests.endpoints.details = endpointStatus;
    const failedEndpoints = Object.values(endpointStatus).filter(status => status.includes('❌'));
    
    testResults.tests.endpoints.status = failedEndpoints.length === 0 ? 'passed' : 'failed';
    testResults.tests.endpoints.message = failedEndpoints.length === 0 
      ? 'Todos os endpoints estão respondendo'
      : `${failedEndpoints.length} endpoint(s) com problemas`;

  } catch (error: any) {
    testResults.error = error.message;
  }

  // Calcular resumo
  const tests = Object.values(testResults.tests);
  testResults.summary.total = tests.length;
  testResults.summary.passed = tests.filter((test: any) => test.status === 'passed').length;
  testResults.summary.failed = tests.filter((test: any) => test.status === 'failed').length;
  testResults.summary.duration = Date.now() - startTime;

  // Determinar status geral
  const overallStatus = testResults.summary.failed === 0 ? 'passed' : 'failed';
  testResults.overall = {
    status: overallStatus,
    message: overallStatus === 'passed' 
      ? '🎉 Todos os testes passaram! Sistema funcionando corretamente.'
      : `⚠️ ${testResults.summary.failed} teste(s) falharam. Verifique os detalhes.`
  };

  return NextResponse.json(testResults, {
    status: overallStatus === 'passed' ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

export async function POST(request: NextRequest) {
  // Endpoint para executar testes específicos
  const body = await request.json();
  const { testType } = body;

  const testResults: any = {
    timestamp: new Date().toISOString(),
    testType: testType || 'all',
    results: {}
  };

  switch (testType) {
    case 'database':
      // Teste específico de banco
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
        
        const supabase = createClient<Database>(supabaseUrl, supabaseKey);
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .limit(5);

        if (error) {
          testResults.results = { success: false, error: error.message };
        } else {
          testResults.results = { 
            success: true, 
            count: data?.length || 0,
            message: 'Conexão com banco estabelecida'
          };
        }
      } catch (error: any) {
        testResults.results = { success: false, error: error.message };
      }
      break;

    case 'auth':
      // Teste específico de autenticação
      testResults.results = {
        success: true,
        jwtConfigured: !!process.env.JWT_SECRET,
        message: 'Configuração de autenticação verificada'
      };
      break;

    default:
      testResults.results = {
        success: false,
        error: 'Tipo de teste não reconhecido. Use: database, auth, ou omita para todos os testes.'
      };
  }

  return NextResponse.json(testResults);
}
