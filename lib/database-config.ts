// Configuração para alternar entre SQLite (desenvolvimento) e Postgres (produção)
export const DB_CONFIG = {
  // Use SQLite para desenvolvimento local
  USE_SQLITE: process.env.NODE_ENV === 'development' || !process.env.POSTGRES_URL,
  
  // Configurações do SQLite
  SQLITE_PATH: './dashboards.db',
  
  // Configurações do Postgres
  POSTGRES_URL: process.env.POSTGRES_URL,
};

export function getDatabaseType() {
  return DB_CONFIG.USE_SQLITE ? 'sqlite' : 'postgres';
} 