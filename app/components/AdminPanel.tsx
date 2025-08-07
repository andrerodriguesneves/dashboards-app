'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

interface Dashboard {
  id: string;
  title: string;
  description: string;
  embed_url: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  area: string;
}

interface AdminPanelProps {
  onClose: () => void;
  dashboards: Dashboard[];
  setDashboards: (dashboards: Dashboard[]) => void;
}

export default function AdminPanel({
  onClose,
  dashboards,
  setDashboards
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'dashboards'>('categories');
  const [loading, setLoading] = useState(false);

  // Estado para categorias
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'financeiro',
      name: 'Financeiro',
      subcategories: ['Fluxo de Caixa', 'Faturamento', 'Custos', 'Orçamento']
    },
    {
      id: 'rh',
      name: 'Recursos Humanos',
      subcategories: ['Headcount', 'Performance', 'Turnover', 'Recrutamento']
    },
    {
      id: 'vendas',
      name: 'Vendas',
      subcategories: ['Pipeline', 'Conversão', 'Metas', 'Territórios']
    },
    {
      id: 'operacoes',
      name: 'Operações',
      subcategories: ['Produção', 'Qualidade', 'Logística', 'Manutenção']
    }
  ]);

  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    subcategories: ''
  });

  // Estado para novo dashboard
  const [newDashboard, setNewDashboard] = useState({
    title: '',
    description: '',
    embed_url: '',
    category: ''
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!newCategory.id || !newCategory.name) {
        toast.error('ID e Nome da categoria são obrigatórios');
        return;
      }

      const subcategories = newCategory.subcategories
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const category: Category = {
        id: newCategory.id.toLowerCase(),
        name: newCategory.name,
        subcategories
      };

      setCategories(prev => [...prev, category]);
      setNewCategory({ id: '', name: '', subcategories: '' });
      toast.success('Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error('Erro ao adicionar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta categoria?')) {
      return;
    }

    try {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Categoria removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      toast.error('Erro ao remover categoria');
    }
  };

  const handleAddDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!newDashboard.title || !newDashboard.embed_url || !newDashboard.category) {
        toast.error('Título, URL e categoria são obrigatórios');
        return;
      }

      const dashboard: Dashboard = {
        id: Date.now().toString(),
        title: newDashboard.title,
        description: newDashboard.description,
        embed_url: newDashboard.embed_url,
        category: newDashboard.category,
        tags: [newDashboard.category],
        isFavorite: false,
        area: newDashboard.category
      };

      // Adicionar o novo dashboard à lista
      setDashboards([...dashboards, dashboard]);
      setNewDashboard({ title: '', description: '', embed_url: '', category: '' });
      
      // Notificação de sucesso
      toast.success('Dashboard adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar dashboard:', error);
      toast.error('Erro ao adicionar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDashboard = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este dashboard?')) {
      return;
    }

    try {
      // Remover o dashboard da lista
      setDashboards(dashboards.filter(d => d.id !== id));
      toast.success('Dashboard removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover dashboard:', error);
      toast.error('Erro ao remover dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Configurações de Negócio</h2>
            <p className="text-gray-600 mt-1">Configure categorias, dashboards e textos do sistema</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'categories'
                ? 'text-red-600 border-b-2 border-red-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('dashboards')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'dashboards'
                ? 'text-red-600 border-b-2 border-red-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboards
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Adicionar Nova Categoria */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Adicionar Nova Categoria</h3>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID da Categoria
                      </label>
                      <input
                        type="text"
                        value={newCategory.id}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="ex: vendas"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Categoria
                      </label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="ex: Vendas"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategorias (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={newCategory.subcategories}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, subcategories: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="ex: Pipeline, Conversão, Metas"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Plus size={16} className="mr-2" />
                    )}
                    Adicionar Categoria
                  </button>
                </form>
              </div>

              {/* Categorias Existentes */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Categorias Existentes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                      <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Subcategorias:</strong> {category.subcategories.join(', ')}
                      </p>
                      <button
                        onClick={() => handleRemoveCategory(category.id)}
                        className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboards' && (
            <div className="space-y-6">
              {/* Adicionar Novo Dashboard */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Adicionar Novo Dashboard</h3>
                <form onSubmit={handleAddDashboard} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título do Dashboard
                      </label>
                      <input
                        type="text"
                        value={newDashboard.title}
                        onChange={(e) => setNewDashboard(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria
                      </label>
                      <select
                        value={newDashboard.category}
                        onChange={(e) => setNewDashboard(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={newDashboard.description}
                      onChange={(e) => setNewDashboard(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de Incorporação
                    </label>
                    <input
                      type="url"
                      value={newDashboard.embed_url}
                      onChange={(e) => setNewDashboard(prev => ({ ...prev, embed_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Plus size={16} className="mr-2" />
                    )}
                    Adicionar Dashboard
                  </button>
                </form>
              </div>

              {/* Lista de Dashboards */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Dashboards Existentes</h3>
                <div className="space-y-3">
                  {dashboards.map((dashboard) => (
                    <div key={dashboard.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{dashboard.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{dashboard.description}</p>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-2">
                          {dashboard.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveDashboard(dashboard.id)}
                        className="btn-danger flex items-center ml-4"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button className="btn-primary flex items-center">
            <Save size={16} className="mr-2" />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
} 