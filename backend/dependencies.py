from fastapi import Depends, HTTPException, status
from typing import Annotated
from backend.services.auth_service import get_current_user
from backend.services.database_service import get_supabase_client

class UserType:
    TECNICO = "TECNICO"
    PROPRIETARIO = "PROPRIETARIO"

# ==================== DEPENDÊNCIA PARA OBTER O ROLE ====================
def get_current_user_role(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    
    try:
        user_id = user.id
        
        profile_response = (
            supabase
            .table("profiles")
            .select("*")
            .eq("id", user_id)
            .single()
            .execute()
        )

        if not profile_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil do usuário não encontrado"
            )
        
        #Combinando dados em um dicionário
        user_data = {
            'id': user.id,
            'email': user.email,
            **profile_response.data 
        }
        
        user_with_profile = type('User', (), user_data)()

        return user_with_profile
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Erro ao validar usuário: {str(e)}"
        )

# ==================== DEPENDÊNCIAS DE AUTORIZAÇÃO ====================

def only_technician(user=Depends(get_current_user_role)):
    if not hasattr(user, 'user_type') or user.user_type is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de usuário não definido"
        )
    
    if user.user_type != UserType.TECNICO:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado: apenas técnicos podem acessar este recurso"
        )
    
    return user

def only_owner(user=Depends(get_current_user_role)):
    if not hasattr(user, 'user_type') or user.user_type is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de usuário não definido"
        )
    
    if user.user_type != UserType.PROPRIETARIO:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado: apenas proprietários podem acessar este recurso"
        )

    return user
