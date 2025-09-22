import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2, Edit, Eye } from 'lucide-react';

export const ProductList = ({ products, isAdmin = false, onEdit, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = () => {
    if (deleteConfirm && onDelete) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-emerald-600">
        <p className="text-lg mb-2">No se encontraron productos</p>
        <p className="text-sm text-emerald-500">Intenta con otros términos de búsqueda</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            
            {isAdmin && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm border-emerald-200 text-emerald-600 hover:bg-emerald-50 h-8 w-8 p-0"
                  onClick={() => onEdit && onEdit(product)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                  onClick={() => handleDeleteClick(product)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-800 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Confirmar Eliminación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700">
                ¿Estás seguro de que deseas eliminar el producto:
              </p>
              <p className="font-semibold text-emerald-900 bg-emerald-50 p-2 rounded">
                "{deleteConfirm.titulo}"
              </p>
              <p className="text-sm text-red-600">
                Esta acción no se puede deshacer.
              </p>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};