-- 🔧 CORREÇÃO FINAL RLS - SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. DESABILITAR RLS COMPLETAMENTE
ALTER TABLE dashboards DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE portal_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE security_config DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Enable read access for all users" ON dashboards;
DROP POLICY IF EXISTS "Enable insert for all users" ON dashboards;
DROP POLICY IF EXISTS "Enable update for all users" ON dashboards;
DROP POLICY IF EXISTS "Enable delete for all users" ON dashboards;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON dashboards;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON dashboards;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON dashboards;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON dashboards;

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for all users" ON categories;
DROP POLICY IF EXISTS "Enable update for all users" ON categories;
DROP POLICY IF EXISTS "Enable delete for all users" ON categories;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON categories;

DROP POLICY IF EXISTS "Enable read access for all users" ON portal_config;
DROP POLICY IF EXISTS "Enable update for all users" ON portal_config;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON portal_config;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON portal_config;

DROP POLICY IF EXISTS "Enable read access for all users" ON security_config;
DROP POLICY IF EXISTS "Enable update for all users" ON security_config;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON security_config;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON security_config;

-- 3. VERIFICAR STATUS DAS TABELAS
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS HABILITADO ❌'
        ELSE 'RLS DESABILITADO ✅'
    END as status
FROM pg_tables 
WHERE tablename IN ('dashboards', 'categories', 'portal_config', 'security_config')
ORDER BY tablename;

-- 4. VERIFICAR SE EXISTEM POLÍTICAS RESTANTES
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('dashboards', 'categories', 'portal_config', 'security_config')
ORDER BY tablename, policyname;

-- RESULTADO ESPERADO: 
-- - Todas as tabelas com rowsecurity = false
-- - Nenhuma política restante
