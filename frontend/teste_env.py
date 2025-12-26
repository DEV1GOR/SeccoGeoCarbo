import os
from dotenv import load_dotenv

print(f"Diretório atual: {os.getcwd()}")

file_path = ".env"

if os.path.exists(file_path):
    print("✅ Arquivo .env encontrado!")
    print("--- CONTEÚDO DO ARQUIVO ---")
    with open(file_path, "r") as f:
        print(f.read())
    print("---------------------------")
    
    load_dotenv()
    url = os.getenv("SUPABASE_URL")
    if url:
        print(f"✅ Variável carregada: {url[:10]}...")
    else:
        print("❌ Variável SUPABASE_URL retornou None.")
else:
    print("❌ Arquivo .env NÃO encontrado. Verifique a extensão.")
    print("Arquivos na pasta:")
    print(os.listdir())