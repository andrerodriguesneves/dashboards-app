'use client';

import { useState, useEffect } from 'react';
import { Settings, Search, Heart, Eye, ExternalLink, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import PortalConfig from './components/PortalConfig';
import SecurityConfig from './components/SecurityConfig';
import DynamicFavicon from './components/DynamicFavicon';
import { accessControl, validateKey, clearAccess } from '../lib/access-control';

// Dashboards de exemplo
const exampleDashboards = [
  {
    id: '1',
    title: 'Dashboard Financeiro Geral',
    description: 'Visão consolidada dos indicadores financeiros',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiMjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3IiwidCI6IjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3In0%3D',
    tags: ['mensal', 'consolidado', 'receita'],
    isFavorite: true,
    area: 'Financeiro',
    category: 'financeiro'
  },
  {
    id: '2',
    title: 'Fluxo de Caixa Detalhado',
    description: 'Análise detalhada do fluxo de caixa',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiMjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3IiwidCI6IjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3In0%3D',
    tags: ['diário', 'caixa', 'liquidez'],
    isFavorite: false,
    area: 'Financeiro',
    category: 'financeiro'
  },
  {
    id: '3',
    title: 'Performance de Vendas',
    description: 'Acompanhamento das metas e resultados de vendas',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiMjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3IiwidCI6IjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3In0%3D',
    tags: ['metas', 'vendedores', 'territórios'],
    isFavorite: true,
    area: 'Vendas',
    category: 'vendas'
  },
  {
    id: '4',
    title: 'Indicadores de RH',
    description: 'Métricas de recursos humanos e headcount',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiMjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3IiwidCI6IjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3In0%3D',
    tags: ['funcionários', 'turnover', 'contratações'],
    isFavorite: false,
    area: 'RH',
    category: 'rh'
  },
  {
    id: '5',
    title: 'Produção e Qualidade',
    description: 'Monitoramento da produção e indicadores de qualidade',
    embed_url: 'https://app.powerbi.com/view?r=eyJrIjoiMjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3IiwidCI6IjQ0NzI0YzAtYzFhNy00YzE1LWE1NzYtNzM3NzM3NzM3NzM3In0%3D',
    tags: ['produção', 'qualidade', 'eficiência'],
    isFavorite: true,
    area: 'Operações',
    category: 'operacoes'
  }
];



export default function Home() {
  const [dashboards, setDashboards] = useState(exampleDashboards);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPortalConfig, setShowPortalConfig] = useState(false);
  const [showSecurityConfig, setShowSecurityConfig] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas as Áreas');
  const [adminKey, setAdminKey] = useState('');
  
  // Estado do portal
  const [portalConfig, setPortalConfig] = useState({
    name: 'Portal Corporativo',
    logo: '',
    primaryColor: '#cc0000',
    description: 'Acesse dashboards e relatórios gerenciais de todas as áreas da empresa'
  });

  useEffect(() => {
    checkAuthStatus();
    checkAdminAccess();
    loadPortalConfig();
  }, []);

  const loadPortalConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const config = await response.json();
        setPortalConfig({
          name: config.portal_name || 'Portal Corporativo',
          logo: config.logo_url || '',
          primaryColor: config.primary_color || '#cc0000',
          description: config.description || 'Acesse dashboards e relatórios gerenciais de todas as áreas da empresa'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do portal:', error);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
  };

  const checkAdminAccess = () => {
    // Não verificar acesso automaticamente - só quando necessário
    setHasAdminAccess(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setHasAdminAccess(true);
    setShowLogin(false);
    setShowAdmin(true);
    toast.success('Login realizado com sucesso!');
  };

  const handleLogout = () => {
    clearAccess();
    setIsAuthenticated(false);
    setHasAdminAccess(false);
    setShowAdmin(false);
    toast.success('Logout realizado com sucesso!');
  };

  const handleAdminKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateKey(adminKey);
    if (isValid) {
      accessControl.setAccess(undefined, adminKey);
      setHasAdminAccess(true);
      setShowAdmin(true);
      setShowAccessModal(false); // Fechar o modal de acesso
      setAdminKey('');
      toast.success('Acesso administrativo concedido!');
    } else {
      toast.error('Chave de acesso inválida!');
    }
  };

  const handlePortalConfigSave = async (config: any) => {
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portal_name: config.name,
          logo_url: config.logo,
          primary_color: config.primaryColor,
          description: config.description
        }),
      });

      if (response.ok) {
        setPortalConfig(config);
        toast.success('Configurações do portal atualizadas!');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  const handleSecurityConfigSave = (config: any) => {
    // Atualizar a chave de acesso no sistema
    accessControl.setAccess(undefined, config.adminKey);
    
    toast.success('Configurações de segurança atualizadas!');
    
    // Recarregar a página para aplicar as mudanças
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const toggleFavorite = (id: string) => {
    console.log('Toggle favorite for id:', id);
    
    setDashboards(prev => {
      const updated = prev.map(d => {
        if (d.id === id) {
          const newFavoriteState = !d.isFavorite;
          console.log('Toggling dashboard:', d.title, 'from', d.isFavorite, 'to', newFavoriteState);
          return { ...d, isFavorite: newFavoriteState };
        }
        return d;
      });
      return updated;
    });
  };

  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dashboard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dashboard.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = selectedArea === 'Todas as Áreas' || dashboard.area === selectedArea;
    
    return matchesSearch && matchesArea;
  });

  const favoriteCount = dashboards.filter(d => d.isFavorite).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicFavicon logoUrl={portalConfig.logo} />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                       style={{ backgroundColor: portalConfig.primaryColor }}>
                    {portalConfig.logo ? (
                      <img 
                        src={portalConfig.logo} 
                        alt="Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">P</span>
                    )}
                  </div>
                  <h1 className="text-xl font-bold" style={{ color: portalConfig.primaryColor }}>
                    {portalConfig.name}
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Botão de configurações */}
              <button
                onClick={() => {
                  console.log('Config button clicked. hasAdminAccess:', hasAdminAccess, 'isAuthenticated:', isAuthenticated);
                  setShowAccessModal(true);
                }}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Configurações Administrativas"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Login */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Modal de Acesso Administrativo */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Acesso Administrativo</h2>
              <button
                onClick={() => {
                  console.log('Closing access modal');
                  setShowAccessModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Digite a chave de acesso para entrar no painel administrativo:
            </p>
            <form onSubmit={handleAdminKeySubmit} className="space-y-4">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Digite a chave de acesso"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        </div>
      )}



      {/* Painel Administrativo */}
      {showAdmin && (hasAdminAccess || isAuthenticated) && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          dashboards={dashboards}
          setDashboards={setDashboards}
          onOpenPortalConfig={() => setShowPortalConfig(true)}
          onOpenSecurityConfig={() => setShowSecurityConfig(true)}
        />
      )}

      {/* Configurações do Portal */}
      {showPortalConfig && (
        <PortalConfig
          onClose={() => setShowPortalConfig(false)}
          onSave={handlePortalConfigSave}
          currentConfig={portalConfig}
        />
      )}

      {/* Configurações de Segurança */}
      {showSecurityConfig && (
        <SecurityConfig
          onClose={() => setShowSecurityConfig(false)}
          onSave={handleSecurityConfigSave}
          currentConfig={{
            adminKey: 'admin2024'
          }}
        />
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e Descrição */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Portal de Dashboards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {portalConfig.description}
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar dashboards, descrições ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
              <Heart size={16} className="fill-current" />
              <span>Favoritos ({favoriteCount})</span>
            </button>
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option>Todas as Áreas</option>
                <option>Financeiro</option>
                <option>Vendas</option>
                <option>RH</option>
                <option>Operações</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grade de Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDashboards.map((dashboard) => (
            <div key={dashboard.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{dashboard.title}</h3>
                <button
                  onClick={() => toggleFavorite(dashboard.id)}
                  className="text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors"
                >
                  <Heart 
                    size={16} 
                    className={`${dashboard.isFavorite ? 'fill-red-500 text-red-500' : 'fill-transparent'}`}
                    style={{ 
                      fill: dashboard.isFavorite ? '#ef4444' : 'transparent',
                      color: dashboard.isFavorite ? '#ef4444' : '#9ca3af'
                    }}
                  />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 flex-grow">{dashboard.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {dashboard.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <button 
                  onClick={() => window.open(dashboard.embed_url, '_blank')}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Eye size={16} />
                  <span>Visualizar</span>
                </button>
                <button 
                  onClick={() => window.open(dashboard.embed_url, '_blank')}
                  className="text-gray-400 hover:text-gray-600"
                  title="Abrir em nova aba"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDashboards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Nenhum dashboard encontrado.
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Tente ajustar os filtros de busca.
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 