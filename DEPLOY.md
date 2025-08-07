# Instruções de Deploy na Vercel

## Pré-requisitos

1. Conta na Vercel (gratuita)
2. Repositório Git (GitHub, GitLab, etc.)
3. Banco de dados Vercel Postgres

## Passo a Passo

### 1. Preparar o Repositório

1. Faça commit de todos os arquivos para o repositório
2. Certifique-se de que o projeto compila: `npm run build`

### 2. Conectar à Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta
3. Clique em "New Project"
4. Importe seu repositório Git
5. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (padrão)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Configurar Banco de Dados

1. No painel da Vercel, vá para "Storage"
2. Clique em "Create Database"
3. Escolha "Postgres"
4. Configure o banco:
   - **Name**: dashboards-db
   - **Region**: escolha a mais próxima
5. Após criar, copie a URL de conexão

### 4. Configurar Variáveis de Ambiente

No painel da Vercel, vá para "Settings" > "Environment Variables":

```
POSTGRES_URL=sua_url_do_postgres_aqui
JWT_SECRET=sua_chave_secreta_forte_aqui
```

### 5. Deploy

1. Clique em "Deploy"
2. Aguarde o deploy ser concluído
3. Acesse a URL fornecida

### 6. Inicializar o Banco

1. Acesse: `https://seu-dominio.vercel.app/api/init`
2. Isso criará as tabelas e usuário admin padrão

### 7. Testar

1. Acesse a URL do projeto
2. Clique no ícone de engrenagem
3. Faça login com:
   - **Usuário**: admin
   - **Senha**: admin123

## Configurações de Produção

### Segurança

1. **Mude a senha padrão** após o primeiro login
2. **Use uma JWT_SECRET forte** (mínimo 32 caracteres)
3. **Configure HTTPS** (automático na Vercel)

### Performance

1. **Enable Edge Functions** para APIs
2. **Configure CDN** para assets estáticos
3. **Monitor de Performance** no painel da Vercel

### Monitoramento

1. Configure alertas no painel da Vercel
2. Monitore logs em tempo real
3. Configure uptime monitoring

## Troubleshooting

### Erro de Conexão com Banco

- Verifique se `POSTGRES_URL` está correta
- Confirme se o banco está ativo
- Teste a conexão localmente

### Erro de Build

- Verifique se todas as dependências estão no `package.json`
- Confirme se o TypeScript está configurado corretamente
- Teste o build localmente: `npm run build`

### Problemas de Autenticação

- Verifique se `JWT_SECRET` está configurada
- Confirme se o banco foi inicializado
- Teste o endpoint `/api/init`

## Suporte

Para problemas específicos:
1. Verifique os logs no painel da Vercel
2. Teste localmente primeiro
3. Consulte a documentação da Vercel 