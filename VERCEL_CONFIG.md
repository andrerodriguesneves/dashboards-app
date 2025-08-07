# 🚀 Configurações para Deploy na Vercel

## 📋 Pré-requisitos

1. **Conta na Vercel**: https://vercel.com
2. **Projeto no GitHub**: Este repositório deve estar no GitHub
3. **Vercel CLI** (opcional): `npm i -g vercel`

## 🔧 Configurações do Projeto

### 1. Arquivo `vercel.json` (Já configurado)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### 2. Variáveis de Ambiente

#### **Criar arquivo `.env.local` (para desenvolvimento)**
```env
# JWT Secret (Gere uma chave segura)
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_2024

# Vercel Postgres (será configurado no Vercel)
POSTGRES_URL=postgresql://user:password@host:port/database
POSTGRES_HOST=host
POSTGRES_DATABASE=database
POSTGRES_USERNAME=user
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
```

#### **Configurar no Vercel Dashboard**

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione seu projeto**
3. **Vá em**: Settings → Environment Variables
4. **Adicione as variáveis**:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `JWT_SECRET` | `sua_chave_jwt_super_secreta_aqui_2024` | Production, Preview, Development |
| `POSTGRES_URL` | `postgresql://...` | Production, Preview, Development |
| `POSTGRES_HOST` | `host` | Production, Preview, Development |
| `POSTGRES_DATABASE` | `database` | Production, Preview, Development |
| `POSTGRES_USERNAME` | `user` | Production, Preview, Development |
| `POSTGRES_PASSWORD` | `password` | Production, Preview, Development |
| `POSTGRES_PORT` | `5432` | Production, Preview, Development |

## 🗄️ Configuração do Banco de Dados

### 1. Criar Banco Vercel Postgres

1. **No Vercel Dashboard**:
   - Vá em: Storage → Create Database
   - Selecione: **Postgres**
   - Escolha: **Hobby** (gratuito)
   - Região: **São Paulo** (mais próximo)

2. **Após criar**:
   - Copie as credenciais fornecidas
   - Configure as variáveis de ambiente acima

### 2. Estrutura das Tabelas

O banco será criado automaticamente quando você acessar:
```
https://seu-dominio.vercel.app/api/init
```

## 🚀 Deploy na Vercel

### Método 1: Via GitHub (Recomendado)

1. **Conecte o GitHub**:
   - Vá em: https://vercel.com/new
   - Importe do GitHub
   - Selecione este repositório

2. **Configure o projeto**:
   - Framework: **Next.js**
   - Root Directory: `/` (padrão)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Configure as variáveis de ambiente** (conforme acima)

4. **Deploy**:
   - Clique em **Deploy**
   - Aguarde o build completar

### Método 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

## 🔧 Pós-Deploy

### 1. Inicializar o Banco
```
https://seu-dominio.vercel.app/api/init
```

### 2. Testar o Sistema
- Acesse: `https://seu-dominio.vercel.app`
- Teste o login: admin/admin123
- Adicione categorias e dashboards

### 3. Configurar Domínio Personalizado (Opcional)
- Vá em: Settings → Domains
- Adicione seu domínio
- Configure DNS conforme instruções

## 📊 Monitoramento

### 1. Logs
- Vercel Dashboard → Functions → Logs
- Monitore erros e performance

### 2. Analytics
- Vercel Analytics (gratuito)
- Google Analytics (opcional)

### 3. Performance
- Vercel Speed Insights
- Core Web Vitals

## 🔒 Segurança

### 1. JWT Secret
- Use uma chave forte e única
- Exemplo: `JWT_SECRET=meu_portal_2024_$#@!%^&*()_+{}|:"<>?[]\;',./`

### 2. HTTPS
- Automático na Vercel
- Certificados SSL gratuitos

### 3. Rate Limiting
- Configurado automaticamente
- Proteção contra DDoS

## 🛠️ Troubleshooting

### Erro de Build
```bash
# Verificar logs
vercel logs

# Build local
npm run build
```

### Erro de Banco
1. Verifique as variáveis de ambiente
2. Teste a conexão
3. Reinicialize: `/api/init`

### Erro de Login
1. Verifique JWT_SECRET
2. Teste localmente primeiro
3. Verifique logs do Vercel

## 📱 URLs Importantes

### Desenvolvimento
- Local: `http://localhost:3000`
- Preview: `https://seu-projeto-git-branch.vercel.app`

### Produção
- Main: `https://seu-projeto.vercel.app`
- Custom: `https://seu-dominio.com`

## 🎯 Checklist de Deploy

- [ ] Repositório no GitHub
- [ ] Vercel Postgres criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Banco inicializado (`/api/init`)
- [ ] Login testado (admin/admin123)
- [ ] Categorias e dashboards adicionados
- [ ] Domínio personalizado (opcional)

## 🚀 Próximos Passos

1. **Faça o deploy** seguindo este guia
2. **Teste todas as funcionalidades**
3. **Configure domínio personalizado** (se necessário)
4. **Monitore performance** e logs
5. **Atualize dashboards** conforme necessário

**Seu portal estará online e funcionando!** 🎉 