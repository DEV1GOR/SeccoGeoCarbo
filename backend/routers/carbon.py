from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas import CarbonEstimateRequest, CarbonEstimateResponse
from backend.services.carbon_service import carbon_service
from backend.services.auth_service import get_current_user 

router = APIRouter()

# --- Rotas ---

@router.post("/estimate", response_model=CarbonEstimateResponse)
def estimate_carbon_stock(
    data: CarbonEstimateRequest, 
    current_user = Depends(get_current_user)
):
    """
    Recebe a área em hectares e retorna a estimativa de carbono (Stub/Mock).
    Requer autenticação.
    """
    try:
        result = carbon_service.estimate(data.area_hectares)
        
        return {
            "estimated_carbon_tons": result,
            "confidence_score": 0.85, # Valor fixo por enquanto
            "message": "Estimativa gerada por algoritmo Stub (Simulação)"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Erro ao estimar carbono: {str(e)}"
        )