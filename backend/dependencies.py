"""
backend/dependencies.py
Sistema de autorização por user_type integrado com a estrutura existente
"""

from fastapi import Depends, HTTPException, status
from typing import Annotated

# Importar sua função existente de autenticação
from backend.services.auth_service import get_current_user

# Constantes para tipos de usuário
class UserType:
    TECNICO = "TECNICO"
    PROPRIETARIO = "PROPRIETARIO"


# ==================== DEPENDÊNCIA PARA OBTER O ROLE ====================

def get_current_user_role(user=Depends(get_current_user)) -> str:
    """
    Retorna o tipo de usuário (user_type) do usuário autenticado.
    
    Args:
        user: Usuário autenticado obtido via get_current_user
        
    Returns:
        str: O user_type ('TECNICO' ou 'PROPRIETARIO')
        
    Raises:
        HTTPException 404: Se o user_type não existir
    """
    if not hasattr(user, 'user_type') or user.user_type is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de usuário não definido"
        )
    
    return user.user_type


# ==================== DEPENDÊNCIAS DE AUTORIZAÇÃO ====================

def only_technician(user=Depends(get_current_user)):
    """
    Dependência que garante que apenas usuários do tipo TECNICO podem acessar a rota.
    
    Args:
        user: Usuário autenticado
        
    Returns:
        user: O usuário autenticado se for técnico
        
    Raises:
        HTTPException 403: Se o usuário não for um técnico
        HTTPException 404: Se o user_type não existir
    
    Usage:
        @router.get("/rota-exclusiva")
        def rota_tecnico(user=Depends(only_technician)):
            return {"message": "Acesso permitido para técnico"}
    """
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


def only_owner(user=Depends(get_current_user)):
    """
    Dependência que garante que apenas usuários do tipo PROPRIETARIO podem acessar a rota.
    
    Args:
        user: Usuário autenticado
        
    Returns:
        user: O usuário autenticado se for proprietário
        
    Raises:
        HTTPException 403: Se o usuário não for um proprietário
        HTTPException 404: Se o user_type não existir
    
    Usage:
        @router.post("/propriedades")
        def criar_propriedade(user=Depends(only_owner)):
            return {"message": "Propriedade criada"}
    """
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


# ==================== TYPE HINTS PARA FACILITAR USO (OPCIONAL) ====================

# Type hints para uso mais limpo nas rotas
# Exemplo: def rota(user: TechnicianUser):
TechnicianUser = Annotated[object, Depends(only_technician)]
OwnerUser = Annotated[object, Depends(only_owner)]
CurrentUser = Annotated[object, Depends(get_current_user)]
CurrentUserRole = Annotated[str, Depends(get_current_user_role)]