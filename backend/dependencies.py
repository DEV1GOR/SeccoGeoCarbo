"""
backend/dependencies.py
Sistema de autorização por user_type integrado com a estrutura existente
"""

from fastapi import Depends, HTTPException, status
from typing import Annotated
from backend.services.auth_service import get_current_user

class UserType:
    TECNICO = "TECNICO"
    PROPRIETARIO = "PROPRIETARIO"


# ==================== DEPENDÊNCIA PARA OBTER O ROLE ====================

def get_current_user_role(user=Depends(get_current_user)) -> str:

    if not hasattr(user, 'user_type') or user.user_type is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de usuário não definido"
        )
    
    return user.user_type


# ==================== DEPENDÊNCIAS DE AUTORIZAÇÃO ====================

def only_technician(user=Depends(get_current_user)):
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
