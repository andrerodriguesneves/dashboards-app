import { sql } from '@vercel/postgres';

export interface Dashboard {
  id: string;
  title: string;
  embed_url: string;
  created_at: Date;
}

export interface PortalConfig {
  id: string;
  portal_name: string;
  logo_url?: string;
  primary_color: string;
}

export async function initDatabase() {
  try {
    // Criar tabela de dashboards
    await sql`
      CREATE TABLE IF NOT EXISTS dashboards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        embed_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar tabela de configurações do portal
    await sql`
      CREATE TABLE IF NOT EXISTS portal_config (
        id SERIAL PRIMARY KEY,
        portal_name VARCHAR(255) DEFAULT 'Portal Corporativo',
        logo_url TEXT,
        primary_color VARCHAR(7) DEFAULT '#cc0000'
      )
    `;

    // Criar tabela de usuários administradores
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Inserir configuração padrão se não existir
    const configExists = await sql`
      SELECT COUNT(*) as count FROM portal_config
    `;
    
    if (configExists.rows[0].count === '0') {
      await sql`
        INSERT INTO portal_config (portal_name, primary_color)
        VALUES ('Portal Corporativo', '#cc0000')
      `;
    }

    // Inserir usuário admin padrão se não existir
    const adminExists = await sql`
      SELECT COUNT(*) as count FROM admin_users WHERE username = 'admin'
    `;
    
    if (adminExists.rows[0].count === '0') {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await sql`
        INSERT INTO admin_users (username, password_hash)
        VALUES ('admin', ${hashedPassword})
      `;
    }

  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

export async function getDashboards(): Promise<Dashboard[]> {
  try {
    const result = await sql`
      SELECT id, title, embed_url, created_at
      FROM dashboards
      ORDER BY created_at DESC
    `;
    return result.rows as Dashboard[];
  } catch (error) {
    console.error('Erro ao buscar dashboards:', error);
    return [];
  }
}

export async function addDashboard(title: string, embedUrl: string): Promise<boolean> {
  try {
    await sql`
      INSERT INTO dashboards (title, embed_url)
      VALUES (${title}, ${embedUrl})
    `;
    return true;
  } catch (error) {
    console.error('Erro ao adicionar dashboard:', error);
    return false;
  }
}

export async function removeDashboard(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM dashboards WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Erro ao remover dashboard:', error);
    return false;
  }
}

export async function getPortalConfig(): Promise<PortalConfig | null> {
  try {
    const result = await sql`
      SELECT id, portal_name, logo_url, primary_color
      FROM portal_config
      LIMIT 1
    `;
    return result.rows[0] as PortalConfig || null;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return null;
  }
}

export async function updatePortalConfig(config: Partial<PortalConfig>): Promise<boolean> {
  try {
    const currentConfig = await getPortalConfig();
    if (!currentConfig) return false;

    await sql`
      UPDATE portal_config
      SET 
        portal_name = ${config.portal_name || currentConfig.portal_name},
        logo_url = ${config.logo_url || currentConfig.logo_url},
        primary_color = ${config.primary_color || currentConfig.primary_color}
      WHERE id = ${currentConfig.id}
    `;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return false;
  }
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const bcrypt = require('bcryptjs');
    const result = await sql`
      SELECT password_hash FROM admin_users WHERE username = ${username}
    `;
    
    if (result.rows.length === 0) return false;
    
    const passwordHash = result.rows[0].password_hash;
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    console.error('Erro ao verificar credenciais:', error);
    return false;
  }
} 