from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List
import pdfplumber
import io
import re
from datetime import datetime
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()
logger = logging.getLogger(__name__)

# Dependency para obtener la base de datos
async def get_database() -> AsyncIOMotorDatabase:
    from server import db
    return db

class PDFProcessor:
    def __init__(self):
        self.patterns = {
            'titulo': [
                r'(?:título|title|nombre):\s*([^\n]+)',
                r'^([A-Z][^:\n]+(?:\s+[A-Z][^\n]*)*)\s*$',
                r'(?:^|\n)([A-Z][A-Za-z0-9\s:]+(?:20\d{2}|III|IV|V|VI|VII|VIII|IX|X))',
            ],
            'descripcion': [
                r'(?:descripción|description|resumen|summary):\s*([^\n]+(?:\n[^\n:]*)*)',
                r'(?:overview|sinopsis):\s*([^\n]+)',
            ],
            'pais': [
                r'(?:país|country|origin|procedencia):\s*([^\n]+)',
                r'(?:desarrollado en|made in|from):\s*([^\n]+)',
                r'\b(Estados Unidos|USA|United States|España|Spain|Francia|France|Alemania|Germany|Reino Unido|UK|Japón|Japan|China|Corea del Sur|South Korea|México|Mexico|Argentina|Brasil|Brazil|Italia|Italy|Canadá|Canada|Australia|Suecia|Sweden|Polonia|Poland|Holanda|Netherlands)\b'
            ],
            'fecha': [
                r'(?:fecha|date|año|year|lanzamiento|release):\s*(\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{4})',
                r'(?:released|launched):\s*(\d{4})',
                r'\b(20\d{2})\b'
            ],
            'plataformas': [
                r'(?:plataformas|platforms|available on):\s*([^\n]+)',
                r'(?:compatible con|supports):\s*([^\n]+)',
                r'\b(PC|PlayStation|Xbox|Nintendo|Switch|PS5|PS4|Xbox One|Xbox Series|Windows|macOS|Linux|Android|iOS|Steam|Epic Games)\b'
            ],
            'categoria': [
                r'(?:categoría|category|tipo|type|género|genre):\s*([^\n]+)',
                r'\b(juego|game|aplicación|app|serie|series|película|movie|telenovela|reality|animado|anime)\b'
            ]
        }

    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        """Extrae todo el texto del PDF"""
        try:
            with pdfplumber.open(io.BytesIO(pdf_content)) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise HTTPException(status_code=400, detail="Error al procesar el PDF")

    def extract_products_from_text(self, text: str) -> List[dict]:
        """Extrae productos del texto usando patrones"""
        products = []
        
        # Dividir el texto en secciones (por ejemplo, por páginas o párrafos)
        sections = self._split_into_sections(text)
        
        for section in sections:
            product = self._extract_product_from_section(section)
            if product and product.get('titulo'):
                products.append(product)
        
        return products

    def _split_into_sections(self, text: str) -> List[str]:
        """Divide el texto en secciones lógicas"""
        # Dividir por saltos de página múltiples o patrones específicos
        sections = re.split(r'\n\s*\n\s*\n|\f|\n-{3,}', text)
        return [section.strip() for section in sections if len(section.strip()) > 50]

    def _extract_product_from_section(self, section: str) -> dict:
        """Extrae información de un producto de una sección de texto"""
        product = {
            'titulo': '',
            'descripcion': '',
            'pais': '',
            'fecha_lanzamiento': '',
            'plataformas': [],
            'categoria': 'juegos',
            'subcategoria': 'pc'
        }

        # Extraer título
        for pattern in self.patterns['titulo']:
            match = re.search(pattern, section, re.MULTILINE | re.IGNORECASE)
            if match:
                titulo = match.group(1).strip()
                if len(titulo) > 3 and len(titulo) < 100:
                    product['titulo'] = titulo
                    break

        # Extraer descripción
        for pattern in self.patterns['descripcion']:
            match = re.search(pattern, section, re.MULTILINE | re.IGNORECASE | re.DOTALL)
            if match:
                descripcion = match.group(1).strip()[:500]  # Limitar longitud
                product['descripcion'] = descripcion
                break
        
        # Si no hay descripción específica, usar primeras líneas después del título
        if not product['descripcion'] and product['titulo']:
            lines = section.split('\n')
            title_found = False
            desc_parts = []
            for line in lines:
                if product['titulo'].lower() in line.lower():
                    title_found = True
                    continue
                if title_found and line.strip():
                    desc_parts.append(line.strip())
                    if len(' '.join(desc_parts)) > 100:
                        break
            if desc_parts:
                product['descripcion'] = ' '.join(desc_parts)[:500]

        # Extraer país
        for pattern in self.patterns['pais']:
            match = re.search(pattern, section, re.IGNORECASE)
            if match:
                product['pais'] = match.group(1).strip()
                break

        # Extraer fecha
        for pattern in self.patterns['fecha']:
            match = re.search(pattern, section, re.IGNORECASE)
            if match:
                fecha = match.group(1)
                # Formatear fecha
                if len(fecha) == 4:  # Solo año
                    product['fecha_lanzamiento'] = f"{fecha}-01-01"
                else:
                    product['fecha_lanzamiento'] = self._format_date(fecha)
                break

        # Extraer plataformas
        plataformas_encontradas = set()
        for pattern in self.patterns['plataformas']:
            matches = re.findall(pattern, section, re.IGNORECASE)
            for match in matches:
                if isinstance(match, str):
                    # Dividir por comas, y, etc.
                    plats = re.split(r'[,;y&]|\sand\s', match)
                    for plat in plats:
                        plat = plat.strip()
                        if plat:
                            plataformas_encontradas.add(plat)

        product['plataformas'] = list(plataformas_encontradas)[:10]  # Limitar cantidad

        # Determinar categoría y subcategoría
        product_lower = section.lower()
        if any(word in product_lower for word in ['juego', 'game', 'gaming']):
            product['categoria'] = 'juegos'
            if any(word in product_lower for word in ['xbox one']):
                product['subcategoria'] = 'xboxOne'
            elif any(word in product_lower for word in ['xbox series', 'series x', 'series s']):
                product['subcategoria'] = 'xboxSeries'
            else:
                product['subcategoria'] = 'pc'
        elif any(word in product_lower for word in ['app', 'aplicación', 'software']):
            product['categoria'] = 'aplicaciones'
            if any(word in product_lower for word in ['ios', 'iphone', 'ipad', 'apple']):
                product['subcategoria'] = 'apple'
            else:
                product['subcategoria'] = 'android'
        elif any(word in product_lower for word in ['serie', 'series', 'tv']):
            product['categoria'] = 'seriesTV'
        elif any(word in product_lower for word in ['película', 'movie', 'film']):
            product['categoria'] = 'peliculas'
        elif any(word in product_lower for word in ['anime']):
            product['categoria'] = 'animes'
        elif any(word in product_lower for word in ['animado', 'cartoon', 'animation']):
            product['categoria'] = 'animados'
        elif any(word in product_lower for word in ['telenovela', 'novela']):
            product['categoria'] = 'telenovelas'
        elif any(word in product_lower for word in ['reality', 'show']):
            product['categoria'] = 'realitys'

        # Valores por defecto si no se encontraron
        if not product['pais']:
            product['pais'] = 'No especificado'
        if not product['fecha_lanzamiento']:
            product['fecha_lanzamiento'] = '2024-01-01'
        if not product['descripcion']:
            product['descripcion'] = 'Descripción no disponible'

        return product

    def _format_date(self, date_str: str) -> str:
        """Formatea una fecha al formato YYYY-MM-DD"""
        try:
            # Intentar varios formatos
            formats = ['%d/%m/%Y', '%m/%d/%Y', '%Y/%m/%d', '%d-%m-%Y', '%m-%d-%Y', '%Y-%m-%d']
            for fmt in formats:
                try:
                    date_obj = datetime.strptime(date_str, fmt)
                    return date_obj.strftime('%Y-%m-%d')
                except ValueError:
                    continue
            return '2024-01-01'  # Fecha por defecto
        except:
            return '2024-01-01'

