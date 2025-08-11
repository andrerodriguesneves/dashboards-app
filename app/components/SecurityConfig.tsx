'use client';

import { useState } from 'react';
import { X, Save, Key, User, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface SecurityConfig {
  adminKey: string;
}

interface SecurityConfigProps {
  onClose: () => void;
  onSave: (config: SecurityConfig) => void;
  currentConfig: SecurityConfig;
}

export default function SecurityConfig({
  onClose,
  onSave,
  currentConfig
}: SecurityConfigProps) {
  const [config, setConfig] = useState<SecurityConfig>(currentConfig);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar se o campo está preenchido
      if (!config.adminKey) {
        toast.error('A chave de acesso é obrigatória');
        return;
      }

      // Validar tamanho mínimo da chave
      if (config.adminKey.length < 6) {
        toast.error('A chave de acesso deve ter pelo menos 6 caracteres');
        return;
      }

      // Salvar no banco de dados via API
      const response = await fetch('/api/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const result = await response.json();

      if (result.success) {
        // Salvar configurações
        onSave(config);
        toast.success('Chave de acesso atualizada com sucesso!');
        onClose();
      } else {
        toast.error(result.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const generateSecureKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setConfig(prev => ({ ...prev, adminKey: result }));
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Configurações de Segurança</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Chave de Acesso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave de Acesso Administrativa
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={config.adminKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, adminKey: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Digite a nova chave de acesso"
                  required
                />
                <button
                  type="button"
                  onClick={generateSecureKey}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  title="Gerar chave segura"
                >
                  <Key size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Esta chave é usada para acessar o painel administrativo sem login
              </p>
            </div>



            {/* Informações de Segurança */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Importante
              </h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Guarde as novas credenciais em local seguro</li>
                <li>• A chave de acesso deve ser compartilhada apenas com administradores</li>
                <li>• Use senhas fortes com letras, números e símbolos</li>
                <li>• As configurações são salvas no navegador (localStorage)</li>
              </ul>
            </div>

            {/* Preview da Chave */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Chave de Acesso Atual
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Chave:</span>
                  <span className="ml-2 font-mono bg-gray-200 px-2 py-1 rounded">
                    {config.adminKey}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
} 