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
    area_hectares: float | None = None

class PropertyUpdate(BaseModel):
    name: Optional[str]
    location: Optional[str] | None = None
    area_hectares: Optional[float] = None

class PropertyResponse(PropertyCreate):
    id: str
    owner_id: str


class UserSign(BaseModel):
    email: str
    password: str
    full_name: str
    
