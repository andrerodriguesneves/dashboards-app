-- 🔧 CORREÇÃO RLS SIMPLES - SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE dashboards DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE portal_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE security_config DISABLE ROW LEVEL SECURITY;

-- 2. VERIFICAR STATUS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('dashboards', 'categories', 'portal_config', 'security_config')
ORDER BY tablename;

-- RESULTADO ESPERADO: rowsecurity = false para todas as tabelas
