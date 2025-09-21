from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class SiteConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    value: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteConfigCreate(BaseModel):
    key: str
    value: str

class SiteConfigUpdate(BaseModel):
    value: str