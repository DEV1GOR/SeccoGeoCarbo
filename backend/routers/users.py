from fastapi import APIRouter, Depends, HTTPException, status
from backend.services.auth_service import get_current_user
from backend.services.database_service import get_supabase_client

router = APIRouter()
supabase = get_supabase_client()

# --- Rotas ---

# --- ROTA: ME ---
@router.get("/me")
def me(user = Depends(get_current_user)):
    """
    Retorna os dados do usuário atualmente autenticado.
    """
    return {
        "id": user.id,
        "email": user.email
    }

# --- ROTA: VERIFICAÇÃO DE USUÁRIO (Checklist) ---
@router.get("/me/check")
def check_user_exists(user = Depends(get_current_user)):
    """
    Checklist Backend:
    Valida se o usuário existe na tabela 'profiles'.
    """
    try:
        user_id = user.id

        response = (
            supabase.table("profiles")
            .select("*")
            .eq("id", str(user_id))
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado na base de dados"
            )

        return {
            "id": user_id,
            "email": user.email,
            "db_data": response.data[0]
        }

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e

        print(f"Erro ao verificar usuário: {e}")
        raise
