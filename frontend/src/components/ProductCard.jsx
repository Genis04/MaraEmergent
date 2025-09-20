import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-emerald-100 hover:border-emerald-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.imagen}
            alt={product.titulo}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1">
          {product.titulo}
        </h3>
        
        <p className="text-sm text-emerald-700 leading-relaxed line-clamp-2">
          {product.descripcion}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-emerald-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{product.pais}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(product.fechaLanzamiento)}</span>
          </div>
        </div>
        
        {product.plataformas && (
          <div className="flex flex-wrap gap-1 pt-2">
            {product.plataformas.map((plataforma, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200"
              >
                {plataforma}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};