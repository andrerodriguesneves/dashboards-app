import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

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

let db: any = null;

async function getDatabase() {
  if (!db) {
    db = await open({
      filename: './dashboards.db',
      driver: sqlite3.Database
    });
  }
  return db;
}

export async function initDatabase() {
  try {
    const database = await getDatabase();
    
    // Criar tabela de dashboards
    await database.exec(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        embed_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de configurações do portal
    await database.exec(`
      CREATE TABLE IF NOT EXISTS portal_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portal_name TEXT DEFAULT 'Portal Corporativo',
        logo_url TEXT,
        primary_color TEXT DEFAULT '#cc0000'
      )
    `);

    // Criar tabela de usuários administradores
    await database.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir configuração padrão se não existir
    const configExists = await database.get('SELECT COUNT(*) as count FROM portal_config');
    if (configExists.count === 0) {
      await database.run(`
        INSERT INTO portal_config (portal_name, primary_color)
        VALUES ('Portal Corporativo', '#cc0000')
      `);
    }

    // Inserir usuário admin padrão se não existir
    const adminExists = await database.get('SELECT COUNT(*) as count FROM admin_users WHERE username = ?', ['admin']);
    if (adminExists.count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await database.run(`
        INSERT INTO admin_users (username, password_hash)
        VALUES (?, ?)
      `, ['admin', hashedPassword]);
    }

    // Criar tabela de configurações de segurança
    await database.exec(`
      CREATE TABLE IF NOT EXISTS security_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_key TEXT NOT NULL DEFAULT 'admin2024',
        admin_username TEXT NOT NULL DEFAULT 'admin',
        admin_password TEXT NOT NULL DEFAULT 'admin123',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir configuração de segurança padrão se não existir
    const securityExists = await database.get('SELECT COUNT(*) as count FROM security_config');
    if (securityExists.count === 0) {
      await database.run(`
        INSERT INTO security_config (admin_key, admin_username, admin_password)
        VALUES (?, ?, ?)
      `, ['admin2024', 'admin', 'admin123']);
    }

  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

export async function getDashboards(): Promise<Dashboard[]> {
  try {
    const database = await getDatabase();
    const result = await database.all(`
      SELECT id, title, embed_url, created_at
      FROM dashboards
      ORDER BY created_at DESC
    `);
    return result as Dashboard[];
  } catch (error) {
    console.error('Erro ao buscar dashboards:', error);
    return [];
  }
}

export async function addDashboard(title: string, embedUrl: string): Promise<boolean> {
  try {
    const database = await getDatabase();
    await database.run(`
      INSERT INTO dashboards (title, embed_url)
      VALUES (?, ?)
    `, [title, embedUrl]);
    return true;
  } catch (error) {
    console.error('Erro ao adicionar dashboard:', error);
    return false;
  }
}

export async function removeDashboard(id: string): Promise<boolean> {
  try {
    const database = await getDatabase();
    await database.run('DELETE FROM dashboards WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Erro ao remover dashboard:', error);
    return false;
  }
}

export async function getPortalConfig(): Promise<PortalConfig | null> {
  try {
    const database = await getDatabase();
    const result = await database.get(`
      SELECT id, portal_name, logo_url, primary_color
      FROM portal_config
      LIMIT 1
    `);
    return result as PortalConfig || null;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return null;
  }
}

export async function updatePortalConfig(config: Partial<PortalConfig>): Promise<boolean> {
  try {
    const database = await getDatabase();
    const currentConfig = await getPortalConfig();
    if (!currentConfig) return false;

    await database.run(`
      UPDATE portal_config
      SET 
        portal_name = ?,
        logo_url = ?,
        primary_color = ?
      WHERE id = ?
    `, [
      config.portal_name || currentConfig.portal_name,
      config.logo_url || currentConfig.logo_url,
      config.primary_color || currentConfig.primary_color,
      currentConfig.id
    ]);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return false;
  }
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const database = await getDatabase();
    const result = await database.get(`
      SELECT password_hash FROM admin_users WHERE username = ?
    `, [username]);
    
    if (!result) return false;
    
    const passwordHash = result.password_hash;
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    console.error('Erro ao verificar credenciais:', error);
    return false;
  }
}

export async function getSecurityConfig(): Promise<any> {
  try {
    const database = await getDatabase();
    const config = await database.get('SELECT * FROM security_config LIMIT 1');
    return config;
  } catch (error) {
    console.error('Erro ao buscar configurações de segurança:', error);
    return null;
  }
}

export async function updateSecurityConfig(config: any): Promise<void> {
  try {
    const database = await getDatabase();
    
    // Verificar se já existe configuração
    const existing = await database.get('SELECT * FROM security_config LIMIT 1');
    
    if (existing) {
      // Atualizar configuração existente
      await database.run(
        'UPDATE security_config SET admin_key = ?, updated_at = ?',
        [config.adminKey, new Date().toISOString()]
      );
    } else {
      // Criar nova configuração
      await database.run(
        'INSERT INTO security_config (admin_key, created_at, updated_at) VALUES (?, ?, ?)',
        [config.adminKey, new Date().toISOString(), new Date().toISOString()]
      );
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações de segurança:', error);
    throw error;
  }
} 