import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Plus, X, Save, Facebook, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';

export const SocialConfig = ({ onSave }) => {
  const [socialNetworks, setSocialNetworks] = useState([
    { id: 1, name: 'Facebook', url: '', icon: 'Facebook' },
    { id: 2, name: 'Instagram', url: '', icon: 'Instagram' },
    { id: 3, name: 'Twitter', url: '', icon: 'Twitter' },
    { id: 4, name: 'YouTube', url: '', icon: 'Youtube' }
  ]);
  
  const [businessGroups, setBusinessGroups] = useState([
    { id: 1, name: '', description: '', link: '' }
  ]);

  const getIcon = (iconName) => {
    const icons = {
      Facebook: Facebook,
      Instagram: Instagram,
      Twitter: Twitter,
      Youtube: Youtube
    };
    const Icon = icons[iconName] || ExternalLink;
    return <Icon className="w-4 h-4" />;
  };

  const updateSocialNetwork = (id, field, value) => {
    setSocialNetworks(prev => 
      prev.map(network => 
        network.id === id ? { ...network, [field]: value } : network
      )
    );
  };

  const addBusinessGroup = () => {
    const newId = Math.max(...businessGroups.map(g => g.id)) + 1;
    setBusinessGroups(prev => [...prev, { id: newId, name: '', description: '', link: '' }]);
  };

  const removeBusinessGroup = (id) => {
    setBusinessGroups(prev => prev.filter(group => group.id !== id));
  };

  const updateBusinessGroup = (id, field, value) => {
    setBusinessGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, [field]: value } : group
      )
    );
  };

  const handleSave = () => {
    const config = {
      socialNetworks: socialNetworks.filter(network => network.url.trim()),
      businessGroups: businessGroups.filter(group => group.name.trim())
    };
    
    if (onSave) {
      onSave(config);
    }
    
    console.log('Guardando configuración social:', config);
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Redes Sociales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
            <Instagram className="w-5 h-5" />
            Redes Sociales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialNetworks.map((network) => (
            <div key={network.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-[120px]">
                {getIcon(network.icon)}
                <span className="text-sm font-medium text-emerald-700">{network.name}</span>
              </div>
              <Input
                value={network.url}
                onChange={(e) => updateSocialNetwork(network.id, 'url', e.target.value)}
                placeholder={`URL de ${network.name}`}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Grupos del Negocio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Grupos del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {businessGroups.map((group, index) => (
            <div key={group.id} className="border border-emerald-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-emerald-800">Grupo #{index + 1}</h4>
                {businessGroups.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBusinessGroup(group.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={group.name}
                  onChange={(e) => updateBusinessGroup(group.id, 'name', e.target.value)}
                  placeholder="Nombre del grupo"
                  className="border-emerald-200 focus:border-emerald-400"
                />
                <Input
                  value={group.link}
                  onChange={(e) => updateBusinessGroup(group.id, 'link', e.target.value)}
                  placeholder="Enlace del grupo"
                  className="border-emerald-200 focus:border-emerald-400"
                />
              </div>
              
              <Textarea
                value={group.description}
                onChange={(e) => updateBusinessGroup(group.id, 'description', e.target.value)}
                placeholder="Descripción del grupo"
                className="border-emerald-200 focus:border-emerald-400 resize-none"
                rows={2}
              />
            </div>
          ))}
          
          <Button
            onClick={addBusinessGroup}
            variant="outline"
            className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Grupo
          </Button>
        </CardContent>
      </Card>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
};