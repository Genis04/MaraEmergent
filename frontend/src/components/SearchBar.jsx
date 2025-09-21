import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = "Buscar en el catálogo..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 200); // Delay para permitir que la animación termine
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

  const handleInputBlur = (e) => {
    // Solo colapsar si el clic no fue en el container de búsqueda
    if (!containerRef.current?.contains(e.relatedTarget) && !searchTerm.trim()) {
      setTimeout(() => {
        setIsExpanded(false);
      }, 150);
    }
  };

  return (
    <div className="relative flex justify-center">
      <div ref={containerRef} className="relative">
        <div className={`
          relative flex items-center
          ${isExpanded ? 'w-80 md:w-96' : 'w-12'}
          h-12 
          bg-white/90 backdrop-blur-sm 
          border border-emerald-200 
          rounded-full 
          shadow-lg 
          transition-all duration-500 ease-out
          ${isExpanded ? 'shadow-xl' : 'hover:shadow-xl hover:scale-105'}
          ${!isExpanded ? 'cursor-pointer' : ''}
        `}>
          {!isExpanded ? (
            // Ícono de lupa colapsado
            <Button
              onClick={handleExpand}
              className="w-full h-full bg-transparent hover:bg-emerald-50/50 border-0 rounded-full p-0 transition-all duration-300 group"
            >
              <Search className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
            </Button>
          ) : (
            // Barra de búsqueda expandida
            <>
              <div className="absolute left-4 pointer-events-none">
                <Search className="w-5 h-5 text-emerald-500 transition-all duration-300" />
              </div>
              <Input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                placeholder={placeholder}
                className="pl-12 pr-20 h-full text-base border-0 bg-transparent focus:ring-0 focus:outline-none rounded-full placeholder:text-emerald-400"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100/50 p-2 h-8 w-8 rounded-full transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCollapse}
                  className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100/50 p-2 h-8 w-8 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
        
        {searchTerm && isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100 p-4 z-10 transform transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2">
            <p className="text-sm text-emerald-600 flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="font-medium">Buscando:</span> 
              <span className="bg-emerald-100 px-2 py-1 rounded-md text-emerald-800">"{searchTerm}"</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};