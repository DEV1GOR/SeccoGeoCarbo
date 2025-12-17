from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.database import get_supabase_client
from backend.schemas import ResetPasswordRequest, UserLogin 

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