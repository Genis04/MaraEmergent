import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';

export const Header = ({ onAdminClick }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="text-2xl font-bold text-emerald-800">Mara Productions</span>
          </Link>
          
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
    </header>
  );
};