from urllib import response
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID

from backend.auth import get_current_user
from backend.database import get_supabase_client
from backend.schemas import PropertyCreate, PropertyUpdate, ResetPasswordRequest, UserLogin

# Cria o cliente supabase
supabase = get_supabase_client()


# Inicializa a aplicação
app = FastAPI(title="SeccoGeoCarbo API")

# Configura CORS (Permite que o Frontend acesse o Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Libera todas as origens (Bloquearemos em produção)
    allow_credentials=True,
    allow_methods=["*"],  # Libera todos os métodos (GET, POST, etc)
    allow_headers=["*"],
)

# --- Rotas ---

# Health Check: Verifica se a API está online
@app.get("/")
def health_check():
    return {
        "status": "ok", 
        "message": "API SeccoGeoCarbo rodando 🚀"
    }

# --- ROTA: LOGIN ---
@app.post("/auth/login")
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
    
# --- ROTA: RESETPASSWORD ---

@app.post("/auth/reset-password")
def reset_password(data: ResetPasswordRequest):
    try:
        supabase.auth.reset_password_email(data.email)
    except Exception:
        pass

    return{
        "message":"Se o email existir, enviaremos um link para redefinição de senha"
    }

# --- ROTA: ME ---

@app.get("/me")
def me(user = Depends(get_current_user)):
    """
    Retorna os dados do usuário atualmente autenticado.

    Esta rota depende da função `get_current_user`, que:
    - Extrai o token JWT do header Authorization
    - Valida o token
    - Identifica o usuário logado

    Se o token for inválido ou inexistente, a requisição é bloqueada.
    """
    return {
        "id": user.id,
        "email": user.email
    }

# --- ROTA: PROPERTIES [CREATE] ---
@app.post("/properties")
def create_property(data: PropertyCreate, user = Depends(get_current_user)):
    """
    Cria uma nova propriedade.

    - Requer autenticação (Bearer Token)
    - Associa automaticamente a propriedade ao usuário logado
    - Salva os dados no Supabase
    """
    property_data = {
        "name": data.name,
        "location": data.location,
        "area_hectares": data.area_hectares,
        "owner_id": user.id
    }

    response = supabase.table("properties").insert(property_data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Erro ao criar propriedade")

    return response.data

# --- ROTA: PROPERTIES [READ] ---
@app.get("/properties")
def list_property(user = Depends(get_current_user)):
    """
    Lista todas as propriedades do usuário autenticado.

    Retorna apenas propriedades cujo owner_id
    corresponde ao usuário logado.
    """
    response = (
        supabase
        .table("properties")
        .select("*")
        .eq("owner_id", user.id)
        .execute()  
    )

    if response.data is None:
        raise HTTPException(status_code=400, detail="Erro em buscar propriedades")
    
    return response.data

# --- ROTA: PROPERTIES [UPDATE]
@app.put("/properties/{property_id}")
def update_property(property_id:UUID, data:PropertyUpdate, user = Depends(get_current_user)):
    """
    Atualiza uma propriedade existente.

    - Apenas o dono da propriedade pode atualizar
    - Campos não enviados não são alterados
    - Requer autenticação
    """
    update_data = {}

    if data.name is not None:
        update_data["name"] = data.name
    if data.location is not None:
        update_data["location"] = data.location
    if data.area_hectares is not None:
        update_data["area_hectares"] = data.area_hectares
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado enviado para atualização")
    
    response = (
        supabase.table("properties")
        .update(update_data)
        .eq("id", property_id)
        .eq("owner_id", user.id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=400, detail='Propriedade não encontrada ou não pertence ao usuário')
    
    return response.data

# --- ROTA: PROPERTIES [DELETE] ---

@app.delete("/properties/{property_id}")
def delete_property(property_id: UUID, user = Depends(get_current_user)):
    """
    Remove uma propriedade do sistema.

    - Apenas o dono da propriedade pode excluir
    - Requer autenticação
    """
    response = (
        supabase
        .table("properties")
        .delete()
        .eq("id",property_id)
        .eq("owner_id",user.id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=400, detail='Propriedade não encontrada ou não pertence ao usuário')
    
    return {
        "message":"Propriedade removida com sucesso"
    }
