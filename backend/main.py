from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from backend.database import get_supabase_client
from backend.schemas import ResetPasswordRequest, UserLogin, UserSign

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

# --- ROTA: SIGN-UP (CRIAÇÃO DE CONTA) ---
@app.post("/auth/signup")
def signup(user: UserSign):
    try:
        #Query para validar a existencia do email cadastrado
        existing_user = supabase.table("profiles").select("email").eq("email", user.email.lower()).execute()
        #print(existing_user)
            
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
        #print(f"Erro completo: {e}")

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
            detail="Erro ao criar o usuário"
        )

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
    
