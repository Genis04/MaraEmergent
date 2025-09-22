import React from 'react';
import { ExternalLink, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer = ({ socialNetworks = [], businessGroups = [] }) => {
  const getIcon = (iconName) => {
    const icons = {
      Facebook: Facebook,
      Instagram: Instagram,
      Twitter: Twitter,
      Youtube: Youtube
    };
    const Icon = icons[iconName] || ExternalLink;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <footer className="bg-emerald-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">Mara Productions</h3>
            <p className="text-emerald-200 leading-relaxed">
              Tu fuente confiable para el mejor entretenimiento digital. Catálogo actualizado constantemente con las últimas novedades.
            </p>
          </div>

          {/* Redes Sociales */}
          {socialNetworks.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-emerald-100">Síguenos</h4>
              <div className="flex flex-wrap gap-3">
                {socialNetworks.map((network, index) => (
                  <a
                    key={index}
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    {getIcon(network.icon)}
                    <span className="text-sm">{network.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Grupos del Negocio */}
          {businessGroups.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-emerald-100">Nuestros Grupos</h4>
              <div className="space-y-3">
                {businessGroups.map((group, index) => (
                  <div key={index} className="bg-emerald-800 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-emerald-100">{group.name}</h5>
                        {group.description && (
                          <p className="text-sm text-emerald-200 mt-1">{group.description}</p>
                        )}
                      </div>
                      {group.link && (
                        <a
                          href={group.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-emerald-300 hover:text-emerald-100 transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-emerald-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-emerald-300 text-sm">
              © {new Date().getFullYear()} Mara Productions. Todos los derechos reservados.
            </p>
            <p className="text-emerald-400 text-xs mt-2 md:mt-0">
              Catálogo digital actualizado constantemente
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};