import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, Plus, Save, Trash2, Upload, Image } from 'lucide-react';
import { mockData } from '../mock';
import { SocialConfig } from './SocialConfig';
import { PDFUploader } from './PDFUploader';

export const AdminPanel = ({ onClose, onLogoChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [imageOption, setImageOption] = useState('url'); // 'url' or 'upload'
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [logoOption, setLogoOption] = useState('url'); // 'url' or 'upload'
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    pais: '',
    fechaLanzamiento: '',
    plataformas: []
  });
  const [newPlatform, setNewPlatform] = useState('');

  const categories = {
    juegos: { name: 'Juegos', subcategories: { pc: 'PC', xboxOne: 'Xbox One', xboxSeries: 'Xbox Series S/X' } },
    aplicaciones: { name: 'Aplicaciones', subcategories: { apple: 'Apple', android: 'Android' } },
    seriesTV: { name: 'Series TV' },
    telenovelas: { name: 'Telenovelas' },
    peliculas: { name: 'Películas' },
    realitys: { name: 'Realitys' },
    animados: { name: 'Animados' },
    animes: { name: 'Animes' }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 2MB para logos)
      if (file.size > 2 * 1024 * 1024) {
        alert('El logo es demasiado grande. Por favor selecciona una imagen menor a 2MB');
        return;
      }

      setSelectedLogo(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        if (onLogoChange) {
          onLogoChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setSelectedLogo(null);
    setLogoPreview('');
    setLogoUrl('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    if (onLogoChange) {
      onLogoChange('');
    }
  };

  const handleLogoUrlChange = (url) => {
    setLogoUrl(url);
    setLogoPreview(url);
    setSelectedLogo(null);
    if (onLogoChange) {
      onLogoChange(url);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imagen: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que tenga imagen
    if (!formData.imagen) {
      alert('Por favor agrega una imagen');
      return;
    }
    
    console.log('Guardando producto:', {
      ...formData,
      imageFile: selectedImage // Para enviar al backend
    });
    // Aquí se implementará la integración con el backend
    alert('Producto guardado exitosamente (mock)');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      imagen: '',
      pais: '',
      fechaLanzamiento: '',
      plataformas: []
    });
    setSelectedImage(null);
    setImagePreview('');
    setImageOption('url');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addPlatform = () => {
    if (newPlatform.trim() && !formData.plataformas.includes(newPlatform.trim())) {
      setFormData(prev => ({
        ...prev,
        plataformas: [...prev.plataformas, newPlatform.trim()]
      }));
      setNewPlatform('');
    }
  };

  const removePlatform = (platform) => {
    setFormData(prev => ({
      ...prev,
      plataformas: prev.plataformas.filter(p => p !== platform)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-emerald-100 p-6 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold text-emerald-800">Panel de Administración</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="products" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs">
                Productos
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs">
                Logo
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs">
                Redes Sociales
              </TabsTrigger>
              <TabsTrigger value="pdf" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs">
                Importar PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-6">
              <SocialConfig onSave={handleSocialConfigSave} />
            </TabsContent>

            <TabsContent value="pdf" className="space-y-6">
              <PDFUploader onProductsExtracted={handlePDFProductsExtracted} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">Logo de la Página</h3>
                
                <Tabs value={logoOption} onValueChange={setLogoOption} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="url" className="text-xs">URL del Logo</TabsTrigger>
                    <TabsTrigger value="upload" className="text-xs">Subir Logo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url">
                    <Input
                      value={logoUrl}
                      onChange={(e) => handleLogoUrlChange(e.target.value)}
                      placeholder="https://ejemplo.com/logo.png"
                      className="border-emerald-200 focus:border-emerald-400"
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-200 transition-colors duration-200 border border-emerald-200"
                        >
                          <Upload className="w-4 h-4" />
                          Seleccionar Logo
                        </label>
                        {selectedLogo && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearLogo}
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Quitar
                          </Button>
                        )}
                      </div>
                      
                      {selectedLogo && (
                        <div className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded">
                          <strong>Logo seleccionado:</strong> {selectedLogo.name} ({(selectedLogo.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Preview del logo */}
                {logoPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-emerald-700 mb-2">Vista previa del logo:</p>
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Vista previa del logo"
                        className="w-16 h-16 object-cover rounded-lg border border-emerald-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-16 h-16 bg-emerald-100 rounded-lg border border-emerald-200 hidden items-center justify-center"
                      >
                        <div className="text-center text-emerald-600">
                          <Image className="w-4 h-4 mx-auto mb-1" />
                          <p className="text-xs">Error</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="products">
              <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Categoría</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && categories[selectedCategory].subcategories && (
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Subcategoría</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Seleccionar subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories[selectedCategory].subcategories).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Título</label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Título del producto"
                className="border-emerald-200 focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Descripción</label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción breve del producto"
                className="border-emerald-200 focus:border-emerald-400 resize-none"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Imagen del Producto</label>
              
              <Tabs value={imageOption} onValueChange={setImageOption} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="url" className="text-xs">URL de Imagen</TabsTrigger>
                  <TabsTrigger value="upload" className="text-xs">Subir Archivo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="url">
                  <Input
                    value={formData.imagen}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, imagen: e.target.value }));
                      setImagePreview(e.target.value);
                      setSelectedImage(null);
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </TabsContent>
                
                <TabsContent value="upload">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-200 transition-colors duration-200 border border-emerald-200"
                      >
                        <Upload className="w-4 h-4" />
                        Seleccionar Imagen
                      </label>
                      {selectedImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearImage}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Quitar
                        </Button>
                      )}
                    </div>
                    
                    {selectedImage && (
                      <div className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded">
                        <strong>Archivo seleccionado:</strong> {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Preview de la imagen */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-emerald-700 mb-2">Vista previa:</p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-32 h-24 object-cover rounded-lg border border-emerald-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-32 h-24 bg-emerald-100 rounded-lg border border-emerald-200 hidden items-center justify-center"
                    >
                      <div className="text-center text-emerald-600">
                        <Image className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-xs">Error al cargar</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">País</label>
                <Input
                  value={formData.pais}
                  onChange={(e) => setFormData(prev => ({ ...prev, pais: e.target.value }))}
                  placeholder="País de origen"
                  className="border-emerald-200 focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Fecha de Lanzamiento</label>
                <Input
                  type="date"
                  value={formData.fechaLanzamiento}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaLanzamiento: e.target.value }))}
                  className="border-emerald-200 focus:border-emerald-400"
                  required
                />
              </div>
            </div>

            {(selectedCategory === 'juegos' || selectedCategory === 'aplicaciones') && (
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Plataformas</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    placeholder="Agregar plataforma"
                    className="border-emerald-200 focus:border-emerald-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPlatform())}
                  />
                  <Button type="button" onClick={addPlatform} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.plataformas.map((platform, index) => (
                    <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {platform}
                      <button
                        type="button"
                        onClick={() => removePlatform(platform)}
                        className="ml-2 text-emerald-500 hover:text-emerald-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Producto
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Limpiar
              </Button>
            </div>
          </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};