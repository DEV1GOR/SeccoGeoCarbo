from backend.celery_app import celery_app
from backend.services.sentinel.carbon_processing_service import (
    process_carbon_estimation
)

@celery_app.task(
    name="backend.tasks.carbon_task.calculate_carbon_stock_task",
    bind=True
)
def calculate_carbon_stock_task(self, geometry: dict, index_type: str):
    return process_carbon_estimation(
        geometry=geometry,
        index_type=index_type
    )
