from fastapi import APIRouter, HTTPException
from models.SiteConfig import SiteConfig, SiteConfigCreate, SiteConfigUpdate
import os
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Importar la base de datos desde el módulo principal
from server import db

@router.get("/config/{key}")
async def get_config(key: str):
    try:
        config = await db.site_config.find_one({"key": key})
        if config:
            return {"key": config["key"], "value": config["value"]}
        else:
            return {"key": key, "value": ""}
    
    except Exception as e:
        logger.error(f"Error getting config: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/config", response_model=SiteConfig)
async def update_config(config_data: SiteConfigCreate):
    try:
        # Verificar si ya existe la configuración
        existing_config = await db.site_config.find_one({"key": config_data.key})
        
        if existing_config:
            # Actualizar configuración existente
            update_data = {
                "value": config_data.value,
                "updated_at": datetime.utcnow()
            }
            
            result = await db.site_config.update_one(
                {"key": config_data.key},
                {"$set": update_data}
            )
            
            if result.modified_count:
                updated_config = await db.site_config.find_one({"key": config_data.key})
                return SiteConfig(**updated_config)
            else:
                raise HTTPException(status_code=500, detail="Error al actualizar la configuración")
        
        else:
            # Crear nueva configuración
            config_obj = SiteConfig(**config_data.dict())
            result = await db.site_config.insert_one(config_obj.dict())
            
            if result.inserted_id:
                return config_obj
            else:
                raise HTTPException(status_code=500, detail="Error al crear la configuración")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating config: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")