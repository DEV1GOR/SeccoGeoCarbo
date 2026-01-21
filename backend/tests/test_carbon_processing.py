from backend.services.sentinel.carbon_processing_service import process_carbon_estimation


# Geometria de teste (polígono simples)
geometry = {
    "type": "Polygon",
    "coordinates": [
        [
            [-36.0, -8.0],
            [-36.0, -8.01],
            [-35.99, -8.01],
            [-35.99, -8.0],
            [-36.0, -8.0]
        ]
    ]
}

result = process_carbon_estimation(geometry)

print(result)
