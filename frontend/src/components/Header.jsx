import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import { SearchBar } from './SearchBar';

export const Header = ({ onAdminClick, onSearch, logo }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            {logo ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center ${logo ? 'hidden' : ''}`}
            >
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="text-2xl font-bold text-emerald-800">Mara Productions</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <SearchBar onSearch={onSearch} />
            <Button
              variant="outline"
              size="sm"
              onClick={onAdminClick}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};