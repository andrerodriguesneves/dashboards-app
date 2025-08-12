import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente Supabase público (só cria se as variáveis estiverem definidas)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Cliente para operações administrativas (só cria se as variáveis estiverem definidas)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Tipos para as tabelas
export interface Dashboard {
  id: number;
  title: string;
  description?: string;
  embed_url: string;
  category?: string;
  tags?: string[];
  is_favorite?: boolean;
  area?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories?: string[];
  created_at: string;
}

export interface PortalConfig {
  id: number;
  portal_name: string;
  logo_url?: string;
  primary_color: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityConfig {
  id: number;
  admin_key: string;
  admin_username: string;
  admin_password: string;
  created_at: string;
  updated_at: string;
}
