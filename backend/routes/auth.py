from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Contraseña temporal para desarrollo
ADMIN_PASSWORD = "admin123"

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str

@router.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    try:
        if login_data.password == ADMIN_PASSWORD:
            return LoginResponse(success=True, message="Autenticación exitosa")
        else:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in authentication: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")