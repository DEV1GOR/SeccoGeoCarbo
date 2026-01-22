from celery import Celery
#  [SERGIO]


"""
Configuração principal do Celery.

Este módulo inicializa a aplicação Celery responsável por:
- Enfileirar tarefas assíncronas
- Executar processamento pesado em background
- Comunicar-se com o Redis (broker + backend)

Arquitetura:
FastAPI (API) -> Redis (fila) -> Celery Worker (processamento)
"""

celery_app = Celery(
    "backend",

    # Redis atua como BROKER:
    # - Recebe as mensagens (tasks) enviadas pela API
    # - Gerencia a fila de execução
    broker="redis://localhost:6379/0",

    # Redis também atua como RESULT BACKEND:
    # - Armazena o estado da task (PENDING, STARTED, SUCCESS, FAILURE)
    # - Armazena o resultado final quando a task termina
    backend="redis://localhost:6379/0",

    # Lista explícita de módulos onde o Celery deve buscar tasks
    # Isso garante que as tasks sejam registradas corretamente no worker
    include=["backend.tasks.carbon_task"],
)

"""
==============================================
COMANDOS PARA RODAR O PROJETO (DESENVOLVIMENTO)
==============================================

1️⃣ Subir o Redis (fila e backend do Celery)

docker run -d -p 6379:6379 redis

2️⃣ Iniciar o worker do Celery

celery -A backend.celery_app.celery_app worker --loglevel=info


3️⃣ Iniciar a API FastAPI

uvicorn backend.main:app --reload

"""
