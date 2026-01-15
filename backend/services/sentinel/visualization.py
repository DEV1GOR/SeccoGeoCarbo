import matplotlib.pyplot as plt
import numpy as np
import os

def generate_carbon_heatmap(carbon: np.ndarray, output_path: str):
    import os
    import matplotlib.pyplot as plt
    import numpy as np

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    plt.figure(figsize=(12, 12))

    vmax = np.nanpercentile(carbon, 95)

    plt.imshow(
        carbon,
        cmap="RdYlGn",          #  vermelho → amarelo → verde
        interpolation="bicubic",#  suaviza os pixels
        vmin=0,
        vmax=vmax
    )

    cbar = plt.colorbar()
    cbar.set_label("Estoque de Carbono (tC/ha)", fontsize=12)

    plt.title("Mapa de Carbono – Caatinga", fontsize=14)
    plt.axis("off")

    plt.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close()

    return output_path
