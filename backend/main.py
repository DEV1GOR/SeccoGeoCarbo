from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID, uuid4

from backend.auth import get_current_user
from backend.database import get_supabase_client
from backend.schemas import PropertyCreate, PropertyUpdate, ResetPasswordRequest, UserLogin, UserSign

import requests
from fastapi import Body
from urllib.parse import urlparse
import time

from backend.geometry_service import extract_coords_from_kml, extract_coords_from_geojson


# Cria o cliente supabase
supabase = get_supabase_client()
BUCKET = "property-files"

# Inicializa a aplicação
app = FastAPI(title="SeccoGeoCarbo API")

API_PREFIX = "/api" # USE COMO PREFIXO PARA PADRONIZAR AS ROTAS


# --- CONFIGURAÇÃO DO CORS (CORRIGIDO) ---
origins = [
    "http://localhost:5173",      # Vite Local
    "http://127.0.0.1:5173",      # Vite Local (IP)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # Permite apenas o Frontend conhecido
    allow_credentials=True,    # Permite cookies e headers de auth
    allow_methods=["*"],       # Libera todos os métodos (GET, POST, etc)
    allow_headers=["*"],       # Libera todos os headers
)


# --- Rotas ---

# Health Check: Verifica se a API está online
@app.get("/")
def health_check():
    return {
        "status": "ok", 
        "message": "API SeccoGeoCarbo rodando 🚀"
    }

# --- ROTA: SIGN-UP (CRIAÇÃO DE CONTA) ---
@app.post(f"{API_PREFIX}/auth/signup")
def signup(user: UserSign):
    try:
        #Query para validar a existencia do email cadastrado
        existing_user = supabase.table("profiles").select("email").eq("email", user.email.lower()).execute()
            
        #Chamando o método para criar o user no SupaBase
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        
        #Se criar corretamente, retorna o 201 (Created)
        return {
            "message": "Usuário criado com sucesso!",
            "user": {
                "email": user.email,
                "full_name": user.full_name
            }
        }
        
    except Exception as e: 
        #Printando o erro completo para ver o que ele retorna
        print(f"Erro completo: {e}")

        #Se o email já estiver cadastrado
        if existing_user.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )

        #Se for 429 (Too Many Requests)
        if "security" in str(e).lower() and "seconds" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Você excedeu o limite de requisições. Tente novamente em alguns segundos."
            )
        
        #Caso seja outro erro, retoanr uma resposta genérica
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ERRO REAL: {str(e)}"
        )

# --- ROTA: LOGIN ---
@app.post(f"{API_PREFIX}/auth/login")
def login(user: UserLogin):
    try:
        # Tenta fazer login com email e senha no Supabase
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        
        # Se der certo, retorna o Token e os dados do usuário
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }

    except Exception as e:
        # Se der erro (senha errada, usuário não existe), retorna 401
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
# --- ROTA: RESET PASSWORD ---

@app.post(f"{API_PREFIX}/auth/reset-password")
def reset_password(data: ResetPasswordRequest):
    try:
        supabase.auth.reset_password_email(data.email)
    except Exception as e:
        print("ERRO SUPABASE:", e)
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Se o email existir, enviaremos um link para redefinição de senha"
    }


# --- ROTA: ME ---

@app.get(f"{API_PREFIX}/me")
def me(user = Depends(get_current_user)):
    """
    Retorna os dados do usuário atualmente autenticado.
    """
    return {
        "id": user.id,
        "email": user.email
    }

# --- ROTA: PROPERTIES [CREATE] ---
@app.post(f"{API_PREFIX}/properties")
def create_property(data: PropertyCreate, user = Depends(get_current_user)):
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

# --- ROTA: PROPERTIES [READ] ---
@app.get(f"{API_PREFIX}/properties")
def list_property(user = Depends(get_current_user)):
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
        raise HTTPException(status_code=400, detail="Erro em buscar propriedades")
    
    return response.data

# --- ROTA: PROPERTIES [UPDATE]
@app.put(f"{API_PREFIX}/properties/{{property_id}}")
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
        raise HTTPException(status_code=400, detail='Propriedade não encontrada ou não pertence ao usuário')
    
    return response.data

# --- ROTA: PROPERTIES [DELETE] ---

@app.delete(f"{API_PREFIX}/properties/{{property_id}}")
def delete_property(property_id: UUID, user = Depends(get_current_user)):
    """
    Remove uma propriedade do sistema.
    """
    response = (
        supabase
        .table("properties")
        .delete()
        .eq("id",str(property_id))
        .eq("owner_id",str(user.id))
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=400, detail='Propriedade não encontrada ou não pertence ao usuário')
    
    return {
        "message":"Propriedade removida com sucesso"
    }

# --- ROTA: VERIFICAÇÃO DE USUÁRIO (Checklist) ---
@app.get(f"{API_PREFIX}/users/me")
def check_user_exists(user = Depends(get_current_user)):
    """
    Checklist Backend:
    Valida se o usuário existe na tabela 'profiles'.
    """
    try:
        # O ID do usuário vem do token validado pelo get_current_user
        user_id = user.id
        
        # Nome da tabela personalizada onde os dados extras do usuário estão armazenados
        tabela_banco = "profiles" 

        # Consulta no banco se existe um registro com esse ID
        response = (
            supabase.table(tabela_banco)
            .select("*")
            .eq("id", str(user_id)) 
            .execute()
        )

        # Se a lista retornada for vazia, o usuário não existe na tabela personalizada
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado na base de dados"
            )

        # Se encontrou, retorna 200 com os dados
        return {
            "id": user_id,
            "email": user.email,
            "db_data": response.data[0] # Retorna os dados extras da tabela
        }

    except Exception as e:
        # Se já for um erro HTTP (ex: 404), relança ele
        if isinstance(e, HTTPException):
            raise e
            
        print(f"Erro ao verificar usuário: {e}")
        raise

# --- ROTA: UPLOAD DE ARQUIVO DE GEOMETRIA [SERGIO] ---
@app.post(f"{API_PREFIX}/upload-geometry")
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

# --- ROTA: ANALISAR ARQUIVO DE GEOMETRIA [SERGIO] ---
@app.post(f"{API_PREFIX}/parse-geometry")
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