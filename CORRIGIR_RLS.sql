-- 🔧 CORREÇÃO DAS POLÍTICAS RLS - SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. REMOVER POLÍTICAS EXISTENTES (se houver)
DROP POLICY IF EXISTS "Enable read access for all users" ON dashboards;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON dashboards;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON dashboards;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON dashboards;

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON categories;

DROP POLICY IF EXISTS "Enable read access for all users" ON portal_config;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON portal_config;

DROP POLICY IF EXISTS "Enable read access for all users" ON security_config;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON security_config;

-- 2. CRIAR NOVAS POLÍTICAS CORRETAS

-- POLÍTICAS PARA DASHBOARDS
CREATE POLICY "Enable read access for all users" ON dashboards
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON dashboards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON dashboards
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON dashboards
    FOR DELETE USING (true);

-- POLÍTICAS PARA CATEGORIES
CREATE POLICY "Enable read access for all users" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON categories
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON categories
    FOR DELETE USING (true);

-- POLÍTICAS PARA PORTAL_CONFIG
CREATE POLICY "Enable read access for all users" ON portal_config
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON portal_config
    FOR UPDATE USING (true);

-- POLÍTICAS PARA SECURITY_CONFIG
CREATE POLICY "Enable read access for all users" ON security_config
    FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON security_config
    FOR UPDATE USING (true);

-- 3. VERIFICAR SE AS POLÍTICAS FORAM CRIADAS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('dashboards', 'categories', 'portal_config', 'security_config')
ORDER BY tablename, policyname;
