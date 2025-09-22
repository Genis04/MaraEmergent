import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileText, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const PDFUploader = ({ onProductsExtracted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedProducts, setExtractedProducts] = useState([]);
  const [error, setError] = useState('');
  const [processingInfo, setProcessingInfo] = useState('');
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
      setProcessingInfo('');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setExtractedProducts([]);
    setError('');
    setProcessingInfo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processPDF = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError('');
    setProcessingInfo('Subiendo archivo...');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      setProcessingInfo('Analizando contenido del PDF...');
      
      const response = await axios.post(`${API}/pdf/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 segundos
      });
      
      if (response.data.success) {
        setExtractedProducts(response.data.products);
        setProcessingInfo(`Procesamiento completado. Se encontraron ${response.data.products.length} productos.`);
      } else {
        setError('No se pudieron extraer productos del PDF');
      }
      
    } catch (err) {
      console.error('Error processing PDF:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === 'ECONNABORTED') {
        setError('El procesamiento tomó demasiado tiempo. Intenta con un archivo más pequeño.');
      } else {
        setError('Error al procesar el PDF. Por favor intenta nuevamente.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const addExtractedProducts = async () => {
    if (!extractedProducts.length) return;
    
    try {
      setIsProcessing(true);
      setProcessingInfo('Guardando productos en el catálogo...');
      
      const response = await axios.post(`${API}/pdf/save-products`, extractedProducts);
      
      if (response.data.success) {
        if (onProductsExtracted) {
          onProductsExtracted(extractedProducts);
        }
        alert(`${response.data.saved_count} productos agregados exitosamente al catálogo`);
        clearFile();
      } else {
        setError('Error al guardar los productos');
      }
      
    } catch (err) {
      console.error('Error saving products:', err);
      setError('Error al guardar los productos en el catálogo');
    } finally {
      setIsProcessing(false);
      setProcessingInfo('');
    }
  };

  const downloadTemplate = () => {
    // Crear un PDF de ejemplo con texto simulado
    const templateText = `
CATÁLOGO DE PRODUCTOS - EJEMPLO

Producto: Cyberpunk 2077
Descripción: Juego de rol futurista en primera persona ambientado en Night City
País: Polonia
Fecha: 2020-12-10
Plataformas: PC, PlayStation 5, Xbox Series X
Categoría: Juegos

Producto: The Witcher 3: Wild Hunt
Descripción: RPG de fantasía medieval con Geralt de Rivia
País: Polonia  
Fecha: 2015-05-19
Plataformas: PC, PlayStation 4, Xbox One, Nintendo Switch
Categoría: Juegos

Producto: Adobe Photoshop 2024
Descripción: Software profesional de edición de imágenes y diseño gráfico
País: Estados Unidos
Fecha: 2023-10-15
Plataformas: Windows, macOS
Categoría: Aplicaciones
    `;
    
    const blob = new Blob([templateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-catalogo-ejemplo.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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