@router.post("/pdf/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        # Validaciones
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF")
        
        if file.size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="El archivo es demasiado grande (máximo 10MB)")

        # Leer el contenido del archivo
        content = await file.read()
        
        # Procesar PDF
        processor = PDFProcessor()
        text = processor.extract_text_from_pdf(content)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No se pudo extraer texto del PDF")

        # Extraer productos
        products = processor.extract_products_from_text(text)
        
        if not products:
            raise HTTPException(status_code=400, detail="No se encontraron productos válidos en el PDF")

        # Filtrar productos válidos
        valid_products = []
        for product in products:
            if product.get('titulo') and len(product['titulo'].strip()) > 2:
                # Agregar imagen por defecto
                product['imagen'] = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
                valid_products.append(product)

        if not valid_products:
            raise HTTPException(status_code=400, detail="No se encontraron productos válidos para procesar")

        return {
            "success": True,
            "message": f"Se extrajeron {len(valid_products)} productos del PDF",
            "products": valid_products,
            "total_text_length": len(text),
            "filename": file.filename
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/pdf/save-products")
async def save_pdf_products(
    products: List[dict],
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        saved_products = []
        
        for product_data in products:
            # Validar datos requeridos
            if not product_data.get('titulo'):
                continue
                
            # Agregar campos adicionales
            product_data['id'] = str(datetime.now().timestamp()).replace('.', '')
            product_data['created_at'] = datetime.utcnow()
            product_data['updated_at'] = datetime.utcnow()
            
            # Insertar en la base de datos
            result = await db.products.insert_one(product_data)
            
            if result.inserted_id:
                saved_products.append(product_data)

        return {
            "success": True,
            "message": f"Se guardaron {len(saved_products)} productos en el catálogo",
            "saved_count": len(saved_products),
            "products": saved_products
        }

    except Exception as e:
        logger.error(f"Error saving PDF products: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al guardar los productos")