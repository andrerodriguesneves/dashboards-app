'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, User, Search, Heart, Eye, ExternalLink, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas as Áreas');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowAdmin(true);
    toast.success('Login realizado com sucesso!');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setShowAdmin(false);
    toast.success('Logout realizado com sucesso!');
  };

  const toggleFavorite = (id: string) => {
    setDashboards(prev => prev.map(d => 
      d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
    ));
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-red-600">Portal Corporativo</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar dashboards, relatórios..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => isAuthenticated ? setShowAdmin(true) : setShowLogin(true)}
                className="p-2 text-gray-600 hover:text-gray-800"
                title="Configurações"
              >
                <Settings size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <User size={20} />
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

      {/* Painel Administrativo */}
      {showAdmin && isAuthenticated && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onLogout={handleLogout}
          dashboards={dashboards}
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
            Acesse dashboards e relatórios gerenciais de todas as áreas da empresa
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
                  className="text-gray-400 hover:text-red-500 flex-shrink-0"
                >
                  <Heart size={16} className={dashboard.isFavorite ? 'fill-red-500 text-red-500' : ''} />
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
                <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  <Eye size={16} />
                  <span>Visualizar</span>
                </button>
                <button className="text-gray-400 hover:text-gray-600">
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