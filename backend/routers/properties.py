from fastapi import APIRouter, Depends, HTTPException, Response
from uuid import UUID
from jinja2 import Environment, FileSystemLoader
from io import BytesIO
from weasyprint import HTML, CSS
from io import BytesIO

from backend.schemas import PropertyCreate, PropertyUpdate
from backend.services.database_service import get_supabase_client
from backend.dependencies import only_technician, only_owner

router = APIRouter()
supabase = get_supabase_client()

env = Environment(loader=FileSystemLoader("templates"))

# --- Rotas ---

# --- ROTA: PROPERTIES [CREATE] | [SERGIO] ---
@router.post("/")
def create_property(data: PropertyCreate, user=Depends(only_owner)):
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
def list_property(user=Depends(only_owner)):
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
def update_property(property_id: UUID, data: PropertyUpdate, user=Depends(only_owner)):
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
def delete_property(property_id: UUID, user=Depends(only_owner)):
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

# --- ROTA: PROPERTIES [REPORT] | [LEMOS] ---
@router.get("/{property_id}/report")
def generate_property_report(property_id: UUID, user=Depends(only_technician)):
    """
    Gera um relatório detalhado da propriedade em PDF usando WeasyPrint.
    """
    #Buscando informações da propriedade
    response = (
        supabase
        .table("properties")
        .select("*")
        .eq("id", str(property_id))
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Propriedade não encontrada")

    property_info = response.data[0]
    
    report_data = {
        "property": {
            "name": property_info.get("name"),
            "location": property_info.get("location"),
            "total_area_ha": property_info.get("total_area_ha"),
            "car_code": property_info.get("car_code"),
            "city": property_info.get("city"),
            "state": property_info.get("state")
        }
    }

    #Renderizando o template HTML
    try:
        template = env.get_template("property_report.html")
        html_content = template.render(**report_data)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao renderizar template: {str(e)}"
        )

    #Gerando o PDF com WeasyPrint
    try:
        pdf_buffer = BytesIO()
        
        HTML(string=html_content).write_pdf(pdf_buffer)
        
        pdf_content = pdf_buffer.getvalue()
        pdf_buffer.close()
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao gerar PDF: {str(e)}"
        )

    # Prepare o nome do arquivo
    filename = f"relatorio_{property_info.get('name', 'propriedade').replace(' ', '_')}.pdf"
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )