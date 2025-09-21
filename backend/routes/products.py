from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.Product import Product, ProductCreate, ProductUpdate
import os
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Función para obtener la base de datos (se pasará desde server.py)
def get_db():
    from server import db
    return db

@router.get("/products", response_model=List[Product])
async def get_products(
    categoria: Optional[str] = Query(None),
    subcategoria: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    try:
        db = get_db()
        # Construir filtros
        filters = {}
        if categoria:
            filters["categoria"] = categoria
        if subcategoria:
            filters["subcategoria"] = subcategoria
        
        # Búsqueda por texto
        if search:
            search_regex = {"$regex": search, "$options": "i"}
            filters["$or"] = [
                {"titulo": search_regex},
                {"descripcion": search_regex},
                {"pais": search_regex},
                {"plataformas": {"$in": [search_regex]}}
            ]
        
        products = await db.products.find(filters).to_list(1000)
        return [Product(**product) for product in products]
    
    except Exception as e:
        logger.error(f"Error getting products: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate):
    try:
        db = get_db()
        product_dict = product_data.dict()
        product_obj = Product(**product_dict)
        
        # Insertar en MongoDB
        result = await db.products.insert_one(product_obj.dict())
        
        if result.inserted_id:
            return product_obj
        else:
            raise HTTPException(status_code=500, detail="Error al crear el producto")
    
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate):
    try:
        db = get_db()
        # Verificar que el producto existe
        existing_product = await db.products.find_one({"id": product_id})
        if not existing_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        # Preparar datos de actualización
        update_data = {k: v for k, v in product_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        # Actualizar en MongoDB
        result = await db.products.update_one(
            {"id": product_id},
            {"$set": update_data}
        )
        
        if result.modified_count:
            # Obtener producto actualizado
            updated_product = await db.products.find_one({"id": product_id})
            return Product(**updated_product)
        else:
            raise HTTPException(status_code=500, detail="Error al actualizar el producto")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    try:
        db = get_db()
        # Verificar que el producto existe
        existing_product = await db.products.find_one({"id": product_id})
        if not existing_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        # Eliminar de MongoDB
        result = await db.products.delete_one({"id": product_id})
        
        if result.deleted_count:
            return {"message": "Producto eliminado exitosamente"}
        else:
            raise HTTPException(status_code=500, detail="Error al eliminar el producto")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")