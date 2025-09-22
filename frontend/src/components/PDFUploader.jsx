import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileText, X, Download, AlertCircle, CheckCircle } from 'lucide-react';

export const PDFUploader = ({ onProductsExtracted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedProducts, setExtractedProducts] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea un PDF
      if (file.type !== 'application/pdf') {
        setError('Por favor selecciona un archivo PDF válido');
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Por favor selecciona un PDF menor a 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setExtractedProducts([]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setExtractedProducts([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processPDF = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Simular procesamiento de PDF (en un caso real, esto sería una llamada al backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Datos de ejemplo extraídos del PDF
      const mockExtractedProducts = [
        {
          titulo: 'Call of Duty: Modern Warfare III',
          descripcion: 'Shooter en primera persona con campaña épica',
          pais: 'Estados Unidos',
          fecha_lanzamiento: '2023-11-10',
          plataformas: ['PC', 'PlayStation 5', 'Xbox Series X'],
          categoria: 'juegos',
          subcategoria: 'pc'
        },
        {
          titulo: 'Spider-Man 2',
          descripcion: 'Aventura de superhéroes en Nueva York',
          pais: 'Estados Unidos',
          fecha_lanzamiento: '2023-10-20',
          plataformas: ['PlayStation 5'],
          categoria: 'juegos',
          subcategoria: 'pc'
        },
        {
          titulo: 'Adobe Photoshop 2024',
          descripcion: 'Software profesional de edición de imágenes',
          pais: 'Estados Unidos',
          fecha_lanzamiento: '2023-10-15',
          plataformas: ['Windows', 'macOS'],
          categoria: 'aplicaciones',
          subcategoria: 'pc'
        }
      ];
      
      setExtractedProducts(mockExtractedProducts);
      
    } catch (err) {
      setError('Error al procesar el PDF. Por favor intenta nuevamente.');
      console.error('Error processing PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const addExtractedProducts = () => {
    if (onProductsExtracted && extractedProducts.length > 0) {
      onProductsExtracted(extractedProducts);
      alert(`${extractedProducts.length} productos agregados exitosamente al catálogo`);
      clearFile();
    }
  };

  const downloadTemplate = () => {
    // En un caso real, esto descargaría una plantilla PDF de ejemplo
    alert('Función de descarga de plantilla en desarrollo');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Importar desde PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¿Cómo funciona?</p>
              <p>Sube un PDF con el catálogo de productos y el sistema extraerá automáticamente la información para agregarla al sitio web.</p>
            </div>
          </div>
        </div>

        {/* Botón de plantilla */}
        <Button
          onClick={downloadTemplate}
          variant="outline"
          size="sm"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Plantilla de Ejemplo
        </Button>

        {/* Selector de archivo */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-200 transition-colors duration-200 border border-emerald-200"
            >
              <Upload className="w-4 h-4" />
              Seleccionar PDF
            </label>
            {selectedFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFile}
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              >
                <X className="w-4 h-4 mr-2" />
                Quitar
              </Button>
            )}
          </div>
          
          {selectedFile && (
            <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <div>
                  <p><strong>Archivo seleccionado:</strong> {selectedFile.name}</p>
                  <p><strong>Tamaño:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botón procesar */}
        {selectedFile && !extractedProducts.length && (
          <Button
            onClick={processPDF}
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Procesando PDF...
              </div>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Procesar PDF
              </>
            )}
          </Button>
        )}

        {/* Productos extraídos */}
        {extractedProducts.length > 0 && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">¡Extracción exitosa!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Se encontraron {extractedProducts.length} productos en el PDF
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {extractedProducts.map((product, index) => (
                <div key={index} className="bg-white border border-emerald-100 rounded-lg p-3">
                  <h4 className="font-medium text-emerald-900">{product.titulo}</h4>
                  <p className="text-sm text-emerald-600">{product.descripcion}</p>
                  <div className="flex gap-4 text-xs text-emerald-500 mt-1">
                    <span>País: {product.pais}</span>
                    <span>Categoría: {product.categoria}</span>
                    {product.plataformas && <span>Plataformas: {product.plataformas.join(', ')}</span>}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={addExtractedProducts}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Agregar {extractedProducts.length} Productos al Catálogo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};