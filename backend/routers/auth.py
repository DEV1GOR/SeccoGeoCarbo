from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas import UserLogin, UserSign, ResetPasswordRequest
from backend.services.auth_service import get_current_user
from backend.services.database_service import get_supabase_client


router = APIRouter()
supabase = get_supabase_client()

# --- Rotas ---

# Health Check: Verifica se a API está online
@router.get("/")
def health_check():
    return {
        "status": "ok", 
        "message": "API SeccoGeoCarbo rodando 🚀"
    }

# --- ROTA: SIGN-UP (CRIAÇÃO DE CONTA) ---
@router.post("/signup",status_code=status.HTTP_201_CREATED)
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
@router.post("/login")
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
    
# --- ROTA: RESET PASSWORD [SERGIO] ---

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    try:
        supabase.auth.reset_password_email(data.email)
    except Exception as e:
        print("ERRO SUPABASE:", e)
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Se o email existir, enviaremos um link para redefinição de senha"
    }


