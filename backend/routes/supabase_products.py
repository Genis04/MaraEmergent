from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.Product import Product, ProductCreate, ProductUpdate
from database.supabase_client import get_supabase_client
from datetime import datetime
import logging
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/supabase/products", response_model=List[Product])
async def get_products_supabase(
    categoria: Optional[str] = Query(None),
    subcategoria: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    try:
        supabase = get_supabase_client()
        query = supabase.table('products').select('*')
        
        # Aplicar filtros
        if categoria:
            query = query.eq('categoria', categoria)
        if subcategoria:
            query = query.eq('subcategoria', subcategoria)
        if search:
            # Buscar en título, descripción y país
            search_term = f"%{search}%"
            query = query.or_(f'titulo.ilike.{search_term},descripcion.ilike.{search_term},pais.ilike.{search_term}')
        
        # Ordenar por fecha de creación descendente
        query = query.order('created_at', desc=True)
        
        response = query.execute()
        
        # Convertir datos de Supabase al modelo Pydantic
        products = []
        for item in response.data:
            # Convertir el UUID a string para compatibilidad
            item['id'] = str(item['id'])
            # Asegurar que fecha_lanzamiento sea string
            if item.get('fecha_lanzamiento'):
                item['fecha_lanzamiento'] = str(item['fecha_lanzamiento'])
            products.append(Product(**item))
        
        return products
    
    except Exception as e:
        logger.error(f"Error getting products from Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/supabase/products", response_model=Product)
async def create_product_supabase(product_data: ProductCreate):
    try:
        supabase = get_supabase_client()
        
        # Preparar datos para inserción
        insert_data = product_data.dict()
        insert_data['id'] = str(uuid.uuid4())
        insert_data['created_at'] = datetime.utcnow().isoformat()
        insert_data['updated_at'] = datetime.utcnow().isoformat()
        
        response = supabase.table('products').insert(insert_data).execute()
        
        if response.data:
            created_product = response.data[0]
            created_product['id'] = str(created_product['id'])
            if created_product.get('fecha_lanzamiento'):
                created_product['fecha_lanzamiento'] = str(created_product['fecha_lanzamiento'])
            return Product(**created_product)
        else:
            raise HTTPException(status_code=500, detail="Error al crear el producto")
    
    except Exception as e:
        logger.error(f"Error creating product in Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.put("/supabase/products/{product_id}", response_model=Product)
async def update_product_supabase(product_id: str, product_data: ProductUpdate):
    try:
        supabase = get_supabase_client()
        
        # Preparar datos de actualización
        update_data = {k: v for k, v in product_data.dict().items() if v is not None}
        update_data['updated_at'] = datetime.utcnow().isoformat()
        
        response = supabase.table('products').update(update_data).eq('id', product_id).execute()
        
        if response.data:
            updated_product = response.data[0]
            updated_product['id'] = str(updated_product['id'])
            if updated_product.get('fecha_lanzamiento'):
                updated_product['fecha_lanzamiento'] = str(updated_product['fecha_lanzamiento'])
            return Product(**updated_product)
        else:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    except Exception as e:
        logger.error(f"Error updating product in Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.delete("/supabase/products/{product_id}")
async def delete_product_supabase(product_id: str):
    try:
        supabase = get_supabase_client()
        
        response = supabase.table('products').delete().eq('id', product_id).execute()
        
        if response.data:
            return {"message": "Producto eliminado exitosamente"}
        else:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    except Exception as e:
        logger.error(f"Error deleting product in Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/supabase/products/bulk")
async def create_bulk_products_supabase(products: List[ProductCreate]):
    try:
        supabase = get_supabase_client()
        
        # Preparar datos para inserción masiva
        insert_data = []
        for product_data in products:
            data = product_data.dict()
            data['id'] = str(uuid.uuid4())
            data['created_at'] = datetime.utcnow().isoformat()
            data['updated_at'] = datetime.utcnow().isoformat()
            insert_data.append(data)
        
        response = supabase.table('products').insert(insert_data).execute()
        
        if response.data:
            created_products = []
            for item in response.data:
                item['id'] = str(item['id'])
                if item.get('fecha_lanzamiento'):
                    item['fecha_lanzamiento'] = str(item['fecha_lanzamiento'])
                created_products.append(Product(**item))
            
            return {
                "message": f"Se crearon {len(created_products)} productos exitosamente",
                "products": created_products,
                "count": len(created_products)
            }
        else:
            raise HTTPException(status_code=500, detail="Error al crear los productos")
    
    except Exception as e:
        logger.error(f"Error creating bulk products in Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")