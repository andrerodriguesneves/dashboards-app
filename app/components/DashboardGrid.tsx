'use client';

import { Dashboard } from '../../lib/database';

interface DashboardGridProps {
  dashboards: Dashboard[];
}

export default function DashboardGrid({ dashboards }: DashboardGridProps) {
  if (dashboards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          Nenhum dashboard disponível no momento.
        </div>
        <div className="text-gray-400 text-sm mt-2">
          Entre em contato com o administrador para adicionar dashboards.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {dashboards.map((dashboard) => (
        <div key={dashboard.id} className="dashboard-card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {dashboard.title}
            </h3>
          </div>
          <div className="p-0">
            <iframe
              src={dashboard.embed_url}
              className="dashboard-iframe"
              title={dashboard.title}
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
} 