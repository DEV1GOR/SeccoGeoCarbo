# Serviços responsável por processar imagens do SENTINEL
import rasterio
import numpy as np
from backend.services.sentinel.process import get_latest_sentinel_image
from backend.services.sentinel.visualization import generate_carbon_heatmap
from backend.services.sentinel.process import save_carbon_estimation
from datetime import datetime

# [SERGIO]
def process_carbon_estimation(geometry: dict, index_type="savi"):

    # 1. Baixa imagem
    tiff_path = get_latest_sentinel_image(geometry)

    # 2. Abre TIFF
    b04, b08 = open_sentinel_tiff(tiff_path)

    # 3. Metadados espaciais
    with rasterio.open(tiff_path) as src:
        pixel_area_m2 = src.transform.a * abs(src.transform.e)

    # 4. Índices
    ndvi = calculate_ndvi(b04, b08)
    savi = calculate_savi(b04, b08)

    vegetation_index = savi if index_type == "savi" else ndvi

    # 5. Biomassa (t/ha)
    biomass = estimate_biomass(vegetation_index)

    # 6. Carbono (tC por pixel)
    carbon_fraction = 0.47
    carbon = (biomass * pixel_area_m2 / 10_000) * carbon_fraction

    # 7. Métricas finais
    valid_pixels = np.count_nonzero(~np.isnan(carbon))
    area_hectares = (valid_pixels * pixel_area_m2) / 10_000

    total_carbon = float(np.nansum(carbon))
    carbon_per_ha = total_carbon / area_hectares if area_hectares > 0 else 0

    # 8. Heatmap
    heatmap_path = f"data/heatmaps/carbon_{datetime.utcnow().timestamp()}.png"
    generate_carbon_heatmap(carbon, heatmap_path)

    # 9. Persistência
    estimation_data = {
        "geometry": geometry,
        "total_carbon_tons": total_carbon,
        "carbon_per_hectare": carbon_per_ha,
        "ndvi_mean": float(np.nanmean(ndvi)),
        "savi_mean": float(np.nanmean(savi)),
        "heatmap_url": heatmap_path,
        "created_at": datetime.utcnow().isoformat()
    }

    saved = save_carbon_estimation(estimation_data)

    # 10. RETORNO (DoD)
    return {
        "estimation_id": saved[0]["id"] if saved else None,
        "total_carbon_tons": total_carbon,
        "carbon_per_hectare": float(carbon_per_ha),
        "ndvi_mean": float(np.nanmean(ndvi)),
        "savi_mean": float(np.nanmean(savi)),
        "heatmap_url": heatmap_path,
        "units": {
            "total_carbon": "tC",
            "carbon_per_hectare": "tC/ha"
    }
}


def open_sentinel_tiff(tiff_path: str):
    with rasterio.open(tiff_path) as src:
        b04 = src.read(1).astype("float32")  # RED
        b08 = src.read(2).astype("float32")  # NIR

    return b04, b08


def calculate_ndvi(b04, b08):
    np.seterr(divide="ignore", invalid="ignore")

    # NDVI = (NIR - RED) / (NIR + RED)
    ndvi = (b08 - b04) / (b08 + b04)

    return ndvi


def estimate_biomass(
    vegetation_index,
    biome="caatinga",
    model="linear"
):
    """
    Estimativa de biomassa acima do solo (AGB) para bioma Caatinga.

    Modelo empírico baseado em SAVI/NDVI, adequado para vegetação esparsa,
    com forte influência do solo exposto.

    Biomassa = a * Índice + b

    Coeficientes aproximados adaptados para Caatinga
    (estimativa inicial – calibração futura recomendada).
    """

    if biome == "caatinga":
        a, b = 65.0, -10.0
    else:
        raise ValueError("Bioma não suportado")

    if model == "linear":
        biomass = a * vegetation_index + b
    else:
        raise ValueError("Modelo não suportado")

    biomass[biomass < 0] = 0
    return biomass



def estimate_carbon(biomass):
    # IPCC: ~47% da biomassa seca é carbono
    carbon = biomass * 0.47
    return carbon

def calculate_savi(b04, b08, L=0.5):
    """
    SAVI = Soil Adjusted Vegetation Index
    Reduz influência do solo exposto.
    L = 0.5 (valor padrão para vegetação intermediária)
    """
    np.seterr(divide="ignore", invalid="ignore")
    savi = ((b08 - b04) / (b08 + b04 + L)) * (1 + L)
    return savi

