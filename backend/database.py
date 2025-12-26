import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# --- CONFIGURAÇÃO DE AMBIENTE ---
# Garante que o .env seja lido da raiz, não importa de onde o comando é rodado
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent
env_path = project_root / ".env"
load_dotenv(dotenv_path=env_path)

# --- INICIALIZAÇÃO DO CLIENTE ---
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    if not url or not key:
        raise ValueError("Erro: SUPABASE_URL e SUPABASE_KEY não encontrados. Verifique o arquivo .env na raiz.")
    return create_client(url, key)