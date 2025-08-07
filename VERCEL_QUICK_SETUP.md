# ⚡ Configuração Rápida Vercel

## 🚀 Deploy em 5 Passos

### 1. **Preparar o Repositório**
```bash
# Certifique-se de que tudo está commitado
git add .
git commit -m "Portal de Dashboards pronto para deploy"
git push origin main
```

### 2. **Criar Projeto na Vercel**
1. Acesse: https://vercel.com/new
2. Conecte com GitHub
3. Selecione este repositório
4. Clique em **Deploy**

### 3. **Configurar Banco de Dados**
1. No Vercel Dashboard → Storage
2. Clique em **Create Database**
3. Selecione **Postgres** → **Hobby**
4. Região: **São Paulo**
5. Copie as credenciais

### 4. **Configurar Variáveis de Ambiente**
No Vercel Dashboard → Settings → Environment Variables:

| Nome | Valor |
|------|-------|
| `JWT_SECRET` | `meu_portal_2024_$#@!%^&*()_+{}|:"<>?[]\;',./` |
| `POSTGRES_URL` | `postgresql://...` (do passo 3) |
| `POSTGRES_HOST` | `host` (do passo 3) |
| `POSTGRES_DATABASE` | `database` (do passo 3) |
| `POSTGRES_USERNAME` | `user` (do passo 3) |
| `POSTGRES_PASSWORD` | `password` (do passo 3) |
| `POSTGRES_PORT` | `5432` |

### 5. **Inicializar o Sistema**
```
https://seu-projeto.vercel.app/api/init
```

## ✅ Teste Final
- Acesse: `https://seu-projeto.vercel.app`
- Login: **admin** / **admin123**
- Adicione categorias e dashboards

## 🎉 Pronto!
Seu portal estará online e funcionando! 🚀 