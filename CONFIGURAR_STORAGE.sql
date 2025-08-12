-- 🔧 CONFIGURAÇÃO DO STORAGE - SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR BUCKET PARA LOGOS (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logos', 'logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- 2. POLÍTICA PARA PERMITIR UPLOAD DE ARQUIVOS
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'logos');

-- 3. POLÍTICA PARA PERMITIR DOWNLOAD DE ARQUIVOS
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');

-- 4. POLÍTICA PARA PERMITIR ATUALIZAÇÃO DE ARQUIVOS
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'logos');

-- 5. POLÍTICA PARA PERMITIR EXCLUSÃO DE ARQUIVOS
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'logos');

-- 6. VERIFICAR BUCKETS CRIADOS
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'logos';

-- 7. VERIFICAR POLÍTICAS DO STORAGE
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
