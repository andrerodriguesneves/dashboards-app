# 🧪 Endpoint de Teste - Verificação Automática

## 📋 Visão Geral

Este endpoint permite verificar automaticamente se o projeto está funcionando corretamente no Vercel, sem necessidade de intervenção manual.

## 🔗 URLs do Endpoint

### Produção (Vercel)
```
https://seu-projeto.vercel.app/api/test
```

### Desenvolvimento Local
```
http://localhost:3000/api/test
```

## 🚀 Como Usar

### 1. Teste Completo (GET)
```bash
curl https://seu-projeto.vercel.app/api/test
```

### 2. Teste Específico (POST)
```bash
# Teste de banco de dados
curl -X POST https://seu-projeto.vercel.app/api/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "database"}'

# Teste de autenticação
curl -X POST https://seu-projeto.vercel.app/api/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "auth"}'
```

## 📊 O que o Endpoint Testa

### ✅ Teste 1: Variáveis de Ambiente
- `POSTGRES_URL`
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`

### ✅ Teste 2: Conectividade com Banco
- Conexão com Supabase/PostgreSQL
- Acesso às tabelas principais
- Verificação de permissões

### ✅ Teste 3: Estrutura das Tabelas
- Tabela `categories`
- Tabela `dashboards`
- Tabela `users`

### ✅ Teste 4: Configuração JWT
- Verificação do JWT_SECRET
- Comprimento da chave secreta

### ✅ Teste 5: Endpoints da API
- `/api/init`
- `/api/auth/login`
- `/api/categories`
- `/api/dashboards`
- `/api/config`

## 📈 Exemplo de Resposta

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "tests": {
    "environment": {
      "name": "Variáveis de Ambiente",
      "status": "passed",
      "message": "Todas as variáveis de ambiente estão configuradas",
      "details": {
        "POSTGRES_URL": "✅ Presente",
        "POSTGRES_HOST": "✅ Presente",
        "POSTGRES_DATABASE": "✅ Presente",
        "POSTGRES_USERNAME": "✅ Presente",
        "POSTGRES_PASSWORD": "✅ Presente",
        "JWT_SECRET": "✅ Presente"
      }
    },
    "database": {
      "name": "Conectividade com Banco de Dados",
      "status": "passed",
      "message": "Conexão com banco estabelecida com sucesso",
      "details": {
        "connection": "✅ Conectado",
        "tables": "✅ Tabelas acessíveis"
      }
    },
    "tables": {
      "name": "Estrutura das Tabelas",
      "status": "passed",
      "message": "Todas as tabelas estão acessíveis",
      "details": {
        "categories": "✅ Acessível",
        "dashboards": "✅ Acessível",
        "users": "✅ Acessível"
      }
    },
    "jwt": {
      "name": "Configuração JWT",
      "status": "passed",
      "message": "JWT Secret configurado",
      "details": {
        "secret": "✅ Configurado",
        "length": "32 caracteres"
      }
    },
    "endpoints": {
      "name": "Endpoints da API",
      "status": "passed",
      "message": "Todos os endpoints estão respondendo",
      "details": {
        "/api/init": "✅ Respondendo (200)",
        "/api/auth/login": "✅ Respondendo (401)",
        "/api/categories": "✅ Respondendo (200)",
        "/api/dashboards": "✅ Respondendo (200)",
        "/api/config": "✅ Respondendo (200)"
      }
    }
  },
  "summary": {
    "total": 5,
    "passed": 5,
    "failed": 0,
    "duration": 1250
  },
  "overall": {
    "status": "passed",
    "message": "🎉 Todos os testes passaram! Sistema funcionando corretamente."
  }
}
```

## 🚨 Exemplo de Erro

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production",
  "tests": {
    "environment": {
      "name": "Variáveis de Ambiente",
      "status": "failed",
      "message": "Variáveis ausentes: POSTGRES_URL, JWT_SECRET",
      "details": {
        "POSTGRES_URL": "❌ Ausente",
        "POSTGRES_HOST": "✅ Presente",
        "POSTGRES_DATABASE": "✅ Presente",
        "POSTGRES_USERNAME": "✅ Presente",
        "POSTGRES_PASSWORD": "✅ Presente",
        "JWT_SECRET": "❌ Ausente"
      }
    }
  },
  "summary": {
    "total": 5,
    "passed": 0,
    "failed": 5,
    "duration": 500
  },
  "overall": {
    "status": "failed",
    "message": "⚠️ 5 teste(s) falharam. Verifique os detalhes."
  }
}
```

## 🔧 Integração com CI/CD

### GitHub Actions
```yaml
name: Test Vercel Deployment
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test Vercel Deployment
        run: |
          curl -f https://seu-projeto.vercel.app/api/test
          if [ $? -eq 0 ]; then
            echo "✅ Deploy testado com sucesso!"
          else
            echo "❌ Falha no teste do deploy"
            exit 1
          fi
```

### Vercel Webhooks
```bash
# Configurar webhook para testar após deploy
curl -X POST https://seu-projeto.vercel.app/api/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "database"}'
```

## 📱 Monitoramento

### Status Codes
- `200`: Todos os testes passaram ✅
- `500`: Alguns testes falharam ❌

### Headers de Resposta
- `Content-Type: application/json`
- `Cache-Control: no-cache, no-store, must-revalidate`

## 🛠️ Troubleshooting

### Problema: Variáveis de Ambiente Ausentes
```bash
# Verificar no Vercel Dashboard
# Settings → Environment Variables
```

### Problema: Banco Não Conecta
```bash
# Verificar credenciais do Supabase/PostgreSQL
# Testar conexão manual
```

### Problema: Endpoints Não Respondem
```bash
# Verificar logs no Vercel Dashboard
# Functions → Logs
```

## 🎯 Uso Recomendado

1. **Após cada deploy**: Teste automático
2. **Monitoramento contínuo**: Verificação periódica
3. **Debugging**: Teste específico por componente
4. **CI/CD**: Integração com pipeline de deploy

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Vercel
2. Teste localmente primeiro
3. Verifique as variáveis de ambiente
4. Consulte a documentação do projeto

---

**🎉 Agora você pode testar seu deploy automaticamente!**
