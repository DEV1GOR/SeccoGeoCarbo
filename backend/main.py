from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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