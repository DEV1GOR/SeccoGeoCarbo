from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body, status
from uuid import uuid4
from urllib.parse import urlparse
import requests

from backend.services.auth_service import get_current_user
from backend.services.database_service import get_supabase_client
from backend.services.geometry_service import extract_coords_from_kml, extract_coords_from_geojson

router = APIRouter(prefix="/geometry", tags=["Geometry"])
supabase = get_supabase_client()

BUCKET = "property-files"  

# --- Rotas ---

# --- ROTA: UPLOAD DE ARQUIVO DE GEOMETRIA | [SERGIO] ---
@router.post("/upload-geometry")
async def upload_geometry(file: UploadFile = File(...), user=Depends(get_current_user)):
    """
    Faz upload de KML, GeoJSON e retorna a URL.
    """
    allowed_extensions = ["kml", "geojson"] # Lista de extensões permitidas
    ext = file.filename.split(".")[-1].lower() # Pega a extensão

    if ext not in allowed_extensions: # Verifica se a extensão é válida
        raise HTTPException(status_code=400, detail="Formato inválido. Use .kml ou .geojson")

    new_filename = f"{uuid4()}.{ext}" # Cria um nome único para o arquivo
    file_bytes = await file.read() # Lê o arquivo

    try:
        supabase.storage.from_(BUCKET).upload(new_filename, file_bytes) # Tenta fazer o upload do arquivo
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha ao fazer upload: {str(e)}")
    

    public_url = supabase.storage.from_(BUCKET).get_public_url(new_filename) # Pega a URL Pública do arquivo

    return { # Retorna uma Mensagem, o Nome do Arquivo, a URL e a Extensão
        "message": "Upload OK",
        "filename": new_filename,
        "file_url": public_url,
        "extension": ext,
    }

# --- ROTA: ANALISAR ARQUIVO DE GEOMETRIA | [SERGIO] ---
@router.post("/parse-geometry")
def parse_geometry(file_url: str = Body(..., embed=True), user=Depends(get_current_user)):
    """
    Recebe URL de arquivo no Supabase e extrai coordenadas.
    Suporta KML e GeoJSON.
    """
    path = urlparse(file_url).path # Pega o arquivo do link
    ext = path.split(".")[-1].lower() # Pega a Extensão

    try:
        response = requests.get(file_url) 
        response.raise_for_status()
        file_bytes = response.content
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Não foi possível baixar o arquivo: {str(e)}")

    coords = []

    if ext == "kml":
        coords = extract_coords_from_kml(file_bytes)

    elif ext == "geojson":
        coords = extract_coords_from_geojson(file_bytes)

    else:
        raise HTTPException(status_code=400, detail=f"Formato não suportado: {ext}")

    if not coords:
        raise HTTPException(status_code=400, detail="Não foi possível extrair coordenadas")

    return {
        "message": "Coordenadas extraídas com sucesso",
        "coordinates": coords,
        "total_polygons": len(coords)
    }