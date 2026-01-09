import os
import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN_URL = "https://services.sentinel-hub.com/oauth/token"

def get_sentinel_token():
    client_id = os.getenv("SENTINEL_CLIENT_ID")
    client_secret = os.getenv("SENTINEL_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise Exception("Client ID ou Client Secret não carregados do .env")

    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    response = requests.post(TOKEN_URL, data=payload)
    response.raise_for_status()

    return response.json()["access_token"]