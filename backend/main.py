from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importação das rotas
from backend.routers import auth, users, properties, geometry, carbon

#carregamento do .env
from dotenv import load_dotenv
load_dotenv()

# Inicializa a aplicação FastAPI
app = FastAPI(title="SeccoGeoCarbo API")

# Prefixo padrão da API
API_PREFIX = "/api"

# --- CONFIGURAÇÃO DO CORS ---
# Permite requisições apenas do frontend autorizado
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROTA: HEALTH CHECK ---
# Verifica se a API está online
# URL Final: /
@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "API SeccoGeoCarbo rodando 🚀"
    }

# --- ROTA: AUTH ---
# Adiciona as rotas de autenticação (login, signup, reset, me)
# URL Final: /api/auth/*
app.include_router(
    auth.router,
    prefix=f"{API_PREFIX}/auth",
    tags=["Auth"]
)

# --- ROTA: USERS ---
# Adiciona as rotas relacionadas aos dados do usuário autenticado
# URL Final: /api/users/*
app.include_router(
    users.router,
    prefix=f"{API_PREFIX}/users",
    tags=["Users"]
)

# --- ROTA: PROPERTIES ---
# Adiciona as rotas de CRUD de propriedades rurais
# URL Final: /api/properties/*
app.include_router(
    properties.router,
    prefix=f"{API_PREFIX}/properties",
    tags=["Properties"]
)

# --- ROTA: GEOMETRY ---
# Adiciona as rotas de upload e processamento de arquivos geoespaciais
# URL Final: /api/geometry/*
app.include_router(
    geometry.router,
    prefix=f"{API_PREFIX}/geometry",
    tags=["Geometry"]
)

# --- ROTA: CARBON AI (STUB) ---
# Adiciona as rotas definidas em backend/routers/carbon.py
# URL Final: /api/carbon/*
app.include_router(
    carbon.router,
    prefix=f"{API_PREFIX}/carbon",
    tags=["Carbon AI"]
)
