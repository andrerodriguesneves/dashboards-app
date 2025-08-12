# 🔧 Configuração das Variáveis de Ambiente

## 📋 **Arquivo .env.local**

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres

# App Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 **Para Produção (Vercel)**

No Vercel, adicione as mesmas variáveis em **Settings > Environment Variables**:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres

# App Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
```

## 🔑 **Como Obter as Credenciais**

### **1. Supabase URL e Keys**
1. Acesse seu projeto no Supabase
2. Vá em **Settings > API**
3. Copie:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **service_role key**: `eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **2. Database URL**
1. No Supabase, vá em **Settings > Database**
2. Copie a **Connection string**
3. Substitua `[YOUR-PASSWORD]` pela senha do banco

### **3. NEXTAUTH_SECRET**
Gere uma chave secreta:
```bash
openssl rand -base64 32
```

## ✅ **Verificação**

Após configurar, teste se as variáveis estão funcionando:

```bash
# Verificar se o arquivo existe
ls -la .env.local

# Testar a aplicação
npm run dev
```

## 🚨 **Importante**

- ✅ Nunca commite o arquivo `.env.local`
- ✅ Use variáveis diferentes para desenvolvimento e produção
- ✅ Mantenha as chaves seguras
- ✅ Use HTTPS em produção
