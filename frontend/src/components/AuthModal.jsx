import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Lock, Eye, EyeOff } from 'lucide-react';

export const AuthModal = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Contraseña temporal (en producción esto vendría del backend)
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === ADMIN_PASSWORD) {
      setIsLoading(false);
      onSuccess();
    } else {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-emerald-800 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Acceso Administrativo
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-emerald-600 mt-2">
            Ingresa la contraseña para acceder al panel de administración
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-emerald-700">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="border-emerald-200 focus:border-emerald-400 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!password.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </div>
                ) : (
                  'Acceder'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-emerald-100">
            <p className="text-xs text-emerald-500 text-center">
              💡 <strong>Desarrollo:</strong> Contraseña temporal: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};