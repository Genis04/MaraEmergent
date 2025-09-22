from fastapi import APIRouter, HTTPException
from models.SiteConfig import SiteConfig, SiteConfigCreate
from database.supabase_client import get_supabase_client
from datetime import datetime
import logging
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/supabase/config/{key}")
async def get_config_supabase(key: str):
    try:
        supabase = get_supabase_client()
        
        response = supabase.table('site_config').select('*').eq('key', key).execute()
        
        if response.data:
            config = response.data[0]
            return {"key": config["key"], "value": config["value"]}
        else:
            return {"key": key, "value": ""}
    
    except Exception as e:
        logger.error(f"Error getting config from Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/supabase/config", response_model=SiteConfig)
async def update_config_supabase(config_data: SiteConfigCreate):
    try:
        supabase = get_supabase_client()
        
        # Verificar si ya existe la configuración
        existing_response = supabase.table('site_config').select('*').eq('key', config_data.key).execute()
        
        if existing_response.data:
            # Actualizar configuración existente
            update_data = {
                "value": config_data.value,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            response = supabase.table('site_config').update(update_data).eq('key', config_data.key).execute()
            
            if response.data:
                updated_config = response.data[0]
                updated_config['id'] = str(updated_config['id'])
                return SiteConfig(**updated_config)
            else:
                raise HTTPException(status_code=500, detail="Error al actualizar la configuración")
        
        else:
            # Crear nueva configuración
            insert_data = config_data.dict()
            insert_data['id'] = str(uuid.uuid4())
            insert_data['updated_at'] = datetime.utcnow().isoformat()
            
            response = supabase.table('site_config').insert(insert_data).execute()
            
            if response.data:
                created_config = response.data[0]
                created_config['id'] = str(created_config['id'])
                return SiteConfig(**created_config)
            else:
                raise HTTPException(status_code=500, detail="Error al crear la configuración")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating config in Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/supabase/social-networks")
async def get_social_networks_supabase():
    try:
        supabase = get_supabase_client()
        
        response = supabase.table('social_networks').select('*').eq('is_active', True).execute()
        
        return response.data
    
    except Exception as e:
        logger.error(f"Error getting social networks from Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/supabase/social-networks")
async def update_social_networks_supabase(social_networks: list):
    try:
        supabase = get_supabase_client()
        
        # Desactivar todas las redes sociales existentes
        supabase.table('social_networks').update({'is_active': False}).execute()
        
        # Insertar/actualizar las nuevas redes sociales
        for network in social_networks:
            if network.get('url'):  # Solo si tiene URL
                # Verificar si ya existe
                existing = supabase.table('social_networks').select('*').eq('name', network['name']).execute()
                
                if existing.data:
                    # Actualizar existente
                    supabase.table('social_networks').update({
                        'url': network['url'],
                        'is_active': True
                    }).eq('name', network['name']).execute()
                else:
                    # Crear nuevo
                    supabase.table('social_networks').insert({
                        'id': str(uuid.uuid4()),
                        'name': network['name'],
                        'url': network['url'],
                        'icon': network.get('icon', network['name']),
                        'is_active': True,
                        'created_at': datetime.utcnow().isoformat()
                    }).execute()
        
        return {"message": "Redes sociales actualizadas exitosamente"}
    
    except Exception as e:
        logger.error(f"Error updating social networks in Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/supabase/business-groups")
async def get_business_groups_supabase():
    try:
        supabase = get_supabase_client()
        
        response = supabase.table('business_groups').select('*').eq('is_active', True).execute()
        
        return response.data
    
    except Exception as e:
        logger.error(f"Error getting business groups from Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/supabase/business-groups")
async def update_business_groups_supabase(business_groups: list):
    try:
        supabase = get_supabase_client()
        
        # Desactivar todos los grupos existentes
        supabase.table('business_groups').update({'is_active': False}).execute()
        
        # Insertar los nuevos grupos
        for group in business_groups:
            if group.get('name'):  # Solo si tiene nombre
                supabase.table('business_groups').insert({
                    'id': str(uuid.uuid4()),
                    'name': group['name'],
                    'description': group.get('description', ''),
                    'link': group.get('link', ''),
                    'is_active': True,
                    'created_at': datetime.utcnow().isoformat()
                }).execute()
        
        return {"message": "Grupos de negocio actualizados exitosamente"}
    
    except Exception as e:
        logger.error(f"Error updating business groups in Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")