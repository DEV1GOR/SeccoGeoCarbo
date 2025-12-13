import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Pega a URL e a key do .env 
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Função para conectar ao supabase
def get_supabase_client() -> Client:
    if not url or not key:
        raise ValueError("Erro: SUPABASE_URL e SUPABASE_KEY precisam estar no arquivo .env")
    return create_client(url, key)

if __name__ == "__main__":
    try:
        supabase = get_supabase_client()
        print("Conexão inicializada com sucesso!")
        
        response = supabase.table("profiles").select("*").execute()
        
        print(f"Dados recebidos: {response.data}")
        print("Integração concluída!")
        
    except Exception as e:
        print(f"Erro ao conectar: {e}")