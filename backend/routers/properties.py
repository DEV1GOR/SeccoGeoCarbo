from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from backend.schemas import PropertyCreate, PropertyUpdate
from backend.services.database_service import get_supabase_client
from backend.services.auth_service import get_current_user

router = APIRouter()
supabase = get_supabase_client()

# --- Rotas ---

# --- ROTA: PROPERTIES [CREATE] | [SERGIO] ---
@router.post("/")
def create_property(data: PropertyCreate, user=Depends(get_current_user)):
    """
    Cria uma nova propriedade.
    """
    property_data = {
        "name": data.name,
        "location": data.location,
        "total_area_ha": data.total_area_ha,
        "car_code": data.car_code,
        "city": data.city,
        "state": data.state,
        "owner_id": user.id
    }

    response = supabase.table("properties").insert(property_data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Erro ao criar propriedade")

    return response.data

# --- ROTA: PROPERTIES [READ] | [SERGIO] ---
@router.get("/")
def list_property(user=Depends(get_current_user)):
    """
    Lista todas as propriedades do usuário autenticado.
    """
    response = (
        supabase
        .table("properties")
        .select("*")
        .eq("owner_id", str(user.id))
        .execute()
    )

    if response.data is None:
        raise HTTPException(status_code=400, detail="Erro ao buscar propriedades")

    return response.data

# --- ROTA: PROPERTIES [UPDATE] | [SERGIO] ---
@router.put("/{property_id}")
def update_property(property_id: UUID, data: PropertyUpdate, user=Depends(get_current_user)):
    """
    Atualiza uma propriedade existente.
    """
    update_data = {}

    if data.name is not None:
        update_data["name"] = data.name
    if data.location is not None:
        update_data["location"] = data.location
    if data.total_area_ha is not None:
        update_data["total_area_ha"] = data.total_area_ha
    if data.car_code is not None:
        update_data["car_code"] = data.car_code
    if data.city is not None:
        update_data["city"] = data.city
    if data.state is not None:
        update_data["state"] = data.state

    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado enviado para atualização")

    response = (
        supabase.table("properties")
        .update(update_data)
        .eq("id", str(property_id))
        .eq("owner_id", str(user.id))
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=400, detail="Propriedade não encontrada ou não pertence ao usuário")

    return response.data

# --- ROTA: PROPERTIES [DELETE] | [SERGIO] ---
@router.delete("/{property_id}")
def delete_property(property_id: UUID, user=Depends(get_current_user)):
    """
    Remove uma propriedade do sistema.
    """
    response = (
        supabase
        .table("properties")
        .delete()
        .eq("id", str(property_id))
        .eq("owner_id", str(user.id))
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=400, detail="Propriedade não encontrada ou não pertence ao usuário")

    return {"message": "Propriedade removida com sucesso"}
