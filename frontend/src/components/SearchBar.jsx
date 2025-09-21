import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = "Buscar en el catálogo..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setSearchTerm('');
    onSearch('');
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCollapse();
    }
  };

  const handleInputBlur = () => {
    // Solo colapsar si no hay término de búsqueda
    if (!searchTerm.trim()) {
      setTimeout(() => {
        setIsExpanded(false);
      }, 150);
    }
  };

  return (
    <div className="relative flex justify-center mb-8">
      <div className="relative">
        {!isExpanded ? (
          // Ícono de lupa colapsado
          <Button
            onClick={handleExpand}
            className="bg-white/80 backdrop-blur-sm border border-emerald-200 hover:border-emerald-400 hover:bg-white shadow-lg rounded-full w-12 h-12 p-0 transition-all duration-300 hover:scale-110 group"
          >
            <Search className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200" />
          </Button>
        ) : (
          // Barra de búsqueda expandida
          <div className="relative">
            <div className="flex items-center bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full shadow-lg transition-all duration-300 animate-in slide-in-from-right-4">
              <Search className="absolute left-4 text-emerald-500 w-5 h-5 pointer-events-none" />
              <Input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                placeholder={placeholder}
                className="pl-12 pr-20 h-12 text-lg border-0 bg-transparent focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 rounded-full w-80 md:w-96"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 p-2 h-8 w-8 rounded-full transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCollapse}
                  className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 p-2 h-8 w-8 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-emerald-100 p-3 z-10 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <p className="text-sm text-emerald-600">
                  <span className="font-medium">Buscando:</span> "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};