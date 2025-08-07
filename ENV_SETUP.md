# Configuração de Variáveis de Ambiente

## Arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Configurações do Banco de Dados
POSTGRES_URL=postgresql://username:password@host:port/database

# Chave Secreta para JWT (MUDE EM PRODUÇÃO!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Configurações do Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Configuração para Vercel

No painel da Vercel, configure as seguintes variáveis de ambiente:

1. **POSTGRES_URL**: URL do seu banco Vercel Postgres
2. **JWT_SECRET**: Chave secreta para JWT (use uma chave forte em produção)

## Configuração Local

Para desenvolvimento local:

1. Instale as dependências: `npm install`
2. Crie o arquivo `.env.local` com as variáveis acima
3. Execute: `npm run dev`
4. Acesse: `http://localhost:3000`

## Inicialização do Banco

Após configurar as variáveis, acesse `/api/init` para criar as tabelas e usuário admin padrão. 