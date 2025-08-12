# 🚀 Configuração Vercel + Supabase

## 📋 **Passo a Passo Completo**

### **1. 🗄️ Configurar Supabase**

#### **1.1 Criar Conta no Supabase**
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta
4. Clique em "New Project"

#### **1.2 Criar Projeto**
1. **Nome do Projeto**: `dashboards-app`
2. **Database Password**: Crie uma senha forte (guarde-a!)
3. **Region**: Escolha a mais próxima (ex: São Paulo)
4. Clique em "Create new project"

#### **1.3 Obter Credenciais**
Após criar o projeto, vá em **Settings > API** e copie:
- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon public key**: `eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **service_role key**: `eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **2. 🔧 Configurar Variáveis de Ambiente**

#### **2.1 No Vercel**
1. Acesse seu projeto no Vercel
2. Vá em **Settings > Environment Variables**
3. Adicione as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Banco de Dados
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Configurações do App
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
```

#### **2.2 No Local (.env.local)**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Banco de Dados
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Configurações do App
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### **3. 📦 Instalar Dependências**

```bash
npm install @supabase/supabase-js
```

### **4. 🗃️ Criar Tabelas no Supabase**

#### **4.1 Acessar SQL Editor**
1. No Supabase, vá em **SQL Editor**
2. Clique em **New Query**

#### **4.2 Executar Scripts SQL**

```sql
-- Tabela de Dashboards
CREATE TABLE IF NOT EXISTS dashboards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  embed_url TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  area TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subcategories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Configurações do Portal
CREATE TABLE IF NOT EXISTS portal_config (
  id SERIAL PRIMARY KEY,
  portal_name TEXT DEFAULT 'Portal Corporativo',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#cc0000',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Configurações de Segurança
CREATE TABLE IF NOT EXISTS security_config (
  id SERIAL PRIMARY KEY,
  admin_key TEXT NOT NULL DEFAULT 'admin2024',
  admin_username TEXT NOT NULL DEFAULT 'admin',
  admin_password TEXT NOT NULL DEFAULT 'admin123',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados padrão
INSERT INTO portal_config (portal_name, primary_color, description) 
VALUES ('Portal Corporativo', '#cc0000', 'Acesse dashboards e relatórios gerenciais de todas as áreas da empresa')
ON CONFLICT DO NOTHING;

INSERT INTO security_config (admin_key, admin_username, admin_password)
VALUES ('admin2024', 'admin', 'admin123')
ON CONFLICT DO NOTHING;

-- Inserir categorias padrão
INSERT INTO categories (id, name, subcategories) VALUES
('financeiro', 'Financeiro', ARRAY['Fluxo de Caixa', 'Faturamento', 'Custos', 'Orçamento']),
('rh', 'Recursos Humanos', ARRAY['Headcount', 'Performance', 'Turnover', 'Recrutamento']),
('vendas', 'Vendas', ARRAY['Pipeline', 'Conversão', 'Metas', 'Territórios']),
('operacoes', 'Operações', ARRAY['Produção', 'Qualidade', 'Logística', 'Manutenção'])
ON CONFLICT DO NOTHING;
```

### **5. 🔐 Configurar RLS (Row Level Security)**

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_config ENABLE ROW LEVEL SECURITY;

-- Políticas para dashboards (leitura pública, escrita apenas para admins)
CREATE POLICY "Dashboards são visíveis publicamente" ON dashboards
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem modificar dashboards" ON dashboards
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para categorias
CREATE POLICY "Categorias são visíveis publicamente" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem modificar categorias" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para configurações do portal
CREATE POLICY "Configurações do portal são visíveis publicamente" ON portal_config
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem modificar configurações" ON portal_config
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para configurações de segurança
CREATE POLICY "Apenas admins podem acessar configurações de segurança" ON security_config
  FOR ALL USING (auth.role() = 'authenticated');
```

### **6. 🔧 Configurar Storage para Uploads**

#### **6.1 Criar Bucket para Logos**
1. No Supabase, vá em **Storage**
2. Clique em **New Bucket**
3. Nome: `logos`
4. Marque como **Public**
5. Clique em **Create bucket**

#### **6.2 Configurar Políticas do Storage**

```sql
-- Política para upload de logos (apenas admins)
CREATE POLICY "Apenas admins podem fazer upload de logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- Política para visualização pública de logos
CREATE POLICY "Logos são visíveis publicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');
```

### **7. 🚀 Deploy no Vercel**

#### **7.1 Conectar Repositório**
1. No Vercel, clique em **New Project**
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente (passo 2.1)

#### **7.2 Configurar Build**
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### **7.3 Deploy**
1. Clique em **Deploy**
2. Aguarde o build completar
3. Teste a aplicação

### **8. ✅ Testar Configuração**

#### **8.1 Testar APIs**
```bash
# Testar conexão com Supabase
curl https://your-app.vercel.app/api/health

# Testar dashboards
curl https://your-app.vercel.app/api/dashboards
```

#### **8.2 Testar Funcionalidades**
1. Acesse a aplicação
2. Teste login administrativo
3. Adicione uma categoria
4. Adicione um dashboard
5. Faça upload de logo
6. Verifique se tudo persiste

### **9. 🔍 Troubleshooting**

#### **9.1 Erros Comuns**
- **Erro de conexão**: Verifique as variáveis de ambiente
- **Erro de RLS**: Verifique as políticas de segurança
- **Erro de upload**: Verifique as políticas do storage

#### **9.2 Logs**
- **Vercel**: Settings > Functions > View Function Logs
- **Supabase**: Logs > Database Logs

### **10. 📚 Recursos Adicionais**

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## 🎯 **Próximos Passos**

1. ✅ Configurar Supabase
2. ✅ Configurar variáveis de ambiente
3. ✅ Criar tabelas
4. ✅ Configurar RLS
5. ✅ Deploy no Vercel
6. ✅ Testar funcionalidades

**Agora seu projeto estará totalmente integrado com Supabase e Vercel!** 🚀
