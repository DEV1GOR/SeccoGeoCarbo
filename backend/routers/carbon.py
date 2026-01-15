from fastapi import APIRouter, Depends, HTTPException, status
from backend.schemas import CarbonEstimateRequest, CarbonEstimateResponse
from backend.services.carbon_service import carbon_service
from backend.services.auth_service import get_current_user 
from backend.dependencies import only_technician
from shapely.geometry import shape

router = APIRouter()

# --- Rotas ---


@router.post("/carbon/estimate", response_model=CarbonEstimateResponse)
def estimate_carbon(data: CarbonEstimateRequest, user = Depends(get_current_user)):
    """
    Realiza a estimativa de carbono para uma área geográfica.

    O fluxo do processamento inclui:
    - Download da imagem Sentinel correspondente à geometria informada
    - Cálculo de índices de vegetação (NDVI ou SAVI)
    - Estimativa de biomassa acima do solo (AGB) para o bioma Caatinga
    - Conversão de biomassa em estoque de carbono (tC)
    - Geração de mapa de calor (heatmap) do carbono estimado
    - Retorno dos resultados em formato JSON

    Parâmetros:
        data (CarbonEstimateRequest):
            Objeto contendo:
            - geometry (GeoJSON): área de interesse
            - index_type (str): índice de vegetação a ser utilizado ("ndvi" ou "savi")
        user:
            Usuário autenticado obtido via dependência de autenticação.

    Retorno:
        CarbonEstimateResponse:
            - total_carbon_tons (float): estoque total de carbono (tC)
            - carbon_per_hectare (float): carbono estimado por hectare (tC/ha)
            - ndvi_mean (float): valor médio do NDVI
            - savi_mean (float): valor médio do SAVI
            - heatmap_url (str): URL do mapa de calor gerado
            - units (dict): unidades dos valores retornados
    """
    result = carbon_service.process_carbon_estimation(
        geometry=data.geometry,
        index_type=data.index_type
    )

    return result
