#!/usr/bin/env node

/**
 * Script para testar o endpoint de verificação
 * Uso: node test-endpoint.js [URL]
 */

const https = require('https');
const http = require('http');

const url = process.argv[2] || 'http://localhost:3000/api/test';

console.log('🧪 Testando endpoint:', url);
console.log('⏳ Aguardando resposta...\n');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          reject(new Error('Resposta não é JSON válido'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout - requisição demorou mais de 10 segundos'));
    });
  });
}

async function runTest() {
  try {
    const result = await makeRequest(url);
    
    console.log('📊 RESULTADO DO TESTE:');
    console.log('='.repeat(50));
    console.log(`Status HTTP: ${result.status}`);
    console.log(`Timestamp: ${result.data.timestamp}`);
    console.log(`Ambiente: ${result.data.environment}`);
    console.log('');
    
    // Resumo geral
    if (result.data.overall) {
      const status = result.data.overall.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.data.overall.message}`);
      console.log('');
    }
    
    // Detalhes dos testes
    if (result.data.tests) {
      console.log('📋 DETALHES DOS TESTES:');
      console.log('-'.repeat(30));
      
      Object.entries(result.data.tests).forEach(([key, test]) => {
        const status = test.status === 'passed' ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${test.message}`);
        
        if (test.details) {
          Object.entries(test.details).forEach(([detailKey, detailValue]) => {
            console.log(`   ${detailKey}: ${detailValue}`);
          });
        }
        console.log('');
      });
    }
    
    // Estatísticas
    if (result.data.summary) {
      console.log('📈 ESTATÍSTICAS:');
      console.log('-'.repeat(20));
      console.log(`Total de testes: ${result.data.summary.total}`);
      console.log(`Passaram: ${result.data.summary.passed} ✅`);
      console.log(`Falharam: ${result.data.summary.failed} ❌`);
      console.log(`Duração: ${result.data.summary.duration}ms`);
    }
    
    // Status de saída
    process.exit(result.data.overall?.status === 'passed' ? 0 : 1);
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:');
    console.error('='.repeat(30));
    console.error(error.message);
    console.error('');
    console.error('Possíveis causas:');
    console.error('- Endpoint não está rodando');
    console.error('- URL incorreta');
    console.error('- Problema de rede');
    console.error('- Timeout na requisição');
    
    process.exit(1);
  }
}

// Executar o teste
runTest();
