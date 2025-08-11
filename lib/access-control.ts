// Sistema de Controle de Acesso para o Portal de Dashboards

export interface AccessConfig {
  // Chave secreta para acessar configurações
  ADMIN_KEY: string;
  // IPs permitidos (opcional)
  ALLOWED_IPS: string[];
  // Horários permitidos (opcional)
  ALLOWED_HOURS: {
    start: number;
    end: number;
  };
  // Usuários com acesso direto
  ADMIN_USERS: string[];
  // Domínios permitidos (opcional)
  ALLOWED_DOMAINS: string[];
}

// Configuração padrão
export const ACCESS_CONFIG: AccessConfig = {
  // Chave secreta para acessar configurações (será carregada dinamicamente)
  ADMIN_KEY: 'admin2024',
  
  // IPs permitidos (opcional - deixe vazio para permitir todos)
  ALLOWED_IPS: ['127.0.0.1', 'localhost', '::1'],
  
  // Horários permitidos (8h às 18h)
  ALLOWED_HOURS: {
    start: 8,
    end: 18
  },
  
  // Usuários com acesso direto
  ADMIN_USERS: ['admin'],
  
  // Domínios permitidos (opcional)
  ALLOWED_DOMAINS: ['localhost', 'vercel.app', 'netlify.app']
};

export class AccessControl {
  private config: AccessConfig;

  constructor(config: AccessConfig = ACCESS_CONFIG) {
    this.config = config;
  }

  // Obter configurações de segurança do localStorage ou banco
  private async getSecurityConfig() {
    if (typeof window === 'undefined') return null;
    
    try {
      // Tentar buscar do banco de dados primeiro
      const response = await fetch('/api/security');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.config) {
          return result.config;
        }
      }
    } catch (error) {
      console.error('Erro ao buscar configurações do banco:', error);
    }
    
    // Fallback para localStorage
    const stored = localStorage.getItem('security_config');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Erro ao carregar configurações de segurança:', error);
        return null;
      }
    }
    return null;
  }

  // Verificar se o usuário tem acesso administrativo
  async hasAdminAccess(): Promise<boolean> {
    // Verificar token JWT
    const token = localStorage.getItem('admin_token');
    if (token) {
      return true;
    }

    // Verificar chave de acesso (dinâmica)
    const storedKey = localStorage.getItem('admin_key');
    const securityConfig = await this.getSecurityConfig();
    const adminKey = securityConfig?.admin_key || this.config.ADMIN_KEY;
    
    if (storedKey === adminKey) {
      return true;
    }

    // Verificar horário de acesso
    if (!this.isWithinAllowedHours()) {
      return false;
    }

    // Verificar IP (se configurado)
    if (this.config.ALLOWED_IPS.length > 0 && !this.isAllowedIP()) {
      return false;
    }

    return false;
  }

  // Verificar se está dentro do horário permitido
  private isWithinAllowedHours(): boolean {
    const currentHour = new Date().getHours();
    return currentHour >= this.config.ALLOWED_HOURS.start && 
           currentHour <= this.config.ALLOWED_HOURS.end;
  }

  // Verificar se o IP é permitido
  private isAllowedIP(): boolean {
    // Em ambiente de desenvolvimento, sempre permitir
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return true;
    }
    
    // Em produção, verificar IP real
    // Esta é uma implementação básica - em produção use uma API para obter o IP real
    return true;
  }

  // Validar chave de acesso
  async validateAccessKey(key: string): Promise<boolean> {
    const securityConfig = await this.getSecurityConfig();
    const adminKey = securityConfig?.admin_key || this.config.ADMIN_KEY;
    return key === adminKey;
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('admin_token');
    return !!token;
  }

  // Obter informações de acesso
  getAccessInfo() {
    return {
      hasAccess: this.hasAdminAccess(),
      isAuthenticated: this.isAuthenticated(),
      isWithinHours: this.isWithinAllowedHours(),
      currentHour: new Date().getHours(),
      allowedHours: this.config.ALLOWED_HOURS
    };
  }

  // Limpar acesso
  clearAccess(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_key');
  }

  // Definir acesso
  setAccess(token?: string, key?: string): void {
    if (token) {
      localStorage.setItem('admin_token', token);
    }
    if (key) {
      localStorage.setItem('admin_key', key);
    }
  }
}

// Instância padrão
export const accessControl = new AccessControl();

// Funções utilitárias
export const checkAdminAccess = async () => await accessControl.hasAdminAccess();
export const validateKey = async (key: string) => await accessControl.validateAccessKey(key);
export const clearAccess = () => accessControl.clearAccess();
export const getAccessInfo = () => accessControl.getAccessInfo(); 