import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = "Buscar en el catálogo..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch]);

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-12 text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 p-2 h-8 w-8 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-emerald-100 p-3 z-10">
          <p className="text-sm text-emerald-600">
            <span className="font-medium">Buscando:</span> "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};