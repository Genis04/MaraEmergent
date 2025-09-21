from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titulo: str
    descripcion: str
    imagen: str
    pais: str
    fecha_lanzamiento: str
    plataformas: Optional[List[str]] = []
    categoria: str
    subcategoria: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    titulo: str
    descripcion: str
    imagen: str
    pais: str
    fecha_lanzamiento: str
    plataformas: Optional[List[str]] = []
    categoria: str
    subcategoria: Optional[str] = None

class ProductUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    imagen: Optional[str] = None
    pais: Optional[str] = None
    fecha_lanzamiento: Optional[str] = None
    plataformas: Optional[List[str]] = None
    categoria: Optional[str] = None
    subcategoria: Optional[str] = None