'use client';

import { useState } from 'react';
import { Upload, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface PortalConfig {
  name: string;
  logo: string;
  primaryColor: string;
  description: string;
}

interface PortalConfigProps {
  onClose: () => void;
  onSave: (config: PortalConfig) => void;
  currentConfig: PortalConfig;
}

export default function PortalConfig({
  onClose,
  onSave,
  currentConfig
}: PortalConfigProps) {
  const [config, setConfig] = useState<PortalConfig>(currentConfig);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(currentConfig.logo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let logoUrl = config.logo;

      // Upload do logo se um novo arquivo foi selecionado
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          logoUrl = uploadResult.url;
        } else {
          throw new Error('Erro no upload do logo');
        }
      }

      // Salvar configurações com a nova URL do logo
      const updatedConfig = {
        ...config,
        logo: logoUrl
      };

      onSave(updatedConfig);
      toast.success('Configurações salvas com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Configurações do Portal</h2>
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
            {/* Nome do Portal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Portal
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Portal Corporativo"
                required
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo do Portal
              </label>
              <div className="space-y-4">
                {/* Preview do Logo */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Sem logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                    >
                      <Upload size={16} />
                      <span>Escolher Logo</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: PNG, JPG, SVG. Tamanho máximo: 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cor Primária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={config.primaryColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="#cc0000"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Portal
              </label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Acesse dashboards e relatórios gerenciais de todas as áreas da empresa"
              />
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview do Header
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                         style={{ backgroundColor: config.primaryColor }}>
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">P</span>
                      )}
                    </div>
                    <h1 className="text-lg font-bold" style={{ color: config.primaryColor }}>
                      {config.name}
                    </h1>
                  </div>
                  <button className="p-2 text-gray-600 hover:text-gray-800">
                    <span className="sr-only">Configurações</span>
                    ⚙️
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
            className="btn-primary flex items-center"
          >
            <Save size={16} className="mr-2" />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
} 