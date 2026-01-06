import random

class CarbonEstimatorService:
    """
    Serviço responsável por estimar o estoque de carbono.
    Atualmente opera em modo MOCK (Simulação) para desenvolvimento do Front.
    """
    
    def estimate(self, area_hectares: float) -> float:
        # Lógica Mock: Retornar valor baseado na área
        # Fórmula fictícia: Cada hectare tem em média 120 toneladas de carbono
        # Adicionamos um fator aleatório entre 0.9 e 1.1 para variar um pouco
        base_factor = 120.0 
        random_variation = random.uniform(0.9, 1.1)
        
        total_carbon = area_hectares * base_factor * random_variation
        
        return round(total_carbon, 2)

# Instância única para ser usada na aplicação
carbon_service = CarbonEstimatorService()