import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# --- CONFIGURAÇÃO DE AMBIENTE ---
current_file = Path(__file__).resolve()

# Sobe até a raiz do projeto (SeccoGeoCarbo)
project_root = current_file.parents[2]

env_path = project_root / ".env"
load_dotenv(env_path)

# --- INICIALIZAÇÃO DO CLIENTE ---
def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError(
            f"Erro: SUPABASE_URL e SUPABASE_KEY não encontrados. "
            f"Env path usado: {env_path}"
        )

    return create_client(url, key)
