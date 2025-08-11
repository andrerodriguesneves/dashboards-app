import { DB_CONFIG } from './database-config';

// Importa as funções do banco correto baseado na configuração
let databaseModule: any;

if (DB_CONFIG.USE_SQLITE) {
  // Usar SQLite para desenvolvimento local
  databaseModule = require('./database-sqlite');
} else {
  // Usar Postgres para produção
  databaseModule = require('./database-postgres');
}

// Re-exporta todas as funções e interfaces
export const {
  initDatabase,
  getDashboards,
  addDashboard,
  removeDashboard,
  getPortalConfig,
  updatePortalConfig,
  verifyAdminCredentials,
  getSecurityConfig,
  updateSecurityConfig
} = databaseModule;

export type { Dashboard, PortalConfig } from './database-sqlite'; 