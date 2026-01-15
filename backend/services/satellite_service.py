import rasterio
import numpy as np

def load_bands(red_path: str, nir_path: str):
    with rasterio.open(red_path) as red:
        red_band = red.read(1).astype(float)

    with rasterio.open(nir_path) as nir:
        nir_band = nir.read(1).astype(float)

    return red_band, nir_band

def calculate_ndvi(red, nir):
    np.setter(divide='ignore', invalid='ignore' )

    ndvi = (red - nir) / (red + nir)

    return np.nan_to_num(ndvi)