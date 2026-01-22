from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas import CarbonEstimateRequest, CarbonEstimateResponse
from backend.services.carbon_service import carbon_service
from backend.services.auth_service import get_current_user 
from backend.tasks.carbon_task import calculate_carbon_stock_task
from celery.result import AsyncResult
from backend.celery_app import celery_app

router = APIRouter()

# --- Rotas ---


# ROTA: Processamento de estimativa de carbono | [SERGIO]
@router.post("/carbon/estimate")
def estimate_carbon(
    data: CarbonEstimateRequest,
    user=Depends(get_current_user)
):
    """
    Esta rota NÃO executa o cálculo diretamente.
    Ela apenas envia a tarefa para o Celery (fila Redis)
    e retorna imediatamente um ID de tarefa para o frontend.

    Fluxo:
    1. Recebe a geometria e o tipo de índice (NDVI/SAVI)
    2. Enfileira a task no Celery
    3. Retorna o task_id para acompanhamento do status
    """

    # Envia a tarefa para execução em background (Celery + Redis)
    task = calculate_carbon_stock_task.delay(
        geometry=data.geometry,
        index_type=data.index_type
    )

    # Resposta imediata para o frontend (não bloqueante)
    return {
        "task_id": task.id,
        "status": "PENDING"
    }

# ROTA: Consulta o STATUS da tarefa assíncrona de estimativa de carbono. | [SERGIO]

@router.get("/estimate/status/{task_id}")
def get_task_status(task_id: str):
    """
    Possíveis estados:
    - PENDING: aguardando execução
    - STARTED / PROCESSING: em execução
    - SUCCESS: finalizada com sucesso
    - FAILURE: erro durante o processamento
    """

    # Recupera o estado atual da task pelo ID
    task = AsyncResult(task_id, app=celery_app)

    return {
        "task_id": task_id,
        "status": task.state,
        # Retorna o resultado apenas quando a task finaliza
        "result": task.result if task.state == "SUCCESS" else None
    }
