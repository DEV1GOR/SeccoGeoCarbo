from backend.services.sentinel.carbon_processing_service import process_carbon_estimation

# backend/services/carbon_service.py

class CarbonEstimatorService:

    def process_carbon_estimation(self, geometry: dict, index_type="savi"):
        from backend.services.sentinel.carbon_processing_service import process_carbon_estimation

        return process_carbon_estimation(
            geometry=geometry,
            index_type=index_type
        )


carbon_service = CarbonEstimatorService()
