from pydantic import BaseModel
from typing import Optional

class UserLogin(BaseModel):
    email: str
    password: str

class ResetPasswordRequest(BaseModel):
    email: str

class PropertyCreate(BaseModel):
    name: str
    location: str | None = None
    total_area_ha: float | None = None
    car_code: str | None = None
    city: str | None = None
    state: str | None = None

class PropertyUpdate(BaseModel):
    name: Optional[str]
    location: Optional[str] | None = None
    total_area_ha: float | None = None
    car_code: str | None = None
    city: str | None = None
    state: str | None = None

class PropertyResponse(PropertyCreate):
    id: str
    owner_id: str


class UserSign(BaseModel):
    email: str
    password: str
    full_name: str
    
# --- SCHEMAS PARA O MOTOR DE CARBONO ---

class CarbonEstimateRequest(BaseModel):
    area_hectares: float
    # No futuro, podemos adicionar o GeoJSON aqui:
    # geojson: dict | None = None 

class CarbonEstimateResponse(BaseModel):
    estimated_carbon_tons: float
    confidence_score: float
    message: str
    