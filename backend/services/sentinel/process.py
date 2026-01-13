import requests
import os
from datetime import datetime

from services.sentinel.auth import get_sentinel_token
from services.sentinel.repository import save_satellite_metadata


PROCESS_URL = "https://services.sentinel-hub.com/api/v1/process"

def get_latest_sentinel_image(geometry):
    token = get_sentinel_token()

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "input": {
            "bounds": {
                "geometry": geometry
            },
            "data": [
                {
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "timeRange": {
                            "from": "2024-01-01T00:00:00Z",
                            "to": "2024-12-31T23:59:59Z"
                        },
                        "maxCloudCoverage": 10
                    }
                }
            ]
        },
        "output": {
            "responses": [
                {
                    "identifier": "default",
                    "format": {
                        "type": "image/tiff"
                    }
                }
            ]
        },
        "evalscript": """
        //VERSION=3
        function setup() {
            return {
                input: ["B04", "B08"],
                output: { bands: 2 }
            };
        }

        function evaluatePixel(sample) {
            return [sample.B04, sample.B08];
        }
        """
    }

    response = requests.post(
        PROCESS_URL,
        headers=headers,
        json=payload,
        timeout=60
    )

    response.raise_for_status()

    # cria nome do arquivo
    image_date = datetime.utcnow().date().isoformat()
    filename = f"sentinel_{image_date}.tiff"

    # caminho onde salvar
    output_dir = "data/images"
    os.makedirs(output_dir, exist_ok=True)
    output_path = f"{output_dir}/{filename}"

    # salva o arquivo no backend
    with open(output_path, "wb") as f:
        f.write(response.content)

    print("Imagem salva com sucesso:", output_path)

    # salva metadados no Supabase
    save_satellite_metadata(
    satellite="sentinel-2",
    acquisition_date=image_date,
    file_path=output_path,
    geometry=geometry,
    cloud_coverage=10
)


    # retorna caminho do arquivo
    return output_path